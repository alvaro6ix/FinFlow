import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import OnboardingTour from './OnboardingTour';
import { useExpenseStore } from '../../stores/expenseStore';
import { useAuthStore } from '../../stores/authStore';

const OnboardingFlow = ({ onFinish }) => {
  const [stage, setStage] = useState('welcome'); // 'welcome' | 'tour'
  const { addExpense } = useExpenseStore();
  const { user } = useAuthStore();

  const handleFinish = async () => {
    // REQUERIMIENTO 15.1: Crear primer gasto de ejemplo
    await addExpense({
      amount: 0,
      categoryId: 'others',
      categoryName: 'Iniciando',
      description: 'Mi primer paso con FinFlow 🚀',
      date: new Date(),
      userId: user.uid,
      emotion: 'excited',
      isImpulse: false
    });
    
    // Guardar en localStorage que el onboarding se completó
    localStorage.setItem(`onboarding_complete_${user.uid}`, 'true');
    onFinish();
  };

  if (stage === 'welcome') return <WelcomeScreen onStart={() => setStage('tour')} />;
  
  return <OnboardingTour onComplete={handleFinish} onSkip={handleFinish} />;
};

export default OnboardingFlow;