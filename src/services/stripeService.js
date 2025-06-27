import stripePromise from '@/lib/stripeClient';
import { supabase } from '@/lib/supabaseClient';

// Configuración de planes y precios
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    tokens: 10000,
    priceId: null,
    features: ['10K tokens/mes', 'Soporte básico', 'Widget básico']
  },
  starter: {
    name: 'Starter',
    price: 19,
    tokens: 150000,
    priceId: 'price_1RdfNTP1x2coidHcaMps3STo',
    features: ['150K tokens/mes', 'Soporte por email', 'Widget personalizable']
  },
  pro: {
    name: 'Pro',
    price: 49,
    tokens: 500000,
    priceId: 'price_1RdfO7P1x2coidHcPT71SJlt',
    features: ['500K tokens/mes', 'Soporte prioritario', 'Analytics avanzados', 'Integraciones']
  },
  ultra: {
    name: 'Ultra',
    price: 99,
    tokens: 1200000,
    priceId: 'price_1RdfOfP1x2coidHcln5m4KEi',
    features: ['1.2M tokens/mes', 'Soporte 24/7', 'API personalizada', 'Onboarding dedicado']
  }
};

export const TOKEN_PACKS = {
  pack1: {
    name: '150K Tokens',
    price: 5,
    tokens: 150000,
    priceId: 'price_1RdfS0P1x2coidHcafwMvRba'
  },
  pack2: {
    name: '400K Tokens',
    price: 10,
    tokens: 400000,
    priceId: 'price_1RdfT4P1x2coidHcbpqY6Wjh'
  }
};

// Crear sesión de checkout para suscripción
export const createSubscriptionCheckout = async (priceId, clientId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        clientId,
        mode: 'subscription'
      }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Crear sesión de checkout para compra de tokens
export const createTokenCheckout = async (priceId, clientId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        clientId,
        mode: 'payment'
      }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating token checkout session:', error);
    throw error;
  }
};

// Obtener suscripción actual del cliente
export const getCurrentSubscription = async (clientId) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error) {
      // Si no hay suscripción, crear una gratuita por defecto
      if (error.code === 'PGRST116') {
        const { data: newSubscription, error: insertError } = await supabase
          .from('subscriptions')
          .insert({
            client_id: clientId,
            plan: 'Free',
            status: 'active',
            tokens_remaining: 10000
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        return newSubscription;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

// Cancelar suscripción
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Error canceling subscription');
    }

    return result;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

// Actualizar suscripción
export const updateSubscription = async (subscriptionId, newPriceId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        newPriceId,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Error updating subscription');
    }

    return result;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

// Consumir tokens
export const consumeTokens = async (clientId, messageLength) => {
  try {
    const estimatedTokens = Math.ceil(messageLength * 1.2);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('tokens_remaining')
      .eq('client_id', clientId)
      .single();

    if (error) {
      throw error;
    }

    if (data.tokens_remaining < estimatedTokens) {
      throw new Error('Insufficient tokens');
    }

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        tokens_remaining: data.tokens_remaining - estimatedTokens 
      })
      .eq('client_id', clientId);

    if (updateError) {
      throw updateError;
    }

    return {
      tokensUsed: estimatedTokens,
      tokensRemaining: data.tokens_remaining - estimatedTokens
    };
  } catch (error) {
    console.error('Error consuming tokens:', error);
    throw error;
  }
};

// Obtener historial de pagos
export const getPaymentHistory = async (clientId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment-history?clientId=${clientId}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Error fetching payment history');
    }

    return result.payments;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
}; 