import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2, Palette, Bot, MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const AIAssistant = () => {
  const { client } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!client) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('assistant_config')
        .select('*')
        .eq('client_id', client.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setConfig(data);
      }
      setLoading(false);
    };
    fetchConfig();
  }, [client, toast]);

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('assistant_config')
      .update({
        assistant_name: config.assistant_name,
        welcome_message: config.welcome_message,
        widget_color: config.widget_color,
        widget_position: config.widget_position,
      })
      .eq('client_id', client.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ ¡Guardado!", description: "La configuración de tu asistente ha sido actualizada." });
    }
    setLoading(false);
  };

  if (loading || !config) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>Asistente IA - Configuración</title>
      </Helmet>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asistente IA</h1>
            <p className="text-muted-foreground">Personaliza el nombre, apariencia y comportamiento de tu asistente.</p>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center"><Bot className="mr-3 h-6 w-6 text-primary" />Identidad del Asistente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assistant_name">Nombre del Asistente</Label>
                  <Input id="assistant_name" value={config.assistant_name} onChange={(e) => handleInputChange('assistant_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome_message">Mensaje de Bienvenida</Label>
                  <Input id="welcome_message" value={config.welcome_message} onChange={(e) => handleInputChange('welcome_message', e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center"><Palette className="mr-3 h-6 w-6 text-primary" />Estilo del Widget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label>Color Principal</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{config.widget_color}</span>
                    <Input type="color" value={config.widget_color} onChange={(e) => handleInputChange('widget_color', e.target.value)} className="w-12 h-10 p-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Posición del Widget</Label>
                  <select
                    value={config.widget_position}
                    onChange={(e) => handleInputChange('widget_position', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="bottom-right">Abajo a la derecha</option>
                    <option value="bottom-left">Abajo a la izquierda</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="sticky top-6 self-start">
             <Card>
                <CardHeader>
                    <CardTitle>Vista Previa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted/40 rounded-lg p-4 min-h-[300px] flex justify-center items-center">
                        <div className="text-center text-muted-foreground text-sm">
                            <p>Tu sitio web</p>
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-lg shadow-lg bg-card border border-border">
                        <div style={{ backgroundColor: config.widget_color }} className="rounded-t-lg p-3 text-white font-bold">
                            {config.assistant_name}
                        </div>
                        <div className="p-4 bg-background">
                            <div className="bg-muted p-3 rounded-lg text-sm">
                                {config.welcome_message}
                            </div>
                        </div>
                    </div>
                     <div className="absolute bottom-10 right-10">
                        <div
                            style={{ backgroundColor: config.widget_color }}
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer"
                        >
                            <MessageSquare size={28} />
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;