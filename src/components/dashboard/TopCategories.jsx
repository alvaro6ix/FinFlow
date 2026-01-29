import React from 'react';
import Card from '../common/Card';

const TopCategories = ({ categories = [], currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (categories.length === 0) {
    return (
      <Card title="Top 5 Categorías del Mes">
        <div className="text-center py-8 text-secondary-500">
          No hay gastos registrados aún
        </div>
      </Card>
    );
  }

  return (
    <Card title="Top 5 Categorías del Mes">
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium text-secondary-900 dark:text-white">
                  {category.name}
                </span>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary-900 dark:text-white">
                  {formatCurrency(category.total)}
                </p>
                <p className="text-xs text-secondary-500">
                  {category.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopCategories;