import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Card from '../common/Card';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency } from '../../utils/formatters';

const PredictionChart = () => {
  const { expenses } = useExpenses();
  
  // Lógica Senior: Proyectar gasto lineal basado en el promedio diario
  const today = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const dailyAverage = totalSpent / today;
  const projectedTotal = dailyAverage * daysInMonth;

  const data = [
    { day: 'Hoy', monto: totalSpent, tipo: 'Actual' },
    { day: 'Fin de Mes', monto: projectedTotal, tipo: 'Proyectado' }
  ];

  return (
    <Card title="Predicción de Cierre" subtitle="Proyección basada en tu ritmo actual">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="day" hide />
            <YAxis hide domain={[0, projectedTotal + 1000]} />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="monto" 
              stroke="#6366F1" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#6366F1' }} 
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
        <p className="text-xs font-black text-primary-700 dark:text-primary-400 uppercase tracking-widest">Gasto Estimado</p>
        <p className="text-2xl font-black text-secondary-900 dark:text-white">{formatCurrency(projectedTotal)}</p>
      </div>
    </Card>
  );
};

export default PredictionChart;