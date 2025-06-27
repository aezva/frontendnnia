import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const BehaviorSettings = ({ config, handleConfigChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-card/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Comportamiento</h3>
            <p className="text-muted-foreground">Configura cómo responde tu asistente.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Retraso de Respuesta: {config.responseDelay}s</Label>
            <Slider
              value={[config.responseDelay]}
              onValueChange={(value) => handleConfigChange('behavior', 'responseDelay', value[0])}
              max={5}
              min={0}
              step={0.5}
            />
            <p className="text-xs text-muted-foreground">
              Tiempo de espera antes de mostrar la respuesta (simula escritura).
            </p>
          </div>

          <div className="space-y-2">
            <Label>Longitud Máxima de Respuesta: {config.maxResponseLength} caracteres</Label>
            <Slider
              value={[config.maxResponseLength]}
              onValueChange={(value) => handleConfigChange('behavior', 'maxResponseLength', value[0])}
              max={500}
              min={50}
              step={25}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableEmojis}
                onChange={(e) => handleConfigChange('behavior', 'enableEmojis', e.target.checked)}
                className="rounded accent-primary"
              />
              <span className="text-sm">Usar Emojis en Respuestas</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableSuggestions}
                onChange={(e) => handleConfigChange('behavior', 'enableSuggestions', e.target.checked)}
                className="rounded accent-primary"
              />
              <span className="text-sm">Mostrar Sugerencias</span>
            </label>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BehaviorSettings;