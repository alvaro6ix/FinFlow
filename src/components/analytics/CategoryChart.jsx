import React from 'react';
import Card from '../common/Card';
import { DEFAULT_CATEGORIES } from '../../constants/categories';

const CategoryChart = ({ expenses = [], currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Agrupar por categoría
  const categoryData = expenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += expense.amount;
    return acc;
  }, {});

  const total = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);

  // Convertir a array y ordenar
  const chartData = Object.entries(categoryData)
    .map(([id, amount]) => {
      const category = DEFAULT_CATEGORIES.find(cat => cat.id === id);
      return {
        id,
        name: category?.name || 'Otro',
        icon: category?.icon || '💰',
        color: category?.color || '#64748b',
        amount,
        percentage: (amount / total) * 100,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  if (chartData.length === 0) {
    return (
      <Card title="Gastos por Categoría">
        <div className="text-center py-8 text-secondary-500">
          No hay datos para mostrar
        </div>
      </Card>
    );
  }

  return (
    <Card title="Gastos por Categoría">
      <div className="space-y-4">
        {/* Pie Chart Simulation */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              {chartData.reduce((acc, item, index) => {
                const prevPercentage = chartData
                  .slice(0, index)
                  .reduce((sum, i) => sum + i.percentage, 0);
                
                const circumference = 2 * Math.PI * 70;
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((prevPercentage / 100) * circumference);

                return [
                  ...acc,
                  <circle
                    key={item.id}
                    cx="96"
                    cy="96"
                    r="70"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="40"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                ];
              }, [])}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {formatCurrency(total)}
                </div>
                <div className="text-xs text-secondary-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {chartData.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium text-secondary-900 dark:text-white">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-secondary-900 dark:text-white">
                  {formatCurrency(item.amount)}
                </div>
                <div className="text-xs text-secondary-500">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CategoryChart;