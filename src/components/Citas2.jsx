import React, { useEffect, useState } from 'react';
import { Loader2, Pencil, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import AppointmentPreferencesForm from './AppointmentPreferencesForm';
import { fetchAppointments, fetchAvailability, saveAvailability, updateAppointment, deleteAppointment } from '@/services/appointmentsService';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_AVAILABILITY = { days: [], hours: '', types: ['phone', 'office', 'video'] };
const STATUS_LABELS = {
  pending: { label: 'Pendiente', icon: <Clock className="inline mr-1 text-yellow-500" size={18} /> },
  completed: { label: 'Completada', icon: <CheckCircle2 className="inline mr-1 text-green-600" size={18} /> },
  cancelled: { label: 'No realizada', icon: <XCircle className="inline mr-1 text-red-500" size={18} /> },
};

function groupByStatus(appointments) {
  return appointments.reduce((acc, appt) => {
    const status = appt.status || 'pending';
    if (!acc[status]) acc[status] = [];
    acc[status].push(appt);
    return acc;
  }, {});
}

export default function Citas2() {
  const { client, loading: authLoading } = useAuth();
  const [availability, setAvailability] = useState(DEFAULT_AVAILABILITY);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null); // cita en edición
  const [editData, setEditData] = useState({});
  const [deleting, setDeleting] = useState(null); // cita a eliminar

  useEffect(() => {
    if (!client) return;
    setLoading(true);
    Promise.all([
      fetchAppointments(client.id),
      fetchAvailability(client.id)
    ])
      .then(([appts, avail]) => {
        setAppointments(Array.isArray(appts) ? appts : []);
        setAvailability(avail || DEFAULT_AVAILABILITY);
        setError(null);
      })
      .catch(() => {
        setAppointments([]);
        setError('No se pudo cargar la información de citas');
      })
      .finally(() => setLoading(false));
  }, [client]);

  const handleSave = async () => {
    if (!client) return;
    setSaving(true);
    try {
      await saveAvailability({ ...availability, clientId: client.id });
      setError(null);
    } catch {
      setError('No se pudo guardar la disponibilidad');
    }
    setSaving(false);
  };

  const handleEdit = (appt) => {
    setEditing(appt.id);
    setEditData({ ...appt });
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    try {
      const updated = await updateAppointment(editing, editData);
      setAppointments(appts => appts.map(a => a.id === editing ? updated : a));
      setEditing(null);
    } catch {
      setError('No se pudo actualizar la cita');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAppointment(deleting);
      setAppointments(appts => appts.filter(a => a.id !== deleting));
      setDeleting(null);
    } catch {
      setError('No se pudo eliminar la cita');
    }
  };

  const handleStatusChange = async (appt, newStatus) => {
    try {
      const updated = await updateAppointment(appt.id, { status: newStatus });
      setAppointments(appts => appts.map(a => a.id === appt.id ? updated : a));
    } catch {
      setError('No se pudo cambiar el estado');
    }
  };

  if (authLoading || !client) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Cargando...</div>;
  }

  const grouped = groupByStatus(appointments);

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-2">Citas</h1>
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Cargando...</div>
      )}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>
      )}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Citas Agendadas</h2>
        {appointments.length === 0 ? (
          <div className="text-muted-foreground text-center p-4 bg-yellow-50 rounded border border-yellow-200">
            <strong>No hay citas agendadas aún.</strong><br />
            Cuando NNIA o tus clientes agenden una cita, aparecerá aquí.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {Object.entries(STATUS_LABELS).map(([status, { label, icon }]) => (
              <div key={status}>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">{icon} {label}</h3>
                <div className="space-y-4">
                  {(grouped[status] || []).map((appt) => (
                    <div key={appt.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white/80">
                      {editing === appt.id ? (
                        <div className="flex flex-col gap-2 w-full">
                          <input className="border rounded px-2 py-1" value={editData.name || ''} onChange={e => handleEditChange('name', e.target.value)} placeholder="Nombre" />
                          <input className="border rounded px-2 py-1" value={editData.email || ''} onChange={e => handleEditChange('email', e.target.value)} placeholder="Email" />
                          <input className="border rounded px-2 py-1" value={editData.date || ''} onChange={e => handleEditChange('date', e.target.value)} placeholder="Fecha" />
                          <input className="border rounded px-2 py-1" value={editData.time || ''} onChange={e => handleEditChange('time', e.target.value)} placeholder="Hora" />
                          <input className="border rounded px-2 py-1" value={editData.type || ''} onChange={e => handleEditChange('type', e.target.value)} placeholder="Tipo" />
                          <div className="flex gap-2 mt-2">
                            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleEditSave}>Guardar</button>
                            <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setEditing(null)}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="font-semibold">{appt.name} ({appt.email})</div>
                            <div className="text-sm text-muted-foreground">{appt.type} - {appt.date} {appt.time}</div>
                            <div className="text-xs text-muted-foreground">Origen: {appt.origin}</div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <select value={appt.status || 'pending'} onChange={e => handleStatusChange(appt, e.target.value)} className="border rounded px-2 py-1">
                              <option value="pending">Pendiente</option>
                              <option value="completed">Completada</option>
                              <option value="cancelled">No realizada</option>
                            </select>
                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Editar" onClick={() => handleEdit(appt)}><Pencil size={18} /></button>
                            <button className="p-1 text-red-600 hover:bg-red-100 rounded" title="Eliminar" onClick={() => setDeleting(appt.id)}><Trash2 size={18} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Configura tu Disponibilidad</h2>
        <AppointmentPreferencesForm
          availability={availability}
          setAvailability={setAvailability}
          saving={saving}
          onSave={handleSave}
        />
      </section>
      {/* Modal de confirmación de eliminación */}
      {deleting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">¿Eliminar cita?</h3>
            <p className="mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setDeleting(null)}>Cancelar</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 