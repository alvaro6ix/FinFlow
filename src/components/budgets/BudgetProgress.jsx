import React from 'react';
import Card from '../common/Card';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const BudgetProgress = ({ budget, spent = 0, currency = 'MXN' }) => {
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const threshold = budget.alertThreshold || 80;

  const getStatus = () => {
    if (percentage >= 100) return { color: 'bg-danger-500', text: 'EXCEDIDO', icon: <AlertCircle size={14} />, textColor: 'text-danger-600' };
    if (percentage >= threshold) return { color: 'bg-warning-500', text: 'LIMITE CERCA', icon: <Info size={14} />, textColor: 'text-warning-600' };
    return { color: 'bg-success-500', text: 'EN CONTROL', icon: <CheckCircle2 size={14} />, textColor: 'text-success-600' };
  };

  const status = getStatus();

  return (
    <Card className="relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl p-3 bg-secondary-100 dark:bg-secondary-800 rounded-2xl group-hover:scale-110 transition-transform">
            {budget.categoryIcon || '💰'}
          </div>
          <div>
            <h4 className="font-black text-secondary-900 dark:text-white uppercase tracking-tight text-sm">
              {budget.categoryLabel}
            </h4>
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${status.textColor}`}>
              {status.icon} {status.text}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black tracking-tighter text-secondary-900 dark:text-white">
            {percentage.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="space-y-2">
        <div className="w-full bg-secondary-100 dark:bg-secondary-800 h-3 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ease-out ${status.color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-black text-secondary-400 uppercase tracking-widest">
          <span>Gastado: ${spent.toLocaleString()}</span>
          <span>Límite: ${budget.amount.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default BudgetProgress;