import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CategoryChart = ({ data }) => {
  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60} // Efecto Donut elegante
            outerRadius={80}
            paddingAngle={5}
            dataKey="amount" // ✅ CORRECCIÓN: Ahora coincide con el motor de datos
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e1b4b', 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              color: 'white'
            }}
            itemStyle={{ color: '#FFD700' }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Gasto']} // ✅ Español
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-[10px] font-bold text-secondary-500 ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Total Central (Toque Pro) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
        <span className="text-[10px] font-black text-secondary-400 uppercase tracking-widest opacity-50">Total</span>
      </div>
    </div>
  );
};

export default CategoryChart;