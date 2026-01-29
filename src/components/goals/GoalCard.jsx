import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const GoalCard = ({ goal, currency = 'MXN', onEdit, onDelete, onAddContribution }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  const getStatusColor = () => {
    if (goal.completed) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 50) return 'warning';
    return 'default';
  };

  return (
    <Card hover>
      <div className="space-y-4">
        {/* Header with Image */}
        {goal.imageUrl && (
          <div className="w-full h-32 rounded-lg overflow-hidden bg-secondary-100 dark:bg-secondary-800">
            <img 
              src={goal.imageUrl} 
              alt={goal.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Goal Info */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-secondary-900 dark:text-white">
              {goal.name}
            </h3>
            {goal.description && (
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                {goal.description}
              </p>
            )}
          </div>
          <Badge variant={getStatusColor()}>
            {goal.completed ? 'Completada' : `${percentage.toFixed(0)}%`}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-secondary-600 dark:text-secondary-400">
              Ahorrado: {formatCurrency(goal.currentAmount)}
            </span>
            <span className="font-medium text-secondary-900 dark:text-white">
              {formatCurrency(goal.targetAmount)}
            </span>
          </div>
          <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                goal.completed 
                  ? 'bg-success-500' 
                  : 'bg-gradient-to-r from-primary-400 to-primary-600'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Remaining */}
        {!goal.completed && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-600 dark:text-secondary-400">
              Faltan: {formatCurrency(remaining)}
            </span>
            {goal.deadline && (
              <span className="text-secondary-600 dark:text-secondary-400">
                Meta: {new Date(goal.deadline).toLocaleDateString('es-MX', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-secondary-200 dark:border-secondary-700">
          {!goal.completed && onAddContribution && (
            <button
              onClick={() => onAddContribution(goal)}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              💰 Agregar Aporte
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="px-4 py-2 text-info-600 hover:bg-info-50 dark:hover:bg-info-900/20 rounded-lg transition-colors text-sm"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="px-4 py-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors text-sm"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;