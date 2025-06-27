import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const MyBusiness = () => {
  const { client } = useAuth();
  const { toast } = useToast();
  const [businessInfo, setBusinessInfo] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!client) return;
      setLoading(true);
      
      const { data: businessData, error: businessError } = await supabase
        .from('business_info')
        .select('*')
        .eq('client_id', client.id)
        .single();
        
      if (businessError && businessError.code !== 'PGRST116') {
        toast({ title: 'Error', description: businessError.message, variant: 'destructive' });
      } else {
        setBusinessInfo(businessData || {});
      }

      setClientInfo(client);
      setLoading(false);
    };

    fetchData();
  }, [client, toast]);

  const handleBusinessChange = (e) => {
    setBusinessInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClientChange = (e) => {
    setClientInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error: clientError } = await supabase
      .from('clients')
      .update({ business_name: clientInfo.business_name })
      .eq('id', client.id);

    if (clientError) {
      toast({ title: 'Error', description: clientError.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const { error: businessError } = await supabase
      .from('business_info')
      .update(businessInfo)
      .eq('client_id', client.id);
      
    if (businessError) {
      toast({ title: 'Error', description: businessError.message, variant: 'destructive' });
    } else {
      toast({
        title: "✅ ¡Guardado!",
        description: "La información de tu negocio ha sido actualizada.",
      });
    }
    setLoading(false);
  };

  if (loading && !businessInfo) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>Mi Negocio - Asistente IA</title>
      </Helmet>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Negocio</h1>
          <p className="text-muted-foreground">Esta información ayudará a tu asistente a responder con precisión.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Datos básicos de tu empresa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Nombre del Negocio</Label>
                  <Input id="business_name" value={clientInfo?.business_name || ''} onChange={handleClientChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web</Label>
                  <Input id="website" value={businessInfo?.website || ''} onChange={handleBusinessChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-card/50">
            <CardHeader>
              <CardTitle>Detalles Operativos</CardTitle>
              <CardDescription>Información que el asistente usará en las conversaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="description">Descripción del negocio</Label>
                <Textarea id="description" rows={3} value={businessInfo?.description || ''} onChange={handleBusinessChange} placeholder="Describe tu negocio, ¿qué haces y a quién ayudas?"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="services">Servicios Ofrecidos</Label>
                <Textarea id="services" rows={5} value={businessInfo?.services || ''} onChange={handleBusinessChange} placeholder="Lista tus servicios principales, uno por línea."/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="opening_hours">Horarios de Atención</Label>
                <Input id="opening_hours" value={businessInfo?.opening_hours || ''} onChange={handleBusinessChange} placeholder="Lunes a Viernes de 9:00 a 18:00"/>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MyBusiness;