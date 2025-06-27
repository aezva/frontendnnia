import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Globe, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  Save,
  Edit,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Business = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    businessHours: '',
    services: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    // Cargar datos del onboarding si existen
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setBusinessData(prev => ({
        ...prev,
        businessName: data.businessName || '',
        businessType: data.businessType || '',
        website: data.website || '',
        services: data.services || '',
        businessHours: data.businessHours || '',
        description: data.description || '',
        socialMedia: data.socialMedia || prev.socialMedia
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBusinessData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBusinessData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    // Simular guardado
    localStorage.setItem('businessData', JSON.stringify(businessData));
    setIsEditing(false);
    toast({
      title: "¡Información guardada!",
      description: "Los datos de tu negocio han sido actualizados correctamente.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Recargar datos guardados
    const savedData = localStorage.getItem('businessData');
    if (savedData) {
      setBusinessData(JSON.parse(savedData));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Negocio</h1>
          <p className="text-gray-600 mt-1">
            Gestiona la información de tu empresa y configura los datos que usará tu asistente IA
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Básica */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
                <p className="text-gray-600">Datos principales de tu negocio</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del Negocio</Label>
                <Input
                  id="businessName"
                  value={businessData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nombre de tu empresa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessType">Rubro/Industria</Label>
                <Input
                  id="businessType"
                  value={businessData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Ej: Restaurante, E-commerce, Consultoría"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email de Contacto
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={businessData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="contacto@tuempresa.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  value={businessData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+1 234 567 8900"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Sitio Web
                </Label>
                <Input
                  id="website"
                  value={businessData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://tuempresa.com"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Dirección
                </Label>
                <Input
                  id="address"
                  value={businessData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Dirección completa de tu negocio"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Negocio</Label>
                <Textarea
                  id="description"
                  value={businessData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Describe tu negocio, qué haces, tu propuesta de valor..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="services">Servicios/Productos Principales</Label>
                <Textarea
                  id="services"
                  value={businessData.services}
                  onChange={(e) => handleInputChange('services', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Lista los principales servicios o productos que ofreces"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessHours">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Horarios de Atención
                </Label>
                <Textarea
                  id="businessHours"
                  value={businessData.businessHours}
                  onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Ej: Lunes a Viernes 9:00 - 18:00, Sábados 9:00 - 14:00"
                  rows={2}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Redes Sociales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociales</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={businessData.socialMedia.facebook}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://facebook.com/tuempresa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={businessData.socialMedia.instagram}
                  onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://instagram.com/tuempresa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  value={businessData.socialMedia.twitter}
                  onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://twitter.com/tuempresa"
                />
              </div>
            </div>
          </Card>

          {/* Vista Previa */}
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">
                  {businessData.businessName || 'Nombre del Negocio'}
                </p>
                <p className="text-gray-600">
                  {businessData.businessType || 'Tipo de negocio'}
                </p>
              </div>
              
              {businessData.description && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-700 text-xs">
                    {businessData.description.substring(0, 100)}
                    {businessData.description.length > 100 && '...'}
                  </p>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Esta información será utilizada por tu asistente IA para responder consultas sobre tu negocio.
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Business;