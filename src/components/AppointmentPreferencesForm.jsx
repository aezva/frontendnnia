import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, MapPin, Video, CheckCircle2 } from 'lucide-react';

const APPOINTMENT_TYPES = [
  { value: 'phone', label: 'Llamada Telefónica', icon: <Phone className="h-4 w-4 inline" /> },
  { value: 'office', label: 'Visita en Oficina', icon: <MapPin className="h-4 w-4 inline" /> },
  { value: 'video', label: 'Videollamada', icon: <Video className="h-4 w-4 inline" /> },
];

const WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function AppointmentPreferencesForm({ availability, setAvailability, saving, onSave }) {
  const handleAvailabilityChange = (field, value) => {
    setAvailability(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleToggleType = (type) => {
    setAvailability(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Días disponibles</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {WEEKDAYS.map(day => (
            <Button
              key={day}
              type="button"
              variant={availability.days.includes(day) ? 'default' : 'outline'}
              className={availability.days.includes(day) ? 'ring-2 ring-primary font-bold' : ''}
              onClick={() => handleToggleDay(day)}
            >
              {availability.days.includes(day) && <CheckCircle2 className="inline mr-1 text-primary" size={18} />}
              {day}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label>Horarios disponibles</Label>
        <Input
          type="text"
          placeholder="Ej: 09:00-13:00, 15:00-18:00"
          value={availability.hours}
          onChange={e => handleAvailabilityChange('hours', e.target.value)}
        />
        <div className="text-xs text-muted-foreground mt-1">Puedes poner varios rangos separados por coma.</div>
      </div>
      <div>
        <Label>Tipos de cita disponibles</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {APPOINTMENT_TYPES.map(type => (
            <Button
              key={type.value}
              type="button"
              variant={availability.types.includes(type.value) ? 'default' : 'outline'}
              className={availability.types.includes(type.value) ? 'ring-2 ring-primary font-bold' : ''}
              onClick={() => handleToggleType(type.value)}
            >
              {availability.types.includes(type.value) && <CheckCircle2 className="inline mr-1 text-primary" size={18} />}
              {type.icon} {type.label}
            </Button>
          ))}
        </div>
      </div>
      {onSave && (
        <Button
          onClick={onSave}
          disabled={saving}
          className="w-full mt-4 py-3 text-lg font-bold bg-primary text-white hover:bg-primary/90"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar cambios de disponibilidad'}
        </Button>
      )}
    </div>
  );
} 