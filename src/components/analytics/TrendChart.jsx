import React from 'react';
import Card from '../common/Card';

const TrendChart = ({ data = [], currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
    }).format(amount);
  };

  if (data.length === 0) {
    return (
      <Card title="Tendencia de Gastos">
        <div className="text-center py-8 text-secondary-500">
          No hay suficientes datos
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.amount));

  return (
    <Card title="Tendencia de Gastos">
      <div className="space-y-4">
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                <div
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all duration-500 hover:from-primary-600 hover:to-primary-400"
                  style={{
                    height: `${(item.amount / maxValue) * 100}%`,
                    minHeight: '10px',
                  }}
                  title={formatCurrency(item.amount)}
                />
              </div>
              <div className="text-xs text-center text-secondary-600 dark:text-secondary-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-secondary-600 dark:text-secondary-400">Promedio</div>
              <div className="font-bold text-secondary-900 dark:text-white">
                {formatCurrency(data.reduce((sum, d) => sum + d.amount, 0) / data.length)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-secondary-600 dark:text-secondary-400">Máximo</div>
              <div className="font-bold text-secondary-900 dark:text-white">
                {formatCurrency(maxValue)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrendChart;