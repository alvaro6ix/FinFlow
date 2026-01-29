import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const GoalCalculator = ({ goal, currency = 'MXN' }) => {
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [result, setResult] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const calculateTimeToGoal = () => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthly = parseFloat(monthlyAmount);

    if (!monthly || monthly <= 0) {
      alert('Ingresa un monto válido');
      return;
    }

    const months = Math.ceil(remaining / monthly);
    const date = new Date();
    date.setMonth(date.getMonth() + months);

    setResult({
      months,
      date: date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    });
  };

  return (
    <Card title="🧮 Calculadora de Meta">
      <div className="space-y-4">
        <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
          <div className="text-sm text-secondary-600 dark:text-secondary-400">
            Te faltan
          </div>
          <div className="text-2xl font-bold text-primary-600">
            {formatCurrency(goal.targetAmount - goal.currentAmount)}
          </div>
        </div>

        <Input
          label="¿Cuánto puedes ahorrar mensualmente?"
          type="number"
          step="0.01"
          value={monthlyAmount}
          onChange={(e) => setMonthlyAmount(e.target.value)}
          placeholder="0.00"
        />

        <Button
          variant="primary"
          fullWidth
          onClick={calculateTimeToGoal}
          disabled={!monthlyAmount}
        >
          Calcular
        </Button>

        {result && (
          <div className="bg-success-50 dark:bg-success-900/20 p-4 rounded-lg border-2 border-success-200 dark:border-success-800">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-lg font-bold text-secondary-900 dark:text-white mb-1">
                ¡Lo lograrás en {result.months} {result.months === 1 ? 'mes' : 'meses'}!
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Fecha estimada: {result.date}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GoalCalculator;