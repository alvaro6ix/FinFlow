import React, { useState } from 'react';

const steps = [
  { title: "¡Bienvenido a FinFlow!", desc: "Tu asistente financiero personal para tomar el control total de tu dinero.", icon: "💰" },
  { title: "Registro Rápido", desc: "Registra cualquier gasto en menos de 3 segundos usando el botón flotante (+).", icon: "⚡" },
  { title: "Metas Claras", desc: "Define objetivos de ahorro y visualiza tu progreso en tiempo real.", icon: "🎯" },
  { title: "Inteligencia Emocional", desc: "Analiza cómo tus emociones influyen en tus gastos impulsivos.", icon: "🧠" }
];

const OnboardingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-secondary-950 flex flex-col items-center justify-center p-8">
      <div className="text-8xl mb-8 animate-bounce">{steps[currentStep].icon}</div>
      <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">{steps[currentStep].title}</h2>
      <p className="text-secondary-500 text-center max-w-sm mb-12">{steps[currentStep].desc}</p>
      
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div key={i} className={`h-2 w-8 rounded-full ${i === currentStep ? 'bg-primary-500' : 'bg-secondary-200'}`} />
        ))}
      </div>

      <button 
        onClick={next}
        className="w-full max-w-xs py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
      >
        {currentStep === steps.length - 1 ? '¡Empezar ahora!' : 'Siguiente'}
      </button>
    </div>
  );
};

export default OnboardingFlow;