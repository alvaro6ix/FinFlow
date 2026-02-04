import React, { useMemo } from "react";
import Card from "../common/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FinancialRiver = ({ expenses }) => {
  const chartData = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
      data.push({ day: i, label: `${i}`, gastos: 0, ingresos: 0 });
    }

    expenses.forEach((e) => {
      const d = e.date?.toDate ? e.date.toDate() : new Date(e.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        const dayIdx = d.getDate() - 1;
        if (data[dayIdx]) data[dayIdx].gastos += Number(e.amount || 0);
      }
    });

    // NOTA: Los ingresos se mantendrán en 0 hasta que conectemos el store de Ingresos real
    return data;
  }, [expenses]);

  return (
    <Card className="p-6 bg-white dark:bg-secondary-900 border-none shadow-xl rounded-[2.5rem]">
      <header className="mb-6">
        <p className="text-[10px] font-black uppercase text-secondary-400 tracking-[0.2em] mb-1">Flujo de Caja</p>
        <h3 className="text-sm font-black text-secondary-900 dark:text-white uppercase">Gastos vs Ingresos Reales</h3>
      </header>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900'}} interval={4} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '900'}} />
            <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', fontWeight: '900', textTransform: 'uppercase' }} />
            
            {/* Solo colores sólidos (Morado para Gastos, Amarillo para Ingresos) */}
            <Area type="monotone" dataKey="ingresos" stroke="#f59e0b" strokeWidth={3} fill="#f59e0b" fillOpacity={0.1} />
            <Area type="monotone" dataKey="gastos" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FinancialRiver;