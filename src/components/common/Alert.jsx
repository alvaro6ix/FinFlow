import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  WifiOff, 
  X 
} from 'lucide-react';

/**
 * Componente de Alerta Versátil.
 * Soporta estados: success, error, warning, info y offline (Req 8.1).
 */
const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: <CheckCircle2 size={20} />,
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: <AlertCircle size={20} />,
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      icon: <AlertCircle size={20} />,
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: <Info size={20} />,
    },
    offline: {
      bg: 'bg-secondary-900 dark:bg-black',
      border: 'border-secondary-700',
      text: 'text-white',
      icon: <WifiOff size={20} className="animate-pulse text-primary-500" />,
    },
  };

  const style = types[type] || types.info;

  return (
    <div
      className={`
        flex items-start gap-4 p-4 rounded-[1.5rem] border transition-all duration-300
        animate-in fade-in slide-in-from-top-4
        ${style.bg} ${style.border} ${style.text} ${className}
      `}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">
        {style.icon}
      </div>
      
      <div className="flex-1">
        {title && (
          <h4 className="font-black text-xs uppercase tracking-widest mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm font-medium leading-relaxed">
          {message}
        </p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
          aria-label="Cerrar alerta"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;