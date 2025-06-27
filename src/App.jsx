import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Onboarding from '@/components/Onboarding';
import ClientPanel from '@/components/ClientPanel';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Bot } from 'lucide-react';

function App() {
  return (
    <>
      <Helmet>
        <title>Asistente IA para Ventas</title>
        <meta name="description" content="Plataforma SaaS para configurar asistentes de IA personalizados para tu negocio." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

function AppContent() {
    const { session, client, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-center">
                    <Bot className="h-16 w-16 mx-auto animate-pulse text-primary"/>
                    <p className="mt-4 text-muted-foreground">Cargando tu espacio de trabajo...</p>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {!session ? (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (client && !client.onboarding_completed) ? (
                    <>
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="*" element={<Navigate to="/onboarding" replace />} />
                    </>
                ) : client ? (
                     <>
                        <Route path="/*" element={<ClientPanel />} />
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="/signup" element={<Navigate to="/" replace />} />
                        <Route path="/onboarding" element={<Navigate to="/" replace />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/login" replace />} />
                )}
            </Routes>
        </AnimatePresence>
    );
}

export default App;