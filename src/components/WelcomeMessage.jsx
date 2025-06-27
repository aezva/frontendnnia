import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const WelcomeMessage = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const { client } = useAuth();

  useEffect(() => {
    // Mostrar mensaje de bienvenida si es la primera vez que entra al panel
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome && client) {
      setShowWelcome(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [client]);

  const handleClose = () => {
    setShowWelcome(false);
  };

  if (!showWelcome) return null;

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  ¡Bienvenido a tu panel de control!
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  Tu asistente IA está listo para ayudarte. Te guiaremos por las funciones principales para que puedas empezar a trabajar.
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClose}
                    className="bg-gray-900 text-white rounded px-3 py-1.5 text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Empezar
                  </button>
                  <span className="text-xs text-gray-400">
                    {client?.name ? `Hola, ${client.name}` : '¡Listo para comenzar!'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeMessage; 