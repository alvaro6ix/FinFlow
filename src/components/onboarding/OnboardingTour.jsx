// En src/components/onboarding/OnboardingTour.jsx
import React, { useState } from 'react';
import TourStep from './TourStep';

const STEPS_DATA = [
  { icon: '📱', title: 'Registro Veloz', desc: 'Registra tus gastos en menos de 3 segundos con nuestro modal inteligente.' },
  { icon: '📊', title: 'Análisis Pro', desc: 'Visualiza tu salud financiera con gráficos de nivel comercial y predicciones IA.' },
  { icon: '🎯', title: 'Metas Claras', desc: 'Ahorra con propósito. Define tus objetivos y nosotros calculamos el tiempo.' },
  { icon: '🛡️', title: 'Privacidad Total', desc: 'Tus datos son tuyos. Todo funciona offline y con cifrado de Firebase.' }
];

const OnboardingTour = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < STEPS_DATA.length) setCurrentStep(prev => prev + 1);
    else onComplete();
  };

  const handlePrev = () => setCurrentStep(prev => prev - 1);

  const activeData = STEPS_DATA[currentStep - 1];

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-secondary-950 flex items-center justify-center p-6">
      <TourStep 
        step={currentStep}
        totalSteps={STEPS_DATA.length}
        icon={activeData.icon}
        title={activeData.title}
        description={activeData.desc}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={onSkip}
      />
    </div>
  );
};

export default OnboardingTour;