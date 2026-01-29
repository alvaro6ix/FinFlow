import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { DEFAULT_CATEGORIES } from '../../constants/categories';

const BudgetCard = ({ budget, spent = 0, currency = 'MXN', onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const percentage = (spent / budget.amount) * 100;
  const remaining = budget.amount - spent;
  const category = DEFAULT_CATEGORIES.find(cat => cat.id === budget.categoryId);

  const getStatusColor = () => {
    if (percentage >= 100) return 'danger';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-danger-500';
    if (percentage >= 80) return 'bg-warning-500';
    return 'bg-success-500';
  };

  return (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category?.icon || '🎯'}</span>
            <div>
              <h3 className="font-bold text-secondary-900 dark:text-white">
                {category?.name || budget.categoryName}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Presupuesto {budget.period === 'monthly' ? 'Mensual' : 'Anual'}
              </p>
            </div>
          </div>
          <Badge variant={getStatusColor()}>
            {percentage.toFixed(0)}%
          </Badge>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-secondary-600 dark:text-secondary-400">
              Gastado: {formatCurrency(spent)}
            </span>
            <span className="font-medium text-secondary-900 dark:text-white">
              {formatCurrency(budget.amount)}
            </span>
          </div>
          <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm">
            {remaining > 0 ? (
              <span className="text-success-600">
                Disponible: {formatCurrency(remaining)}
              </span>
            ) : (
              <span className="text-danger-600">
                Excedido por: {formatCurrency(Math.abs(remaining))}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(budget)}
                className="text-sm text-info-600 hover:text-info-700"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(budget.id)}
                className="text-sm text-danger-600 hover:text-danger-700"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BudgetCard;