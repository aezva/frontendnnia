import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchNotifications(clientId) {
  const res = await axios.get(`${API_URL}/nnia/notifications`, { params: { clientId } });
  return res.data.notifications;
}

export async function createNotification(notification) {
  const res = await axios.post(`${API_URL}/nnia/notifications`, notification);
  return res.data.notification;
}

export async function markNotificationRead(id) {
  const res = await axios.post(`${API_URL}/nnia/notifications/${id}/read`);
  return res.data.notification;
} 