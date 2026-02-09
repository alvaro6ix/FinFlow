import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1b4b] text-white p-3 rounded-xl shadow-2xl border border-white/10">
        <p className="text-[10px] font-bold text-secondary-300 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-lg font-black text-[#FFD700]">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-72 w-full"> {/* Un poco más alto para que quepan los ejes */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          {/* Cuadrícula de referencia */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
          
          {/* Eje X (Fechas) */}
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }} 
            dy={10}
            minTickGap={30} // Evita que las fechas se encimen
          />
          
          {/* Eje Y (Dinero) */}
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 'bold' }}
            tickFormatter={(value) => `$${value}`}
            width={45}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }} />
          
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#FFD700' }} // Punto dorado interactivo
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};