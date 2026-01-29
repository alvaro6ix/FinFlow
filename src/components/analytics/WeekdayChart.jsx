import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import Card from '../common/Card';

const WeekdayChart = ({ expenses = [] }) => {
  const days = [
    { label: 'Dom', dayIdx: 0, amount: 0 },
    { label: 'Lun', dayIdx: 1, amount: 0 },
    { label: 'Mar', dayIdx: 2, amount: 0 },
    { label: 'Mié', dayIdx: 3, amount: 0 },
    { label: 'Jue', dayIdx: 4, amount: 0 },
    { label: 'Vie', dayIdx: 5, amount: 0 },
    { label: 'Sáb', dayIdx: 6, amount: 0 },
  ];

  // Agrupar por día
  expenses.forEach(exp => {
    const day = new Date(exp.date).getDay();
    days[day].amount += exp.amount;
  });

  // Reordenar para que la semana empiece en Lunes (estándar MX)
  const sortedDays = [...days.slice(1), days[0]];
  const maxVal = Math.max(...sortedDays.map(d => d.amount), 1);

  return (
    <Card title="Hábito Semanal" subtitle="¿Qué días sale más dinero?">
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedDays}>
            <XAxis 
              dataKey="label" 
              axisLine={false}
              tickLine={false}
              tick={{fontSize: 12, fontWeight: 'bold', fill: '#64748b'}}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '15px', border: 'none', shadow: 'xl' }}
            />
            <Bar dataKey="amount" radius={[10, 10, 10, 10]} barSize={35}>
              {sortedDays.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.amount === maxVal ? '#ef4444' : '#6366f1'} 
                  fillOpacity={entry.amount === 0 ? 0.1 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-[10px] font-bold text-secondary-500 uppercase">Día de mayor gasto</span>
        </div>
      </div>
    </Card>
  );
};

export default WeekdayChart;