import React from 'react';
import Card from '../common/Card';

const GoalProgress = ({ goals = [], currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
    }).format(amount);
  };

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const percentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  const completed = goals.filter(g => g.completed).length;

  return (
    <Card title="Progreso Total de Metas">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary-600">
              {goals.length}
            </div>
            <div className="text-xs text-secondary-600 dark:text-secondary-400">
              Metas Totales
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success-600">
              {completed}
            </div>
            <div className="text-xs text-secondary-600 dark:text-secondary-400">
              Completadas
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-info-600">
              {percentage.toFixed(0)}%
            </div>
            <div className="text-xs text-secondary-600 dark:text-secondary-400">
              Progreso
            </div>
          </div>
        </div>

        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <div className="text-secondary-600 dark:text-secondary-400">Ahorrado</div>
            <div className="font-bold text-secondary-900 dark:text-white">
              {formatCurrency(totalSaved)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-secondary-600 dark:text-secondary-400">Meta Total</div>
            <div className="font-bold text-secondary-900 dark:text-white">
              {formatCurrency(totalTarget)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoalProgress;