import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Palette, 
  MessageSquare, 
  Settings, 
  Save,
  Eye,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

const Assistant = () => {
  const [assistantConfig, setAssistantConfig] = useState({
    name: 'Asistente IA',
    personality: 'amigable',
    greeting: '¡Hola! ¿En qué puedo ayudarte hoy?',
    fallbackMessage: 'Lo siento, no entendí tu consulta. ¿Podrías reformularla?',
    widget: {
      primaryColor: '#6366f1',
      secondaryColor: '#f3f4f6',
      position: 'bottom-right',
      size: 'medium',
      borderRadius: 12,
      showAvatar: true,
      showTyping: true
    },
    behavior: {
      responseDelay: 1,
      maxResponseLength: 200,
      enableEmojis: true,
      enableSuggestions: true
    }
  });

  const { toast } = useToast();

  const handleConfigChange = (section, field, value) => {
    setAssistantConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('assistantConfig', JSON.stringify(assistantConfig));
    toast({
      title: "¡Configuración guardada!",
      description: "Los cambios en tu asistente IA han sido aplicados.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "🚧 Esta función no está implementada aún",
      description: "¡No te preocupes! Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asistente IA</h1>
          <p className="text-gray-600 mt-1">
            Personaliza tu asistente virtual y configura el widget para tu sitio web
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="w-4 h-4 mr-2" />
            Vista Previa
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuración */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personality" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personality" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Personalidad
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Apariencia
              </TabsTrigger>
              <TabsTrigger value="behavior" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Comportamiento
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personality">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Personalidad del Asistente</h3>
                      <p className="text-gray-600">Define cómo se comportará tu asistente IA</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="assistantName">Nombre del Asistente</Label>
                      <Input
                        id="assistantName"
                        value={assistantConfig.name}
                        onChange={(e) => setAssistantConfig(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Sofia, Alex, Asistente Virtual"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personality">Estilo de Personalidad</Label>
                      <select
                        id="personality"
                        value={assistantConfig.personality}
                        onChange={(e) => setAssistantConfig(prev => ({ ...prev, personality: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        value={assistantConfig.greeting}
                        onChange={(e) => setAssistantConfig(prev => ({ ...prev, greeting: e.target.value }))}
                        placeholder="El primer mensaje que verán tus visitantes"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fallback">Mensaje de No Comprensión</Label>
                      <Textarea
                        id="fallback"
                        value={assistantConfig.fallbackMessage}
                        onChange={(e) => setAssistantConfig(prev => ({ ...prev, fallbackMessage: e.target.value }))}
                        placeholder="Mensaje cuando no entienda una consulta"
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="appearance">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Apariencia del Widget</h3>
                      <p className="text-gray-600">Personaliza cómo se ve el chat en tu sitio</p>
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
                            value={assistantConfig.widget.primaryColor}
                            onChange={(e) => handleConfigChange('widget', 'primaryColor', e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={assistantConfig.widget.primaryColor}
                            onChange={(e) => handleConfigChange('widget', 'primaryColor', e.target.value)}
                            placeholder="#6366f1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Color Secundario</Label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            id="secondaryColor"
                            value={assistantConfig.widget.secondaryColor}
                            onChange={(e) => handleConfigChange('widget', 'secondaryColor', e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300"
                          />
                          <Input
                            value={assistantConfig.widget.secondaryColor}
                            onChange={(e) => handleConfigChange('widget', 'secondaryColor', e.target.value)}
                            placeholder="#f3f4f6"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Posición del Widget</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'bottom-right', label: 'Abajo Derecha' },
                          { value: 'bottom-left', label: 'Abajo Izquierda' },
                          { value: 'top-right', label: 'Arriba Derecha' },
                          { value: 'top-left', label: 'Arriba Izquierda' }
                        ].map((position) => (
                          <button
                            key={position.value}
                            onClick={() => handleConfigChange('widget', 'position', position.value)}
                            className={`p-3 text-sm rounded-lg border transition-all ${
                              assistantConfig.widget.position === position.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {position.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tamaño del Widget</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'small', label: 'Pequeño' },
                          { value: 'medium', label: 'Mediano' },
                          { value: 'large', label: 'Grande' }
                        ].map((size) => (
                          <button
                            key={size.value}
                            onClick={() => handleConfigChange('widget', 'size', size.value)}
                            className={`p-3 text-sm rounded-lg border transition-all ${
                              assistantConfig.widget.size === size.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Radio de Borde: {assistantConfig.widget.borderRadius}px</Label>
                        <Slider
                          value={[assistantConfig.widget.borderRadius]}
                          onValueChange={(value) => handleConfigChange('widget', 'borderRadius', value[0])}
                          max={24}
                          min={0}
                          step={2}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assistantConfig.widget.showAvatar}
                            onChange={(e) => handleConfigChange('widget', 'showAvatar', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Mostrar Avatar</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={assistantConfig.widget.showTyping}
                            onChange={(e) => handleConfigChange('widget', 'showTyping', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Indicador de Escritura</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="behavior">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Comportamiento</h3>
                      <p className="text-gray-600">Configura cómo responde tu asistente</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Retraso de Respuesta: {assistantConfig.behavior.responseDelay}s</Label>
                      <Slider
                        value={[assistantConfig.behavior.responseDelay]}
                        onValueChange={(value) => handleConfigChange('behavior', 'responseDelay', value[0])}
                        max={5}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        Tiempo de espera antes de mostrar la respuesta (simula escritura)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Longitud Máxima de Respuesta: {assistantConfig.behavior.maxResponseLength} caracteres</Label>
                      <Slider
                        value={[assistantConfig.behavior.maxResponseLength]}
                        onValueChange={(value) => handleConfigChange('behavior', 'maxResponseLength', value[0])}
                        max={500}
                        min={50}
                        step={25}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assistantConfig.behavior.enableEmojis}
                          onChange={(e) => handleConfigChange('behavior', 'enableEmojis', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Usar Emojis en Respuestas</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={assistantConfig.behavior.enableSuggestions}
                          onChange={(e) => handleConfigChange('behavior', 'enableSuggestions', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">Mostrar Sugerencias</span>
                      </label>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Vista Previa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
            
            {/* Device Toggle */}
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

            {/* Widget Preview */}
            <div className="bg-gray-100 rounded-lg p-4 min-h-[300px] relative">
              <div className="absolute bottom-4 right-4">
                <div 
                  className="rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105"
                  style={{ 
                    backgroundColor: assistantConfig.widget.primaryColor,
                    width: assistantConfig.widget.size === 'small' ? '48px' : assistantConfig.widget.size === 'large' ? '64px' : '56px',
                    height: assistantConfig.widget.size === 'small' ? '48px' : assistantConfig.widget.size === 'large' ? '64px' : '56px'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <MessageSquare className="text-white" size={assistantConfig.widget.size === 'small' ? 20 : assistantConfig.widget.size === 'large' ? 28 : 24} />
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-500 text-sm mt-8">
                <p>Simulación de tu sitio web</p>
                <p className="text-xs mt-1">El widget aparecerá en la posición seleccionada</p>
              </div>
            </div>

            {/* Chat Preview */}
            <div className="mt-4 border rounded-lg overflow-hidden">
              <div 
                className="p-3 text-white text-sm font-medium"
                style={{ backgroundColor: assistantConfig.widget.primaryColor }}
              >
                {assistantConfig.name}
              </div>
              <div className="p-3 space-y-2 bg-white">
                <div className="bg-gray-100 rounded-lg p-2 text-sm">
                  {assistantConfig.greeting}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Vista previa del chat
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Assistant;