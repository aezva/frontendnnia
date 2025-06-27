import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const PersonalitySettings = ({ config, setConfig }) => {
  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-card/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Personalidad del Asistente</h3>
            <p className="text-muted-foreground">Define cómo se comportará tu asistente IA.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="assistantName">Nombre del Asistente</Label>
            <Input
              id="assistantName"
              value={config.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Sofia, Alex, Asistente Virtual"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personality">Estilo de Personalidad</Label>
            <select
              id="personality"
              value={config.personality}
              onChange={(e) => handleInputChange('personality', e.target.value)}
              className="w-full px-3 py-2 border border-input bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="amigable">Amigable y Cercano</option>
              <option value="profesional">Profesional y Formal</option>
              <option value="casual">Casual y Relajado</option>
              <option value="entusiasta">Entusiasta y Energético</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting">Mensaje de Bienvenida</Label>
            <Textarea
              id="greeting"
              value={config.greeting}
              onChange={(e) => handleInputChange('greeting', e.target.value)}
              placeholder="El primer mensaje que verán tus visitantes"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fallback">Mensaje de No Comprensión</Label>
            <Textarea
              id="fallback"
              value={config.fallbackMessage}
              onChange={(e) => handleInputChange('fallbackMessage', e.target.value)}
              placeholder="Mensaje cuando no entienda una consulta"
              rows={2}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PersonalitySettings;