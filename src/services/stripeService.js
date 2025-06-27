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

// Obtener suscripción actual del cliente (solo plan gratuito por ahora)
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

// Consumir tokens (solo verificación local)
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

// Funciones placeholder para Stripe (deshabilitadas temporalmente)
export const createSubscriptionCheckout = async (priceId, clientId) => {
  throw new Error('Stripe integration temporarily disabled');
};

export const createTokenCheckout = async (priceId, clientId) => {
  throw new Error('Stripe integration temporarily disabled');
};

export const cancelSubscription = async (subscriptionId) => {
  throw new Error('Stripe integration temporarily disabled');
};

export const updateSubscription = async (subscriptionId, newPriceId) => {
  throw new Error('Stripe integration temporarily disabled');
};

export const getPaymentHistory = async (clientId) => {
  return []; // Retorna array vacío por ahora
}; 