import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, MessageSquare } from 'lucide-react';

const AssistantPreview = ({ config }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-6 sticky top-6 bg-card/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Vista Previa</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm">
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button variant="outline" size="sm">
            <Smartphone className="w-4 h-4 mr-1" />
            Móvil
          </Button>
        </div>

        <div className="bg-muted/40 rounded-lg p-4 min-h-[300px] relative">
          <div className="absolute bottom-4 right-4">
            <div 
              className="rounded-full shadow-lg cursor-pointer transition-all hover:scale-105"
              style={{ 
                backgroundColor: config.widget.primaryColor,
                width: '56px',
                height: '56px',
                borderRadius: `${config.widget.borderRadius}px`
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <MessageSquare className="text-white" size={24} />
              </div>
            </div>
          </div>
          
          <div className="text-center text-muted-foreground text-sm mt-8">
            <p>Simulación de tu sitio web</p>
            <p className="text-xs mt-1">El widget aparecerá en la posición seleccionada</p>
          </div>
        </div>

        <div className="mt-4 border border-border rounded-lg overflow-hidden">
          <div 
            className="p-3 text-white text-sm font-medium"
            style={{ backgroundColor: config.widget.primaryColor, color: '#FFFFFF' }}
          >
            {config.name}
          </div>
          <div className="p-3 space-y-2 bg-card">
            <div className="bg-muted rounded-lg p-2 text-sm text-foreground">
              {config.greeting}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Vista previa del chat
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AssistantPreview;