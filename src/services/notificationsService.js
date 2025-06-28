import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchNotifications(clientId) {
  try {
    const res = await axios.get(`${API_URL}/nnia/notifications`, { params: { clientId } });
    return res.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error.response?.data || error.message);
    throw error;
  }
}

export async function markNotificationRead(id) {
  try {
    const res = await axios.post(`${API_URL}/nnia/notifications/${id}/read`);
    return res.data.notification;
  } catch (error) {
    console.error('Error marking notification as read:', error.response?.data || error.message);
    throw error;
  }
} 