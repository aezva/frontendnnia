import axios from 'axios';

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchAppointments(clientId) {
  console.log('🔍 appointmentsService: Llamando a fetchAppointments con clientId =', clientId);
  console.log('🔍 appointmentsService: URL =', `${API_URL}/nnia/appointments`);
  
  const res = await axios.get(`${API_URL}/nnia/appointments`, { params: { clientId } });
  console.log('🔍 appointmentsService: Respuesta del backend:', res.data);
  
  return res.data.appointments;
}

export async function createAppointment(appointment) {
  const res = await axios.post(`${API_URL}/nnia/appointments`, appointment);
  return res.data.appointment;
}

export async function fetchAvailability(clientId) {
  const res = await axios.get(`${API_URL}/nnia/availability`, { params: { clientId } });
  return res.data.availability;
}

export async function saveAvailability({ clientId, days, hours, types }) {
  const res = await axios.post(`${API_URL}/nnia/availability`, { clientId, days, hours, types });
  return res.data.availability;
}

export async function updateAppointment(id, updates) {
  const res = await axios.put(`${API_URL}/nnia/appointments/${id}`, updates);
  return res.data.appointment;
}

export async function deleteAppointment(id) {
  const res = await axios.delete(`${API_URL}/nnia/appointments/${id}`);
  return res.data.success;
} 