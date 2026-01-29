import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const FinancialRiver = ({ data = [] }) => {
  // data debe venir formateada: { day: '01', income: 500, expenses: 200 }
  if (data.length === 0) {
    return (
      <Card title="Río Financiero">
        <div className="h-48 flex items-center justify-center text-secondary-400 text-sm italic font-medium">
          Aún no hay suficiente caudal de datos...
        </div>
      </Card>
    );
  }

  return (
    <Card title="Río Financiero (Ingresos vs Gastos)">
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#94a3b8'}}
            />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success-500 rounded-full shadow-sm shadow-success-500/50"></div>
          <span className="text-secondary-600 dark:text-secondary-400">Entradas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-danger-500 rounded-full shadow-sm shadow-danger-500/50"></div>
          <span className="text-secondary-600 dark:text-secondary-400">Salidas</span>
        </div>
      </div>
    </Card>
  );
};

export default FinancialRiver;