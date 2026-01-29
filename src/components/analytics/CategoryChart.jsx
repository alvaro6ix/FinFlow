import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../common/Card';

const CategoryChart = ({ data = [], total = 0, currency = 'MXN' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (data.length === 0) {
    return (
      <Card title="Gastos por Categoría">
        <div className="text-center py-12 text-secondary-500 italic text-sm">
          No hay datos para analizar este período
        </div>
      </Card>
    );
  }

  return (
    <Card title="Distribución por Categoría">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-4">
          <p className="text-[10px] font-black text-secondary-400 uppercase">Total</p>
          <p className="text-xl font-black text-secondary-900 dark:text-white leading-none">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CategoryChart;