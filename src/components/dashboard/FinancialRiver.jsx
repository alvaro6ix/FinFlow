import React, { useMemo } from "react";
import Card from "../common/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FinancialRiver = ({ expenses }) => {
  const chartData = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
      data.push({ day: i, label: `${i}`, gastos: 0 });
    }

    expenses.forEach((e) => {
      const d = e.date; // Asumimos que ya viene normalizado del Dashboard
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        const dayIdx = d.getDate() - 1;
        if (data[dayIdx]) data[dayIdx].gastos += Number(e.amount || 0);
      }
    });
    return data;
  }, [expenses]);

  return (
    <Card className="p-6 bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl h-full">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-[10px] font-black uppercase text-secondary-500 dark:text-secondary-400 tracking-[0.2em] mb-1">Flujo de Caja</p>
          <h3 className="text-sm font-black text-secondary-900 dark:text-white uppercase tracking-tight">Evolución de Gastos</h3>
        </div>
      </header>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff20" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900'}} 
              interval={4} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900'}} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(8px)',
                borderRadius: '1rem', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontWeight: '900',
                fontSize: '12px',
                color: '#1e293b'
              }} 
              itemStyle={{ color: '#6366f1' }}
              labelStyle={{ display: 'none' }}
              formatter={(value) => [`$${value}`, 'Gastos']}
            />
            <Area 
              type="monotone" 
              dataKey="gastos" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorGastos)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FinancialRiver;