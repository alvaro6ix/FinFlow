import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  WifiOff, 
} from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-900/30',
      border: 'border-emerald-200/50 dark:border-emerald-700/50',
      text: 'text-emerald-800 dark:text-emerald-100',
      iconColor: 'text-emerald-500',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-red-50/80 dark:bg-red-900/30',
      border: 'border-red-200/50 dark:border-red-700/50',
      text: 'text-red-800 dark:text-red-100',
      iconColor: 'text-red-500',
      icon: AlertCircle,
    },
    warning: {
      bg: 'bg-amber-50/80 dark:bg-amber-900/30',
      border: 'border-amber-200/50 dark:border-amber-700/50',
      text: 'text-amber-800 dark:text-amber-100',
      iconColor: 'text-amber-500',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-indigo-50/80 dark:bg-indigo-900/30',
      border: 'border-indigo-200/50 dark:border-indigo-700/50',
      text: 'text-indigo-800 dark:text-indigo-100',
      iconColor: 'text-indigo-500',
      icon: Info,
    },
    offline: {
      bg: 'bg-slate-800/90',
      border: 'border-slate-600/50',
      text: 'text-white',
      iconColor: 'text-slate-400',
      icon: WifiOff,
    },
  };

  const style = types[type] || types.info;
  const Icon = style.icon;

  return (
    <div
      className={`
        flex items-start gap-4 p-5 rounded-[1.5rem] 
        backdrop-blur-md shadow-lg border
        animate-in fade-in slide-in-from-top-4 duration-500
        ${style.bg} ${style.border} ${className}
      `}
      role="alert"
    >
      <div className={`shrink-0 p-2 bg-white/20 rounded-full ${style.iconColor}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      
      <div className="flex-1 pt-1">
        {title && (
          <h4 className={`font-black text-xs uppercase tracking-widest mb-1 ${style.text}`}>
            {title}
          </h4>
        )}
        <p className={`text-xs font-medium opacity-90 leading-relaxed ${style.text}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Alert;