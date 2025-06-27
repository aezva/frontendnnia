import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

const AppTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const tutorialSteps = [
    {
      title: 'Dashboard',
      text: 'Aquí verás todas las métricas importantes de tu asistente en un vistazo',
      route: '/',
      position: 'sidebar'
    },
    {
      title: 'Mensajes',
      text: 'Chatea con tus clientes y revisa el historial de conversaciones',
      route: '/messages',
      position: 'sidebar'
    },
    {
      title: 'Tickets',
      text: 'Organiza y gestiona las consultas de soporte de forma eficiente',
      route: '/tickets',
      position: 'sidebar'
    },
    {
      title: 'Mi Negocio',
      text: 'Personaliza la información de tu empresa para que el asistente conozca tu negocio',
      route: '/my-business',
      position: 'sidebar'
    },
    {
      title: 'Asistente IA',
      text: 'Configura la personalidad, apariencia y comportamiento de tu asistente virtual',
      route: '/assistant',
      position: 'sidebar'
    },
    {
      title: 'Suscripción',
      text: 'Revisa tu plan actual y gestiona la facturación de tu cuenta',
      route: '/subscription',
      position: 'sidebar'
    }
  ];

  useEffect(() => {
    // Verificar si el tutorial ya se completó
    const tutorialCompleted = localStorage.getItem('appTutorialCompleted');
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    // Mostrar tutorial solo si no se ha completado y ya se vio el mensaje de bienvenida
    if (!tutorialCompleted && hasSeenWelcome) {
      // Pequeño delay para que aparezca después del mensaje de bienvenida
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Navegar a la ruta del siguiente paso
      navigate(tutorialSteps[nextStep].route);
    } else {
      completeTutorial();
    }
  };

  const handleSkip = () => {
    completeTutorial();
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('appTutorialCompleted', 'true');
  };

  if (!showTutorial) return null;

  const currentStepData = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Burbuja de tutorial */}
          <div className="absolute left-72 top-20 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 max-w-64 relative"
            >
              {/* Indicador de burbuja */}
              <div className="absolute -left-1.5 top-4 w-2.5 h-2.5 bg-white border-l border-b border-gray-200 transform rotate-45" />
              
              {/* Contenido */}
              <div className="relative">
                {/* Número del paso */}
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {currentStep + 1}
                </div>
                
                <h3 className="font-medium text-gray-900 text-xs mb-1">
                  {currentStepData.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed mb-2.5">
                  {currentStepData.text}
                </p>
                
                {/* Controles */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSkip}
                    className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                  >
                    Omitir
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {/* Indicadores de progreso */}
                    <div className="flex gap-1">
                      {tutorialSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1 h-1 rounded-full transition-colors ${
                            index === currentStep ? 'bg-gray-900' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1 bg-gray-900 text-white rounded px-2.5 py-1 text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      {currentStep < tutorialSteps.length - 1 ? (
                        <>
                          Siguiente
                          <ChevronRight className="w-3 h-3" />
                        </>
                      ) : (
                        'Finalizar'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppTutorial; 