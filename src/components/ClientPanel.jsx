import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Messages from '@/components/Messages';
import Tickets from '@/components/Tickets';
import MyBusiness from '@/components/MyBusiness';
import AIAssistant from '@/components/AIAssistant';
import Subscription from '@/components/Subscription';
import Settings from '@/components/Settings';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AppTutorial from '@/components/AppTutorial';
import WelcomeMessage from '@/components/WelcomeMessage';
import CitasPage from '@/pages/Citas';
import Topbar from './Topbar';

const ClientPanel = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({ 
        title: 'Error al cerrar sesión', 
        description: error.message, 
        variant: 'destructive' 
      });
    } else {
      navigate('/login');
      toast({ title: 'Has cerrado sesión exitosamente.' });
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar isSidebarOpen={isSidebarOpen} handleLogout={handleLogout} />
        <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
            <span className="font-bold text-lg">Asistente IA</span>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
          </div>
          
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Dashboard /></motion.div>} />
                <Route path="/messages" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Messages /></motion.div>} />
                <Route path="/tickets" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Tickets /></motion.div>} />
                <Route path="/my-business" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><MyBusiness /></motion.div>} />
                <Route path="/assistant" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><AIAssistant /></motion.div>} />
                <Route path="/subscription" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Subscription /></motion.div>} />
                <Route path="/settings" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Settings /></motion.div>} />
                <Route path="/citas" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><CitasPage /></motion.div>} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <WelcomeMessage />
      <AppTutorial />
    </div>
  );
};

export default ClientPanel;