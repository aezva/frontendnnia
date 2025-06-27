import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Phone, MapPin, Video } from 'lucide-react';

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
            <Button key={day} type="button" variant={availability.days.includes(day) ? 'default' : 'outline'} onClick={() => handleToggleDay(day)}>{day}</Button>
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
            <Button key={type.value} type="button" variant={availability.types.includes(type.value) ? 'default' : 'outline'} onClick={() => handleToggleType(type.value)}>{type.icon} {type.label}</Button>
          ))}
        </div>
      </div>
      <Button onClick={onSave} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar Disponibilidad'}</Button>
    </div>
  );
} 