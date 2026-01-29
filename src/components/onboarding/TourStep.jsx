import React from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

/**
 * Componente Atómico para cada paso del Tour.
 * Gestiona la presentación y navegación local del Onboarding.
 */
const TourStep = ({ 
  step, 
  totalSteps, 
  icon, 
  title, 
  description, 
  onNext, 
  onPrev, 
  onSkip 
}) => {
  const isLastStep = step === totalSteps;

  return (
    <Card className="max-w-lg mx-auto border-none shadow-none bg-transparent">
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Icono con Efecto de Elevación */}
        <div className="text-7xl drop-shadow-2xl animate-bounce-slow">
          {icon}
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-secondary-900 dark:text-white mb-3 uppercase tracking-tighter">
            {title}
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 font-medium leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* Indicadores de Progreso (Dots) */}
        <div className="flex justify-center gap-2.5">
          {[...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === step - 1
                  ? 'bg-primary-500 w-10' // Punto activo expandido
                  : 'bg-secondary-200 dark:bg-secondary-700 w-2'
              }`}
            />
          ))}
        </div>

        {/* Controles de Navegación */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
          <div className="flex gap-2 w-full sm:w-auto">
            {step > 1 && (
              <Button 
                variant="ghost" 
                onClick={onPrev} 
                className="flex-1 sm:flex-none px-6 text-secondary-400 font-bold uppercase text-[10px]"
              >
                <ChevronLeft size={16} className="mr-1" /> Atrás
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={onSkip} 
              className="flex-1 sm:flex-none px-6 text-secondary-400 font-bold uppercase text-[10px]"
            >
              Saltar <X size={14} className="ml-1" />
            </Button>
          </div>
          
          <Button 
            variant="primary" 
            onClick={onNext} 
            className="w-full sm:w-48 py-4 font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary-500/20"
          >
            {isLastStep ? 'Finalizar' : 'Siguiente'} 
            {!isLastStep && <ChevronRight size={18} className="ml-1" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TourStep;