import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchNotifications, markNotificationRead } from '../services/notificationsService';
import { useAuth } from './AuthContext';

// Valor por defecto para evitar undefined
const NotificationsContext = createContext({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAsRead: () => {},
  reload: () => {},
});

export function NotificationsProvider({ children }) {
  const { client } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    // Si no hay client, simplemente deja notificaciones vacías
    if (!client) {
      console.log('🔍 NotificationsContext: No hay client, notificaciones vacías');
      setNotifications([]);
      return;
    }
    
    console.log('🔍 NotificationsContext: Cargando notificaciones para client:', client.id);
    setLoading(true);
    try {
      const notifs = await fetchNotifications(client.id);
      console.log('🔍 NotificationsContext: Notificaciones recibidas:', notifs);
      setNotifications(Array.isArray(notifs) ? notifs : []);
    } catch (error) {
      console.error('❌ NotificationsContext: Error cargando notificaciones:', error);
      setNotifications([]);
    }
    setLoading(false);
  }, [client]);

  useEffect(() => {
    console.log('🔍 NotificationsContext: useEffect ejecutado, client:', client?.id);
    loadNotifications();
    if (!client) return;
    const interval = setInterval(loadNotifications, 20000); // 20s
    return () => clearInterval(interval);
  }, [client, loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(notifs => notifs.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('❌ NotificationsContext: Error marcando notificación como leída:', error);
    }
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, loading, markAsRead, reload: loadNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
} 