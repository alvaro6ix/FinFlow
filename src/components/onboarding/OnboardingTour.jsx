import React, { useState } from 'react';
import Card from '../common/Card';

const TOUR_STEPS = [
  {
    title: "¡Bienvenido a FinFlow!",
    description: "La herramienta para que tú y Huayra Mx tengan finanzas impecables. Vamos a darte un tour rápido.",
    icon: "🚀"
  },
  {
    title: "Registra en 3 Segundos",
    description: "Usa el botón flotante (+) para anotar cualquier gasto al instante, incluso sin internet.",
    icon: "⚡"
  },
  {
    title: "Controla tu Psicología",
    description: "Analizamos tus emociones para decirte si estás comprando por necesidad o por impulso.",
    icon: "🧠"
  },
  {
    title: "Alcanza tus Metas",
    description: "Define objetivos como 'Viajes' o 'Inversión' y mira cómo tu ahorro progresa automáticamente.",
    icon: "🎯"
  }
];

const OnboardingTour = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-600/90 backdrop-blur-md p-6">
      <div className="w-full max-w-sm animate-in zoom-in duration-300">
        <Card className="text-center p-8 space-y-6 shadow-2xl">
          <div className="text-6xl">{TOUR_STEPS[currentStep].icon}</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold dark:text-white">
              {TOUR_STEPS[currentStep].title}
            </h2>
            <p className="text-secondary-500 text-sm leading-relaxed">
              {TOUR_STEPS[currentStep].description}
            </p>
          </div>
          
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={nextStep}
              className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              {currentStep === TOUR_STEPS.length - 1 ? "¡Empezar ahora!" : "Siguiente"}
            </button>
            <button 
              onClick={onComplete}
              className="text-xs text-secondary-400 uppercase tracking-widest font-bold"
            >
              Saltar tour
            </button>
          </div>

          <div className="flex justify-center gap-2">
            {TOUR_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-6 bg-primary-500' : 'w-2 bg-secondary-200'}`} 
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingTour;