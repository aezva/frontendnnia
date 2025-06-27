import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Zap, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Check,
  X,
  Loader2,
  Crown,
  Star,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  PLANS, 
  TOKEN_PACKS,
  createSubscriptionCheckout,
  createTokenCheckout,
  getCurrentSubscription,
  cancelSubscription,
  updateSubscription
} from '@/services/stripeService';

const Subscription = () => {
  const { client } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    if (client) {
      loadSubscription();
    }
  }, [client]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await getCurrentSubscription(client.id);
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la información de suscripción',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planKey) => {
    try {
      setProcessing(true);
      const plan = PLANS[planKey];
      await createSubscriptionCheckout(plan.priceId, client.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleBuyTokens = async (packKey) => {
    try {
      setProcessing(true);
      const pack = TOKEN_PACKS[packKey];
      await createTokenCheckout(pack.priceId, client.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return;
    
    try {
      setProcessing(true);
      await cancelSubscription(subscription.stripe_subscription_id);
      toast({
        title: 'Suscripción cancelada',
        description: 'Tu suscripción se cancelará al final del período actual'
      });
      await loadSubscription();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleUpgradePlan = async (newPlanKey) => {
    if (!subscription?.stripe_subscription_id) return;
    
    try {
      setProcessing(true);
      const newPlan = PLANS[newPlanKey];
      await updateSubscription(subscription.stripe_subscription_id, newPlan.priceId);
      toast({
        title: 'Plan actualizado',
        description: 'Tu plan se actualizará en el próximo período de facturación'
      });
      await loadSubscription();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  const getPlanInfo = (planKey) => {
    return PLANS[planKey] || null;
  };

  const getTokenUsagePercentage = () => {
    if (!subscription) return 0;
    const plan = getPlanInfo(subscription.plan?.toLowerCase());
    if (!plan) return 0;
    return ((plan.tokens - subscription.tokens_remaining) / plan.tokens) * 100;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTokens = (tokens) => {
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(0)}K`;
    }
    return tokens.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Suscripción - Asistente IA</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suscripción</h1>
            <p className="text-muted-foreground">Gestiona tu plan y tokens</p>
          </div>
          {!subscription && (
            <Button onClick={() => setShowPlans(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Crown className="mr-2 h-4 w-4" />
              Ver Planes
            </Button>
          )}
        </div>

        {/* Estado actual de la suscripción */}
        {subscription ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {/* Información del plan */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Plan Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{subscription.plan}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${getPlanInfo(subscription.plan?.toLowerCase())?.price}/mes
                    </p>
                  </div>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {subscription.status === 'active' ? 'Activo' : subscription.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Renovación</span>
                    <span>{formatDate(subscription.current_period_end)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estado</span>
                    <span className="capitalize">{subscription.status}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPlans(true)}
                  >
                    Cambiar Plan
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCancelSubscription}
                    disabled={processing}
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancelar'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Uso de tokens */}
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Tokens Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tokens restantes</span>
                    <span className="font-medium">{formatTokens(subscription.tokens_remaining)}</span>
                  </div>
                  <Progress value={getTokenUsagePercentage()} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {formatTokens(getPlanInfo(subscription.plan?.toLowerCase())?.tokens - subscription.tokens_remaining)} de {formatTokens(getPlanInfo(subscription.plan?.toLowerCase())?.tokens)} tokens usados
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm"
                    onClick={() => handleBuyTokens('pack1')}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : `+${formatTokens(TOKEN_PACKS.pack1.tokens)}`}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleBuyTokens('pack2')}
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : `+${formatTokens(TOKEN_PACKS.pack2.tokens)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="bg-card/50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sin suscripción activa</h3>
              <p className="text-muted-foreground mb-4">
                Selecciona un plan para empezar a usar tu asistente IA
              </p>
              <Button onClick={() => setShowPlans(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Ver Planes Disponibles
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modal de planes */}
        {showPlans && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Planes Disponibles</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPlans(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <Card key={key} className="relative">
                    {key === 'pro' && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        {key === 'starter' && <Zap className="h-5 w-5" />}
                        {key === 'pro' && <Star className="h-5 w-5" />}
                        {key === 'ultra' && <Rocket className="h-5 w-5" />}
                        {plan.name}
                      </CardTitle>
                      <div className="text-3xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mes</span></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handleSubscribe(key)}
                        disabled={processing}
                      >
                        {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Seleccionar Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Packs de tokens */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Tokens Adicionales</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(TOKEN_PACKS).map(([key, pack]) => (
                    <Card key={key}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{pack.name}</h4>
                            <p className="text-sm text-muted-foreground">${pack.price} USD</p>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => handleBuyTokens(key)}
                            disabled={processing}
                          >
                            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Comprar'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Subscription;