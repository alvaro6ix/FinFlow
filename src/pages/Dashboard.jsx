import React, { useMemo } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { useBudgetStore } from '../stores/budgetStore';
import Card from '../components/common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const { expenses } = useExpenseStore();
  const { budgets } = useBudgetStore();

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    
    // GASTOS HORMIGA (Requerimiento 4.1)
    const antExpenses = currentMonthExpenses.filter(e => e.amount < 50);
    const antTotal = antExpenses.reduce((sum, e) => sum + e.amount, 0);

    // SCORE DE SALUD (Requerimiento 4.1)
    let score = 100;
    if (totalBudget > 0) {
      const ratio = totalSpent / totalBudget;
      if (ratio > 1) score = 30;
      else if (ratio > 0.8) score = 60;
      else score = 90;
    }

    return { totalSpent, totalBudget, antTotal, score, count: currentMonthExpenses.length };
  }, [expenses, budgets]);

  const scoreColor = metrics.score > 70 ? '#10b981' : metrics.score > 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-6 pb-24">
      {/* Saludo y Score */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Hola, Alvaro</h1>
          <p className="text-secondary-500 text-sm">Huayra Mx - Resumen de hoy</p>
        </div>
        <div className="relative flex items-center justify-center w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary-200 dark:text-secondary-800" />
            <circle cx="32" cy="32" r="28" stroke={scoreColor} strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * metrics.score) / 100} strokeLinecap="round" />
          </svg>
          <span className="absolute text-xs font-bold" style={{ color: scoreColor }}>{metrics.score}</span>
        </div>
      </div>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary-600 text-white border-none">
          <p className="text-[10px] uppercase opacity-80">Gastado</p>
          <p className="text-xl font-bold">${metrics.totalSpent.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase text-secondary-500">Gastos Hormiga</p>
          <p className="text-xl font-bold text-danger-500">${metrics.antTotal.toLocaleString()}</p>
        </Card>
      </div>

      {/* Insights Requerimiento 4.1 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold dark:text-white px-1">Insights del Mes</h3>
        <Card className="border-l-4 border-l-primary-500">
          <p className="text-sm dark:text-secondary-300">
            {metrics.totalSpent > metrics.totalBudget && metrics.totalBudget > 0 
              ? "⚠️ Has superado tu presupuesto mensual."
              : `🎉 Llevas ${metrics.count} registros este mes. ¡Buen seguimiento!`}
          </p>
        </Card>
        {metrics.antTotal > 500 && (
          <Card className="border-l-4 border-l-warning-500">
            <p className="text-sm dark:text-secondary-300">
              🕵️ Tus "gastos hormiga" suman <strong>${metrics.antTotal}</strong>. Podrías invertirlos en tu meta.
            </p>
          </Card>
        )}
      </div>

      {/* Gráfico Río Financiero (Simplificado para Mobile) */}
      <Card>
        <h3 className="text-xs font-bold mb-4 uppercase text-secondary-500">Flujo de Gastos</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenses.slice(0, 7).reverse()}>
              <XAxis dataKey="date" hide />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`$${value}`, 'Monto']}
              />
              <Bar dataKey="amount" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;