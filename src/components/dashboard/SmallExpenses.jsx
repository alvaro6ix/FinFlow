import React from 'react';
import Card from '../common/Card';

const SmallExpenses = ({ amount, currency = 'MXN' }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  if (amount === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="text-4xl">🐜</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
            Gastos Hormiga
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Pequeños gastos que suman
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-warning-600">
            {formatCurrency(amount)}
          </p>
          <p className="text-xs text-secondary-500">Gastos menores a $50</p>
        </div>
      </div>
    </Card>
  );
};

export default SmallExpenses;