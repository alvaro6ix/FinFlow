import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import WelcomeScreen from './WelcomeScreen';
import TourStep from './TourStep';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useSettingsStore();

  const steps = [
    {
      icon: '💰',
      title: 'Registra gastos rápidamente',
      description: 'Usa el botón flotante para agregar gastos en menos de 3 segundos.',
    },
    {
      icon: '🎯',
      title: 'Crea presupuestos',
      description: 'Define presupuestos por categoría y recibe alertas cuando te acerques al límite.',
    },
    {
      icon: '📊',
      title: 'Visualiza tus gastos',
      description: 'Analiza tus patrones de gasto con gráficas y reportes detallados.',
    },
    {
      icon: '🏆',
      title: 'Define metas financieras',
      description: 'Establece objetivos de ahorro y haz seguimiento de tu progreso.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 p-4">
      {currentStep === 0 ? (
        <WelcomeScreen onNext={handleNext} onSkip={handleSkip} />
      ) : (
        <TourStep
          step={currentStep}
          totalSteps={steps.length}
          icon={steps[currentStep - 1].icon}
          title={steps[currentStep - 1].title}
          description={steps[currentStep - 1].description}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
        />
      )}
    </div>
  );
};

export default OnboardingFlow;