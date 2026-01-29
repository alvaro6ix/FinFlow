import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../common/Card';

const TrendChart = ({ data = [], currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
    }).format(amount);
  };

  const maxValue = Math.max(...data.map(d => d.amount), 1);

  return (
    <Card title="Tendencia Semanal">
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
            />
            <YAxis hide domain={[0, maxValue * 1.1]} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'lg' }}
            />
            <Bar dataKey="amount" radius={[8, 8, 8, 8]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.amount === maxValue ? '#7c3aed' : '#e2e8f0'} 
                  className="transition-all duration-500"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-6 pt-4 border-t border-secondary-100 dark:border-secondary-800">
        <div className="text-center">
          <p className="text-[10px] font-bold text-secondary-400 uppercase">Pico máximo</p>
          <p className="text-sm font-black text-secondary-900 dark:text-white">{formatCurrency(maxValue)}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-secondary-400 uppercase">Día más activo</p>
          <p className="text-sm font-black text-primary-600">{data.find(d => d.amount === maxValue)?.label || '-'}</p>
        </div>
      </div>
    </Card>
  );
};

export default TrendChart;