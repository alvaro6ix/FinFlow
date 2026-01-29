import React from 'react';
import Button from '../common/Button';

const WelcomeScreen = ({ onNext, onSkip }) => {
  return (
    <div className="text-center space-y-6">
      <div className="text-8xl mb-8">👋</div>
      <h1 className="text-4xl font-bold text-secondary-900 dark:text-white">
        ¡Bienvenido a FinFlow!
      </h1>
      <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-md mx-auto">
        Tu asistente financiero personal que te ayudará a controlar tus gastos,
        crear presupuestos y alcanzar tus metas.
      </p>
      <div className="flex gap-4 justify-center pt-8">
        <Button variant="ghost" onClick={onSkip}>
          Saltar tutorial
        </Button>
        <Button variant="primary" size="lg" onClick={onNext}>
          Comenzar Tour
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;