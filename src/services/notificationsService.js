import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchNotifications(clientId) {
  console.log('🔍 fetchNotifications: Iniciando con clientId:', clientId);
  try {
    const res = await axios.get(`${API_URL}/nnia/notifications`, { params: { clientId } });
    console.log('🔍 fetchNotifications: Respuesta completa:', res);
    console.log('🔍 fetchNotifications: res.data:', res.data);
    console.log('🔍 fetchNotifications: res.data.notifications:', res.data.notifications);
    return res.data.notifications;
  } catch (error) {
    console.error('❌ fetchNotifications: Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function createNotification(notification) {
  console.log('🔍 createNotification: Iniciando con:', notification);
  try {
    const res = await axios.post(`${API_URL}/nnia/notifications`, notification);
    console.log('🔍 createNotification: Respuesta recibida:', res.data);
    return res.data.notification;
  } catch (error) {
    console.error('❌ createNotification: Error:', error.response?.data || error.message);
    throw error;
  }
}

export async function markNotificationRead(id) {
  console.log('🔍 markNotificationRead: Iniciando con id:', id);
  try {
    const res = await axios.post(`${API_URL}/nnia/notifications/${id}/read`);
    console.log('🔍 markNotificationRead: Respuesta recibida:', res.data);
    return res.data.notification;
  } catch (error) {
    console.error('❌ markNotificationRead: Error:', error.response?.data || error.message);
    throw error;
  }
} 