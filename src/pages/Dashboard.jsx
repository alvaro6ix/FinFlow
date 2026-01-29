import React, { useMemo } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { useBudgetStore } from '../stores/budgetStore';
import { useAuthStore } from '../stores/authStore';
import Card from '../components/common/Card';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { expenses } = useExpenseStore();
  const { budgets } = useBudgetStore();
  const { user } = useAuthStore();

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const antTotal = currentMonthExpenses.filter(e => e.amount < 50).reduce((sum, e) => sum + e.amount, 0);

    let score = 100;
    if (totalBudget > 0) {
      const ratio = totalSpent / totalBudget;
      score = ratio > 1 ? 30 : ratio > 0.8 ? 60 : 95;
    }

    return { totalSpent, totalBudget, antTotal, score, count: currentMonthExpenses.length };
  }, [expenses, budgets]);

  // Color de Salud Financiera dinámico
  const scoreColor = metrics.score > 70 ? '#10b981' : metrics.score > 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-6 pb-24">
      {/* Saludo dinámico aislado de otros proyectos */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter leading-none">
            Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}
          </h1>
          <p className="text-secondary-500 text-xs font-bold uppercase tracking-widest mt-1">
            Resumen de actividad personal
          </p>
        </div>
        <div className="relative flex items-center justify-center w-14 h-14">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary-100 dark:text-secondary-800" />
            <circle cx="28" cy="28" r="24" stroke={scoreColor} strokeWidth="4" fill="transparent" strokeDasharray={150} strokeDashoffset={150 - (150 * metrics.score) / 100} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <span className="absolute text-[10px] font-black" style={{ color: scoreColor }}>{metrics.score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-amber-500 text-white border-none shadow-lg shadow-amber-500/20">
          <p className="text-[10px] font-black uppercase opacity-80 mb-1">Total Gastado</p>
          <p className="text-2xl font-black">${metrics.totalSpent.toLocaleString()}</p>
        </Card>
        <Card className="bg-white dark:bg-secondary-900">
          <p className="text-[10px] font-black uppercase text-secondary-400 mb-1">Gastos Hormiga</p>
          <p className="text-2xl font-black text-red-500">${metrics.antTotal.toLocaleString()}</p>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-secondary-400 uppercase tracking-widest px-1">Insights del Mes</h3>
        <Card className="border-l-4 border-l-amber-500">
          <p className="text-sm font-bold text-secondary-700 dark:text-secondary-200 leading-tight">
            {metrics.totalSpent > metrics.totalBudget && metrics.totalBudget > 0 
              ? "Has superado tu límite. Revisa tus presupuestos."
              : `Llevas ${metrics.count} registros este mes. ¡Sigue así!`}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="text-[10px] font-black uppercase text-secondary-400 mb-6 tracking-widest">Flujo de Gastos Recientes</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenses.slice(0, 6).reverse()}>
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'lg', fontWeight: 'bold' }} />
              <Bar dataKey="amount" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;