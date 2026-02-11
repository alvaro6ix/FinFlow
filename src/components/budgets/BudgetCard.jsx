import React from 'react';
import { Edit, Trash2, Power, Clock } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete, onToggle, categoryIcon: Icon, categoryColor = '#6366f1' }) => {
  const spent = Number(budget.spent || 0);
  const amount = Number(budget.amount || 1);
  const percentage = (spent / amount) * 100;
  const visualPercentage = Math.min(percentage, 100);
  const remaining = amount - spent;
  
  // Estados lógicos
  const isManuallyPaused = !budget.isActive; 
  const isExpired = budget.isExpired;
  
  // Lógica visual: Si está vencido O pausado, se ve gris/apagado
  const isGray = isManuallyPaused || isExpired;
  
  // Colores dinámicos
  let accentColor = 'bg-emerald-500'; 
  let textColor = 'text-emerald-500';
  let statusText = 'Saludable';

  if (isGray) {
    accentColor = 'bg-secondary-300 dark:bg-secondary-600';
    textColor = 'text-secondary-400';
    statusText = isExpired ? 'Vencido' : 'Pausado';
  } else {
    if (percentage >= 100) {
        accentColor = 'bg-red-500';
        textColor = 'text-red-500';
        statusText = 'Excedido';
    } else if (percentage >= (budget.alertThreshold || 80)) {
        accentColor = 'bg-amber-500';
        textColor = 'text-amber-500';
        statusText = 'Alerta';
    }
  }

  const handleToggle = (e) => {
    e.stopPropagation();
    // Si está vencido, no permitimos reactivar desde la tarjeta (debe editar fechas)
    if (isExpired) return; 
    
    if (onToggle) {
        onToggle(budget.id, !budget.isActive);
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-[2.5rem] p-5 shadow-xl transition-all duration-300 border
        ${isGray 
            ? 'bg-secondary-50/80 dark:bg-secondary-900/30 border-secondary-200/50 dark:border-white/5 opacity-90' 
            : 'bg-white dark:bg-secondary-900 border-white/20 hover:scale-[1.01]'
        }`}
    >
      
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div 
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm text-white transition-colors ${isGray && 'grayscale'}`}
            style={{ backgroundColor: isGray ? '#94a3b8' : categoryColor }}
          >
            {Icon ? <Icon size={20} /> : <span className="text-xs font-bold">?</span>}
          </div>
          <div>
            <h3 className={`text-sm font-black leading-tight ${isGray ? 'text-secondary-500' : 'text-secondary-900 dark:text-white'}`}>
              {budget.categoryLabel || 'Sin Categoría'}
            </h3>
            {budget.subcategoryId && budget.subcategoryId !== 'all' && (
              <p className="text-[10px] font-medium text-secondary-400">
                › {budget.subcategoryId}
              </p>
            )}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex gap-1">
          <button 
            onClick={handleToggle}
            disabled={isExpired}
            className={`p-1.5 rounded-lg transition-colors ${
              !isGray
                ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' 
                : 'text-secondary-300 hover:text-emerald-500'
            } ${isExpired ? 'cursor-not-allowed opacity-30' : ''}`}
            title={isExpired ? "Vencido (Editar fecha para activar)" : (budget.isActive ? "Pausar" : "Activar")}
          >
            <Power size={16} />
          </button>

          <button onClick={onEdit} className="p-1.5 text-secondary-400 hover:text-[#FFD700] hover:bg-secondary-50 dark:hover:bg-white/5 rounded-lg transition-colors">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ESTADO */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${isGray ? 'bg-secondary-200 text-secondary-500' : `${accentColor}/10 ${textColor}`}`}>
          {statusText}
        </div>
        {budget.period && (
          <span className="text-[9px] font-bold text-secondary-400 uppercase tracking-widest flex items-center gap-1">
            <Clock size={10} />
            {budget.period === 'weekly' ? 'Semanal' : budget.period === 'monthly' ? 'Mensual' : budget.period}
          </span>
        )}
      </div>

      {/* BARRA DE PROGRESO */}
      <div className={`mb-4 ${isGray && 'grayscale opacity-60'}`}>
        <div className="flex justify-between text-[10px] font-black uppercase text-secondary-400 mb-1">
          <span>Uso</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-2.5 bg-secondary-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${isGray ? 'bg-secondary-400' : accentColor}`}
            style={{ width: `${visualPercentage}%` }}
          />
        </div>
      </div>

      {/* CIFRAS */}
      <div className={`flex justify-between items-end ${isGray && 'grayscale opacity-70'}`}>
        <div>
          <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-0.5">Gastado</p>
          <p className={`text-2xl font-black ${remaining < 0 && !isGray ? 'text-red-500' : 'text-secondary-900 dark:text-white'}`}>
            ${spent.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-0.5">Límite</p>
           <p className="text-sm font-black text-secondary-500 dark:text-secondary-300">
             ${amount.toLocaleString()}
           </p>
        </div>
      </div>
      
      {budget.cycleLabel && (
        <div className="mt-3 pt-3 border-t border-secondary-100 dark:border-white/5 text-center">
           <p className="text-[9px] font-bold text-secondary-400 uppercase tracking-widest">
             {budget.cycleLabel}
           </p>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;