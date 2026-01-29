import React from 'react';
import Card from '../common/Card';

const BudgetProgress = ({ budgets = [], expenses = [], currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
    }).format(amount);
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getColor = () => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  return (
    <Card title="Progreso General">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {percentage.toFixed(0)}%
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Del presupuesto total utilizado
          </p>
        </div>

        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${
              getColor() === 'success' ? 'bg-success-500' :
              getColor() === 'warning' ? 'bg-warning-500' :
              'bg-danger-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <div className="text-secondary-600 dark:text-secondary-400">Gastado</div>
            <div className="font-bold text-secondary-900 dark:text-white">
              {formatCurrency(totalSpent)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-secondary-600 dark:text-secondary-400">Total</div>
            <div className="font-bold text-secondary-900 dark:text-white">
              {formatCurrency(totalBudget)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetProgress;