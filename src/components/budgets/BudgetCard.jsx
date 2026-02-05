import React from 'react';
import { Clock, Edit, Trash2, Power, CheckCircle, XCircle } from 'lucide-react';
import { useBudgetStore } from '../../stores/budgetStore';

const BudgetCard = ({ budget, onEdit, onDelete, categoryIcon = '💰' }) => {
  const store = useBudgetStore();

  const spent = Number(budget.spent || 0);
  const amount = Number(budget.amount || 1);
  const percentage = (spent / amount) * 100;
  const remaining = amount - spent;

  // Cálculo local de días
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = lastDay - now.getDate();

  const statusColor = percentage >= 100 ? '#ef4444' : percentage >= (budget.alertThreshold || 80) ? '#f59e0b' : '#6366f1';

  return (
    <div className={`bg-white dark:bg-secondary-900 rounded-[2.5rem] shadow-xl border-none transition-all ${!budget.isActive ? 'opacity-40 grayscale' : 'hover:shadow-2xl'}`}>
      <div className="p-6 border-b border-gray-100 dark:border-secondary-800 flex justify-between items-center">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="text-3xl p-3 bg-secondary-50 dark:bg-secondary-800 rounded-2xl flex-shrink-0">
             {/* Validamos si el icono es componente o string */}
             {typeof categoryIcon === 'string' ? categoryIcon : React.createElement(categoryIcon, { size: 24 })}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-black uppercase text-xs text-secondary-900 dark:text-white truncate leading-none">
              {budget.categoryName || budget.categoryLabel}
            </h3>
            <p className="text-[9px] font-black text-indigo-600 uppercase mt-2 tracking-widest">
              Corte {budget.period === 'monthly' ? 'Mensual' : 'Semanal'}
            </p>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => store.updateBudget(budget.id, { isActive: !budget.isActive })} className={`p-2 rounded-xl ${budget.isActive ? 'text-emerald-500' : 'text-secondary-400'}`}>
            <Power size={18} />
          </button>
          <button onClick={onEdit} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl"><Edit size={18} /></button>
          <button onClick={() => onDelete(budget.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-secondary-400 mb-1">Gastado</span>
            <span className="text-3xl font-black text-secondary-900 dark:text-white leading-none">${spent.toLocaleString()}</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-[10px] font-black uppercase text-secondary-400 mb-1">Límite</span>
            <span className="text-lg font-bold text-secondary-500 leading-none">${amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="w-full bg-secondary-100 dark:bg-secondary-800 rounded-full h-5 overflow-hidden p-1 shadow-inner">
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: statusColor }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-3xl bg-secondary-50 dark:bg-secondary-800/50">
            <p className="text-[9px] font-black text-secondary-400 mb-1 uppercase tracking-tighter">Uso del Límite</p>
            <p className="text-xl font-black text-secondary-900 dark:text-white leading-none">{percentage.toFixed(0)}%</p>
          </div>
          <div className={`p-4 rounded-3xl ${remaining >= 0 ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-[9px] font-black text-secondary-400 mb-1 uppercase tracking-tighter">{remaining >= 0 ? 'Disponible' : 'Excedido'}</p>
            <p className={`text-xl font-black leading-none ${remaining >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>${Math.abs(remaining).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-[1.5rem]">
          <div className="flex items-center gap-2 text-secondary-600">
            <Clock size={18} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Días para el corte</span>
          </div>
          <span className="text-xl font-black text-secondary-900 dark:text-white">{daysLeft}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;