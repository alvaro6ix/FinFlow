import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

export const WeekBarChart = ({ data, peakDay }) => (
  <div className="h-48 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis 
          dataKey="short" 
          axisLine={false} 
          tickLine={false} 
          tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} 
        />
        <Tooltip 
          cursor={{fill: 'transparent'}} 
          contentStyle={{ 
            backgroundColor: '#1e1b4b', 
            borderRadius: '12px', 
            border: 'none',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}
          itemStyle={{ color: '#FFD700' }}
          formatter={(value) => [`$${value.toLocaleString()}`, 'Gasto Total']} // ✅ Español
        />
        <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={32}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.name === peakDay ? '#FFD700' : '#6366f1'} // Día pico Dorado, resto Indigo
              fillOpacity={entry.name === peakDay ? 1 : 0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);