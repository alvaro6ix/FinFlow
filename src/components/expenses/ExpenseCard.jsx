import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { DEFAULT_CATEGORIES } from '../../constants/categories';

const ExpenseCard = ({ expense, onDelete, onEdit, currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const category = DEFAULT_CATEGORIES.find(cat => cat.id === expense.categoryId);

  return (
    <Card hover className="cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-2xl">
          {category?.icon || '💰'}
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-secondary-900 dark:text-white">
            {expense.description}
          </h3>
          <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400 mt-1">
            <span>{category?.name || 'Otro'}</span>
            <span>•</span>
            <span>{formatDate(expense.date)}</span>
            {expense.paymentMethod && (
              <>
                <span>•</span>
                <Badge size="sm" variant="default">
                  {expense.paymentMethod}
                </Badge>
              </>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-primary-600">
            {formatCurrency(expense.amount)}
          </div>
          <div className="flex gap-2 mt-2">
            {onEdit && (
              <button
                onClick={() => onEdit(expense)}
                className="text-sm text-info-600 hover:text-info-700"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(expense.id)}
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

export default ExpenseCard;