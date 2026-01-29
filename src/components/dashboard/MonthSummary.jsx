import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

const MonthSummary = ({ total, count, projection, comparison, currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <div className="text-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
            Total Gastado
          </p>
          <p className="text-3xl font-bold text-primary-600">
            {formatCurrency(total)}
          </p>
          <div className="mt-2">
            <Badge variant="primary">{count} gastos</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
            Proyección Mes
          </p>
          <p className="text-3xl font-bold text-info-600">
            {formatCurrency(projection)}
          </p>
          <p className="text-xs text-secondary-500 mt-2">
            Basado en tu ritmo actual
          </p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
            vs Mes Anterior
          </p>
          <p
            className={`text-3xl font-bold ${
              comparison < 0 ? 'text-success-600' : 'text-danger-600'
            }`}
          >
            {comparison < 0 ? '↓' : '↑'} {Math.abs(comparison).toFixed(1)}%
          </p>
          <p className="text-xs text-secondary-500 mt-2">
            {comparison < 0 ? '¡Estás ahorrando!' : 'Gastaste más'}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MonthSummary;