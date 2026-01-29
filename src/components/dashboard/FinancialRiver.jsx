import React from 'react';
import Card from '../common/Card';

const FinancialRiver = ({ data = [], currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
    }).format(amount);
  };

  if (data.length === 0) {
    return (
      <Card title="Flujo Financiero">
        <div className="text-center py-8 text-secondary-500">
          No hay datos suficientes aún
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses)));

  return (
    <Card title="Flujo Financiero del Mes">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success-500 rounded"></div>
            <span className="text-secondary-600 dark:text-secondary-400">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-danger-500 rounded"></div>
            <span className="text-secondary-600 dark:text-secondary-400">Gastos</span>
          </div>
        </div>

        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-secondary-600 dark:text-secondary-400">
                <span>{item.label}</span>
                <span>
                  {formatCurrency(item.income)} / {formatCurrency(item.expenses)}
                </span>
              </div>
              <div className="relative h-8 bg-secondary-100 dark:bg-secondary-800 rounded-lg overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-success-500 opacity-50"
                  style={{ width: `${(item.income / maxValue) * 100}%` }}
                />
                <div
                  className="absolute left-0 top-0 h-full bg-danger-500 opacity-50"
                  style={{ width: `${(item.expenses / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FinancialRiver;