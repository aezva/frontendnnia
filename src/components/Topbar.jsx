import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationsContext';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function Topbar() {
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const { user, client, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow flex items-center justify-between px-6 h-16">
      <div className="font-bold text-xl tracking-tight">Panel de Cliente</div>
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <div className="relative" ref={notifRef}>
          <button className="relative p-2 rounded-full hover:bg-gray-100" onClick={() => setNotifOpen(o => !o)} aria-label="Notificaciones">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg max-h-96 overflow-y-auto z-50">
              <div className="p-3 border-b font-bold">Notificaciones</div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">Sin notificaciones recientes.</div>
              ) : (
                <ul>
                  {notifications.slice(0, 10).map(n => (
                    <li key={n.id} className={`px-4 py-3 border-b last:border-b-0 cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`}
                        onClick={() => { markAsRead(n.id); setNotifOpen(false); }}>
                      <div className="font-semibold text-sm">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.body}</div>
                      <div className="text-xs text-right text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {/* Perfil */}
        <div className="relative" ref={profileRef}>
          <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" onClick={() => setProfileOpen(o => !o)}>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.avatar_url || ''} alt={user?.email || ''} />
              <AvatarFallback>{user?.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm font-medium">{client?.business_name || user?.email}</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
              <div className="p-3 border-b font-bold">Perfil</div>
              <div className="px-4 py-2 text-sm">{user?.email}</div>
              <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100" onClick={logout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 