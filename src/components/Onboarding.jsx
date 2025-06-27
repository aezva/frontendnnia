import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Camera, Building, PartyPopper } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import AppointmentPreferencesForm from './AppointmentPreferencesForm';

const steps = [
  { id: 1, name: 'Perfil de Usuario', fields: ['name', 'businessName'] },
  { id: 2, name: 'Datos del Negocio', fields: ['website', 'services', 'opening_hours'] },
  { id: 3, name: 'Preferencias de Citas' },
  { id: 4, name: 'Finalizar' },
];

const Onboarding = () => {
  const { client, refreshClient } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    website: '',
    services: '',
    opening_hours: '',
  });
  const [availability, setAvailability] = useState({
    days: [],
    hours: '',
    types: ['phone', 'office', 'video'],
  });

  const next = () => setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  const prev = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleComplete = async () => {
    try {
      // 1. Update client table
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          business_name: formData.businessName,
          onboarding_completed: true,
        })
        .eq('id', client.id);
      if (clientError) throw clientError;

      // 2. Create business_info record
      const { error: businessInfoError } = await supabase.from('business_info').insert({
        client_id: client.id,
        website: formData.website,
        services: formData.services,
        opening_hours: formData.opening_hours,
        appointment_days: availability.days.join(','),
        appointment_hours: availability.hours,
        appointment_types: availability.types.join(','),
      });
      if (businessInfoError) throw businessInfoError;

      // 3. Create default assistant_config
      const { error: assistantError } = await supabase
        .from('assistant_config')
        .insert({ client_id: client.id });
      if (assistantError) throw assistantError;
      
      // 4. Create default subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({ client_id: client.id, plan: 'free', status: 'active' });
       if (subError) throw subError;
      
      toast({
        title: "🎉 ¡Bienvenido a Bordo!",
        description: "Tu configuración inicial ha sido guardada.",
      });

      await refreshClient();

    } catch (error) {
      toast({
        title: "Error en el Onboarding",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step1 formData={formData} handleInputChange={handleInputChange} />;
      case 1:
        return <Step2 formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <AppointmentPreferencesForm availability={availability} setAvailability={setAvailability} saving={false} />;
      case 3:
        return <Step3 />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <Helmet>
        <title>Onboarding - Configura tu Asistente IA</title>
        <meta name="description" content="Completa los pasos para configurar tu asistente de IA personalizado." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary">Configura tu Asistente IA</h1>
            <p className="text-muted-foreground mt-2">Sigue los pasos para personalizar tu experiencia.</p>
          </div>

          <div className="mb-8">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{steps[currentStep].name}</span>
              <span>Paso {currentStep + 1} de {steps.length}</span>
            </div>
          </div>

          <Card className="bg-card border-border/40 shadow-lg">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
            <CardFooter className="flex justify-between p-8 pt-0">
              <Button variant="outline" onClick={prev} disabled={currentStep === 0}>
                Anterior
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={next}>Siguiente</Button>
              ) : (
                <Button onClick={handleComplete}>Ir al Panel</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

const Step1 = ({ formData, handleInputChange }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
        <Camera className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Tu Perfil</h2>
        <p className="text-muted-foreground">Información básica sobre ti y tu negocio.</p>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre completo</Label>
        <Input id="name" placeholder="Ej: Juan Pérez" value={formData.name} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="businessName">Nombre de tu negocio</Label>
        <Input id="businessName" placeholder="Ej: Tech Solutions S.A." value={formData.businessName} onChange={handleInputChange} />
      </div>
    </div>
  </div>
);

const Step2 = ({ formData, handleInputChange }) => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <Building className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Tu Negocio</h2>
        <p className="text-muted-foreground">Cuéntanos sobre la empresa que representas.</p>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="website">Sitio web</Label>
        <Input id="website" placeholder="https://www.techsolutions.com" value={formData.website} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="services">Servicios ofrecidos</Label>
        <Textarea id="services" placeholder="Describe brevemente los servicios que ofreces..." value={formData.services} onChange={handleInputChange} />
      </div>
      <div>
        <Label htmlFor="opening_hours">Horarios de atención</Label>
        <Input id="opening_hours" placeholder="Ej: Lunes a Viernes de 9:00 a 18:00" value={formData.opening_hours} onChange={handleInputChange} />
      </div>
    </div>
  </div>
);

const Step3 = () => (
  <div className="text-center py-8">
    <PartyPopper className="w-24 h-24 text-primary mx-auto mb-6 animate-bounce" />
    <h2 className="text-3xl font-bold">¡Todo listo!</h2>
    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
      Has completado la configuración inicial. Tu asistente de IA está casi listo para empezar a trabajar.
    </p>
  </div>
);

export default Onboarding;