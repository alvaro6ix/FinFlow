import React from 'react';
import { Clock, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
// Importación masiva para tarjetas también
import * as LucideIcons from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete, categoryIcon, categoryColor = '#6366f1' }) => {
  const spent = Number(budget.spent || 0);
  const amount = Number(budget.amount || 1);
  const percentage = (spent / amount) * 100;
  const visualPercentage = Math.min(percentage, 100);
  const remaining = amount - spent;
  
  const daysLeft = budget.daysLeft ?? 0;

  // Semáforo (Acentos sutiles)
  let accentColor = 'bg-emerald-500'; 
  let textColor = 'text-emerald-500';
  let statusText = 'Saludable';

  if (percentage >= 100) {
    accentColor = 'bg-red-500';
    textColor = 'text-red-500';
    statusText = 'Excedido';
  } else if (percentage >= (budget.alertThreshold || 80)) {
    accentColor = 'bg-amber-500';
    textColor = 'text-amber-500';
    statusText = 'Alerta';
  }

  // Renderizado seguro de icono
  const renderIcon = () => {
    // 1. Componente
    if (typeof categoryIcon === 'function' || typeof categoryIcon === 'object') {
      const IconComponent = categoryIcon;
      return <IconComponent size={24} className="text-white" />;
    }
    // 2. String
    if (typeof categoryIcon === 'string' && LucideIcons[categoryIcon]) {
      const Icon = LucideIcons[categoryIcon];
      return <Icon size={24} className="text-white" />;
    }
    return <span className="text-2xl">{categoryIcon || '💰'}</span>;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('¿Eliminar este límite?')) onDelete();
  };

  return (
    // ESTILO LIQUID GLASS (Idéntico a StatCards/ExpenseCard)
    <div className="relative w-full bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-xl border border-white/20 hover:shadow-2xl transition-all group p-6 flex flex-col justify-between">
      
      {/* Header Limpio */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
            style={{ backgroundColor: categoryColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
            <div className="relative z-10">{renderIcon()}</div>
          </div>
          <div>
            <h3 className="text-lg font-black text-secondary-900 dark:text-white leading-none line-clamp-1">
              {budget.categoryLabel}
            </h3>
            <span className={`text-[10px] font-black uppercase tracking-widest ${textColor} mt-1 block`}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-2 hover:bg-white/20 rounded-xl text-secondary-400 hover:text-indigo-500 transition-colors">
            <Edit size={16} />
          </button>
          <button onClick={handleDelete} className="p-2 hover:bg-white/20 rounded-xl text-secondary-400 hover:text-red-500 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-black uppercase text-secondary-400 mb-1">
          <span>Uso</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-2.5 bg-secondary-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${accentColor}`}
            style={{ width: `${visualPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Cifras */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-0.5">Gastado</p>
          <p className={`text-2xl font-black ${remaining < 0 ? 'text-red-500' : 'text-secondary-900 dark:text-white'}`}>
            ${spent.toLocaleString()}
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 text-secondary-400 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-xl border border-white/10">
          <Clock size={12} />
          <span className="text-[10px] font-black uppercase tracking-wider">
            {daysLeft} días
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;