import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import Card from '../common/Card';

const TimeChart = ({ expenses = [] }) => {
  // Inicializar las 24 horas del día
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    amount: 0,
    fullHour: i
  }));

  // Agrupar gastos por hora
  expenses.forEach(exp => {
    const hour = new Date(exp.date).getHours();
    hourlyData[hour].amount += exp.amount;
  });

  const maxAmount = Math.max(...hourlyData.map(d => d.amount), 1);

  return (
    <Card title="Gastos por Hora" subtitle="Identifica tus picos de consumo diario">
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis 
              dataKey="hour" 
              interval={3} // Mostrar etiquetas cada 3 horas para no saturar
              axisLine={false}
              tickLine={false}
              tick={{fontSize: 10, fill: '#94a3b8'}}
            />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'lg' }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Gasto Total']}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {hourlyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  // Gradiente visual: más oscuro donde hay más gasto
                  fill={entry.amount > 0 ? `rgba(99, 102, 241, ${Math.max(0.2, entry.amount / maxAmount)})` : '#e2e8f0'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-center text-secondary-400 font-bold uppercase mt-4 tracking-widest">
        Análisis de actividad en 24 horas
      </p>
    </Card>
  );
};

export default TimeChart;