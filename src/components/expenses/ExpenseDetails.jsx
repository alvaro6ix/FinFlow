import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { DEFAULT_CATEGORIES } from '../../constants/categories';

const ExpenseDetails = ({ expense, isOpen, onClose, currency = 'MXN' }) => {
  if (!expense) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const category = DEFAULT_CATEGORIES.find(cat => cat.id === expense.categoryId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del Gasto"
      size="md"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">{category?.icon || '💰'}</div>
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {formatCurrency(expense.amount)}
          </div>
          <Badge variant="primary">{category?.name || 'Otro'}</Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Descripción
            </div>
            <div className="font-medium text-secondary-900 dark:text-white">
              {expense.description || 'Sin descripción'}
            </div>
          </div>

          <div>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Fecha
            </div>
            <div className="font-medium text-secondary-900 dark:text-white">
              {formatDate(expense.date)}
            </div>
          </div>

          {expense.paymentMethod && (
            <div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Método de pago
              </div>
              <div className="font-medium text-secondary-900 dark:text-white">
                {expense.paymentMethod}
              </div>
            </div>
          )}

          {expense.tags && expense.tags.length > 0 && (
            <div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                Etiquetas
              </div>
              <div className="flex flex-wrap gap-2">
                {expense.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ExpenseDetails;