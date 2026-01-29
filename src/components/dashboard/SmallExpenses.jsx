import React from 'react';
import Card from '../common/Card';
import { Coffee, AlertCircle } from 'lucide-react';

const SmallExpenses = ({ amount = 0, currency = 'MXN' }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  if (amount === 0) return null;

  // Cálculo de proyección anual para impacto psicológico
  const annualProjection = amount * 12;

  return (
    <Card className="border-l-4 border-l-amber-500">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner">
          🐜
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-tight flex items-center justify-center sm:justify-start gap-2">
            Gastos Hormiga <Coffee size={18} className="text-amber-600" />
          </h3>
          <p className="text-sm text-secondary-500 font-medium">
            Pequeños consumos menores a $50 que acumulaste este mes.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-xl w-fit mx-auto sm:mx-0">
            <AlertCircle size={14} /> 
            PROYECCIÓN ANUAL: {formatCurrency(annualProjection)}
          </div>
        </div>
        <div className="text-center sm:text-right bg-secondary-50 dark:bg-secondary-800 p-4 rounded-2xl min-w-[120px]">
          <p className="text-[10px] font-black text-secondary-400 uppercase mb-1">Total Mes</p>
          <p className="text-3xl font-black text-amber-600 tracking-tighter">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SmallExpenses;