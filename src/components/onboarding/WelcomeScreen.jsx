import React from 'react';
import Button from '../common/Button';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-primary-500 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl shadow-primary-500/40 mb-8 animate-bounce">
        💰
      </div>
      
      <h1 className="text-4xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter mb-4">
        Bienvenido a <span className="text-primary-600">FinFlow</span>
      </h1>
      
      <p className="text-secondary-500 font-medium max-w-xs mb-12">
        La herramienta inteligente para dominar tus finanzas y alcanzar tus metas.
      </p>

      <div className="grid grid-cols-1 gap-6 w-full max-w-sm mb-12">
        <div className="flex items-center gap-4 text-left p-4 bg-white dark:bg-secondary-900 rounded-3xl shadow-sm border border-secondary-100 dark:border-secondary-800">
          <div className="p-2 bg-primary-100 text-primary-600 rounded-xl"><Zap size={20} /></div>
          <p className="text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase">Registro en menos de 3 segundos</p>
        </div>
        <div className="flex items-center gap-4 text-left p-4 bg-white dark:bg-secondary-900 rounded-3xl shadow-sm border border-secondary-100 dark:border-secondary-800">
          <div className="p-2 bg-green-100 text-green-600 rounded-xl"><ShieldCheck size={20} /></div>
          <p className="text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase">Tus datos seguros y offline-first</p>
        </div>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={onStart} className="py-6 text-xl font-black rounded-[2rem]">
        ¡EMPECEMOS! <Sparkles className="ml-2" />
      </Button>
    </div>
  );
};

export default WelcomeScreen;