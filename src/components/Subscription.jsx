import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Calendar, 
  AlertCircle,
  Check,
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
  getCurrentSubscription,
  consumeTokens
} from '@/services/stripeService';

const Subscription = () => {
  const { client } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getTokenUsagePercentage = () => {
    if (!subscription) return 0;
    const totalTokens = 10000; // Plan gratuito
    return ((totalTokens - subscription.tokens_remaining) / totalTokens) * 100;
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
        <title>Suscripción - NNIA</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suscripción</h1>
            <p className="text-muted-foreground">Tu plan actual y uso de tokens</p>
          </div>
        </div>

        {/* Estado actual de la suscripción */}
        {subscription ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Plan actual */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Plan Gratuito</CardTitle>
                      <p className="text-sm text-muted-foreground">Plan básico con tokens limitados</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Activo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Tokens restantes:</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTokens(subscription.tokens_remaining)} / 10K
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Renovación:</span>
                    <span className="text-sm text-muted-foreground">Mensual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Estado:</span>
                    <span className="text-sm text-muted-foreground capitalize">
                      {subscription.status}
                    </span>
                  </div>
                </div>
                
                {/* Barra de progreso de tokens */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uso de tokens</span>
                    <span>{getTokenUsagePercentage().toFixed(1)}%</span>
                  </div>
                  <Progress value={getTokenUsagePercentage()} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Características incluidas:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        10,000 tokens por mes
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Asistente IA básico
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Soporte por email
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Próximamente:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Crown className="h-3 w-3 text-yellow-600" />
                        Planes premium
                      </li>
                      <li className="flex items-center gap-2">
                        <Crown className="h-3 w-3 text-yellow-600" />
                        Más tokens
                      </li>
                      <li className="flex items-center gap-2">
                        <Crown className="h-3 w-3 text-yellow-600" />
                        Funciones avanzadas
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aviso de desarrollo */}
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                      Sistema de pagos en desarrollo
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Actualmente estamos trabajando en la integración de pagos. 
                      Por ahora, disfruta del plan gratuito con 10,000 tokens mensuales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-muted-foreground">Cargando información de suscripción...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Subscription;