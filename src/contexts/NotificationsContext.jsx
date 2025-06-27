import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchNotifications, markNotificationRead } from '../services/notificationsService';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { client } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!client || !client.businessInfoId) return;
    setLoading(true);
    try {
      const notifs = await fetchNotifications(client.businessInfoId);
      setNotifications(Array.isArray(notifs) ? notifs : []);
    } catch {
      setNotifications([]);
    }
    setLoading(false);
  }, [client]);

  useEffect(() => {
    loadNotifications();
    if (!client) return;
    const interval = setInterval(loadNotifications, 20000); // 20s
    return () => clearInterval(interval);
  }, [client, loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(notifs => notifs.map(n => n.id === id ? { ...n, read: true } : n));
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