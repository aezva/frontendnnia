import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const AppearanceSettings = ({ config, handleConfigChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-card/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Apariencia del Widget</h3>
            <p className="text-muted-foreground">Personaliza cómo se ve el chat en tu sitio.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Color Principal</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="primaryColor"
                  value={config.primaryColor}
                  onChange={(e) => handleConfigChange('widget', 'primaryColor', e.target.value)}
                  className="p-1 h-10 w-12 block bg-transparent border border-input rounded-md cursor-pointer"
                />
                <Input
                  value={config.primaryColor}
                  onChange={(e) => handleConfigChange('widget', 'primaryColor', e.target.value)}
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Color Secundario</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="secondaryColor"
                  value={config.secondaryColor}
                  onChange={(e) => handleConfigChange('widget', 'secondaryColor', e.target.value)}
                  className="p-1 h-10 w-12 block bg-transparent border border-input rounded-md cursor-pointer"
                />
                <Input
                  value={config.secondaryColor}
                  onChange={(e) => handleConfigChange('widget', 'secondaryColor', e.target.value)}
                  placeholder="#f3f4f6"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Posición del Widget</Label>
            <div className="grid grid-cols-2 gap-3">
              {['bottom-right', 'bottom-left', 'top-right', 'top-left'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => handleConfigChange('widget', 'position', pos)}
                  className={`p-3 text-sm rounded-lg border transition-all ${
                    config.position === pos
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-border/60'
                  }`}
                >
                  {pos.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Radio de Borde: {config.borderRadius}px</Label>
              <Slider
                value={[config.borderRadius]}
                onValueChange={(value) => handleConfigChange('widget', 'borderRadius', value[0])}
                max={24}
                min={0}
                step={2}
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showAvatar}
                  onChange={(e) => handleConfigChange('widget', 'showAvatar', e.target.checked)}
                  className="rounded accent-primary"
                />
                <span className="text-sm">Mostrar Avatar</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AppearanceSettings;