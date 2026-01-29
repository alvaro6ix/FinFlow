import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

const MonthSummary = ({ total = 0, count = 0, projection = 0, comparison = 0, currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Gastado - Enfoque Principal */}
      <Card className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp size={64} className="text-primary-600" />
        </div>
        <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1">Total Gastado</p>
        <p className="text-4xl font-black text-primary-600 tracking-tighter">
          {formatCurrency(total)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <Badge variant="primary">{count} Transacciones</Badge>
          <span className="text-[10px] text-secondary-400 font-bold">MES ACTUAL</span>
        </div>
      </Card>

      {/* Proyección Inteligente */}
      <Card className="bg-gradient-to-br from-info-50/50 to-transparent dark:from-info-950/20 border-info-100 dark:border-info-900/30">
        <p className="text-[10px] font-black text-info-600 dark:text-info-400 uppercase tracking-widest mb-1 flex items-center gap-1">
          <Target size={12} /> Proyección Fin de Mes
        </p>
        <p className="text-4xl font-black text-info-600 tracking-tighter">
          {formatCurrency(projection)}
        </p>
        <p className="text-[10px] text-info-500/70 mt-4 font-bold italic">
          "A este ritmo, así terminarás tu mes"
        </p>
      </Card>

      {/* Comparativa vs Mes Anterior */}
      <Card>
        <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-1">Vs. Mes Anterior</p>
        <div className="flex items-center gap-2">
          <p className={`text-4xl font-black tracking-tighter ${comparison < 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {comparison < 0 ? '-' : '+'}{Math.abs(comparison).toFixed(1)}%
          </p>
          {comparison < 0 ? <TrendingDown className="text-success-600" /> : <TrendingUp className="text-danger-600" />}
        </div>
        <div className={`mt-4 text-[10px] font-bold px-3 py-1 rounded-full w-fit ${
          comparison < 0 ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'
        }`}>
          {comparison < 0 ? 'AHORRANDO MÁS QUE AYER' : 'GASTANDO MÁS QUE AYER'}
        </div>
      </Card>
    </div>
  );
};

export default MonthSummary;