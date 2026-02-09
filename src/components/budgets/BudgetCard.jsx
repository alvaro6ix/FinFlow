import React from 'react';
import { Clock, Edit, Trash2, Calendar, AlertTriangle } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete, categoryIcon, categoryColor = '#6366f1' }) => {
  const spent = Number(budget.spent || 0);
  const amount = Number(budget.amount || 1);
  const percentage = (spent / amount) * 100;
  const visualPercentage = Math.min(percentage, 100);
  const remaining = amount - spent;
  
  // Calcular días restantes según el periodo
  const getDaysLeft = () => {
    const now = new Date();
    const startDate = budget.startDate?.seconds 
      ? new Date(budget.startDate.seconds * 1000) 
      : new Date(budget.startDate);
    
    let endDate = new Date();

    switch (budget.period) {
      case 'daily':
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'weekly': {
        const diffTime = now - startDate;
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        const cycleStart = new Date(startDate);
        cycleStart.setDate(cycleStart.getDate() + (diffWeeks * 7));
        
        if (cycleStart > now) {
          cycleStart.setDate(cycleStart.getDate() - 7);
        }
        
        endDate = new Date(cycleStart);
        endDate.setDate(endDate.getDate() + 7);
        break;
      }

      case 'monthly': {
        const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 + 
                          (now.getMonth() - startDate.getMonth());
        const cycleStart = new Date(startDate);
        cycleStart.setMonth(cycleStart.getMonth() + monthsDiff);
        
        if (cycleStart.getDate() > now.getDate() || cycleStart > now) {
          cycleStart.setMonth(cycleStart.getMonth() - 1);
        }
        
        endDate = new Date(cycleStart);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(endDate.getDate() - 1);
        break;
      }

      case 'yearly': {
        const yearsDiff = now.getFullYear() - startDate.getFullYear();
        const cycleStart = new Date(startDate);
        cycleStart.setFullYear(cycleStart.getFullYear() + yearsDiff);
        
        if (cycleStart > now) {
          cycleStart.setFullYear(cycleStart.getFullYear() - 1);
        }
        
        endDate = new Date(cycleStart);
        endDate.setFullYear(endDate.getFullYear() + 1);
        endDate.setDate(endDate.getDate() - 1);
        break;
      }

      default:
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const daysLeft = getDaysLeft();

  // Determinar estado y colores
  let statusColor = '#10b981'; // Verde
  let statusText = 'Saludable';
  let statusBg = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';

  if (percentage >= 100) {
    statusColor = '#ef4444'; // Rojo
    statusText = 'Excedido';
    statusBg = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  } else if (percentage >= (budget.alertThreshold || 80)) {
    statusColor = '#f59e0b'; // Amarillo
    statusText = 'Alerta';
    statusBg = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  }

  // Renderizado seguro del icono
  const renderIcon = () => {
    if (typeof categoryIcon === 'function' || (typeof categoryIcon === 'object' && categoryIcon !== null)) {
      const IconComponent = categoryIcon;
      return <IconComponent size={24} />;
    }
    return <span className="text-2xl">💰</span>;
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este límite?')) {
      onDelete();
    }
  };

  const getPeriodLabel = () => {
    const labels = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      yearly: 'Anual'
    };
    return labels[budget.period] || 'Mensual';
  };

  return (
    <div className="bg-white dark:bg-secondary-900 rounded-[2rem] shadow-sm border border-secondary-100 dark:border-secondary-800 p-5 relative overflow-hidden transition-all hover:shadow-lg group">
      
      {/* Barra de Progreso Superior */}
      <div className="absolute top-0 left-0 h-1.5 bg-secondary-100 dark:bg-secondary-800 w-full">
        <div 
          className="h-full transition-all duration-500 rounded-r-full relative overflow-hidden" 
          style={{ width: `${visualPercentage}%`, backgroundColor: statusColor }} 
        >
          {/* Animación de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icono con color dinámico */}
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-white flex-shrink-0"
            style={{ backgroundColor: categoryColor }}
          >
            {renderIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-secondary-900 dark:text-white text-sm truncate">
              {budget.categoryLabel}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-black uppercase tracking-widest py-0.5 px-2 rounded-lg inline-block ${statusBg}`}>
                {statusText}
              </span>
              {percentage >= 100 && (
                <AlertTriangle size={12} className="text-red-500 animate-pulse" />
              )}
            </div>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit} 
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg text-secondary-400 hover:text-indigo-500 transition-colors"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={handleDelete} 
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-secondary-400 hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Cifras */}
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[10px] font-bold text-secondary-400 uppercase">Gastado</span>
        <span className="text-[10px] font-bold text-secondary-400 uppercase">Límite</span>
      </div>
      
      <div className="flex justify-between items-end mb-4 p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-xl border border-secondary-100 dark:border-secondary-800">
        <div>
          <span className={`text-xl font-black ${
            remaining < 0 
              ? 'text-red-500' 
              : 'text-secondary-900 dark:text-white'
          }`}>
            ${spent.toLocaleString()}
          </span>
          {remaining < 0 && (
            <p className="text-[9px] text-red-500 font-bold mt-0.5">
              Excedido por ${Math.abs(remaining).toLocaleString()}
            </p>
          )}
        </div>
        <span className="text-xs font-bold text-secondary-400 mb-1">
          / ${amount.toLocaleString()}
        </span>
      </div>

      {/* Progreso visual */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-bold text-secondary-400 uppercase">
            Progreso
          </span>
          <span className="text-xs font-black text-secondary-900 dark:text-white">
            {percentage.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 relative"
            style={{ 
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: statusColor
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-secondary-400 bg-secondary-50 dark:bg-secondary-800/50 px-2 py-1 rounded-lg">
          <Clock size={12} />
          <span className="text-[9px] font-bold uppercase">
            {daysLeft} día{daysLeft !== 1 ? 's' : ''} rest.
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-secondary-400 bg-secondary-50 dark:bg-secondary-800/50 px-2 py-1 rounded-lg">
          <Calendar size={12} />
          <span className="text-[9px] font-bold uppercase">
            {getPeriodLabel()}
          </span>
        </div>
      </div>

      {/* Indicador de excedido */}
      {percentage >= 100 && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default BudgetCard;