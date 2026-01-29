import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Calendar, TrendingUp, Clock } from 'lucide-react';

const GoalCard = ({ goal, currency = 'MXN', onEdit, onDelete, onAddContribution }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  // REQUERIMIENTO 6.4: Proyección de Meta (Simulada basada en ahorro actual vs tiempo)
  const calculateEstimate = () => {
    if (goal.completed) return "¡Meta cumplida! 🎉";
    if (!goal.deadline) return "Sin fecha límite definida";
    
    const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return "Plazo vencido ⚠️";
    
    const dailySavingNeeded = remaining / daysLeft;
    return `Ahorra ${formatCurrency(dailySavingNeeded)}/día para lograrlo.`;
  };

  return (
    <Card className="overflow-hidden border-t-4 shadow-lg transition-transform hover:scale-[1.02]" 
          style={{ borderTopColor: goal.priority === 'high' ? '#ef4444' : goal.priority === 'medium' ? '#f59e0b' : '#3b82f6' }}>
      <div className="p-1 space-y-4">
        {goal.imageUrl && (
          <div className="w-full h-32 rounded-2xl overflow-hidden bg-secondary-100 mb-2">
            <img src={goal.imageUrl} alt={goal.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-black text-xl text-secondary-900 dark:text-white uppercase tracking-tight">
              {goal.name}
            </h3>
            <p className="text-xs text-secondary-500 font-bold flex items-center gap-1 mt-1">
              <Clock size={12} /> {calculateEstimate()}
            </p>
          </div>
          <Badge variant={goal.completed ? 'success' : 'primary'}>
            {goal.completed ? 'COMPLETO' : `${percentage.toFixed(0)}%`}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase text-secondary-400">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="w-full bg-secondary-100 dark:bg-secondary-800 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${goal.completed ? 'bg-success-500' : 'bg-primary-500'}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          {!goal.completed && (
            <button 
              onClick={() => onAddContribution(goal)}
              className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp size={14} /> Aportar
            </button>
          )}
          <button 
            onClick={() => onDelete(goal.id)}
            className="flex-1 bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 py-3 rounded-xl font-black text-xs uppercase hover:bg-danger-50 hover:text-danger-600 transition-all"
          >
            Borrar
          </button>
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;