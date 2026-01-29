import React, { useMemo } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { useBudgetStore } from '../stores/budgetStore';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { calculateFinancialHealth, generateInsights } from '../utils/financialLogic';
import { SYSTEM_CATEGORIES } from '../constants/categories';
import Card from '../components/common/Card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const Dashboard = () => {
  const { expenses } = useExpenseStore();
  const { budgets } = useBudgetStore();
  const { user } = useAuthStore();
  const { currency } = useSettingsStore();

  // 1. Cálculos de salud e insights
  const health = useMemo(() => calculateFinancialHealth(expenses, budgets, 0), [expenses, budgets]);
  const insights = useMemo(() => generateInsights(expenses, budgets, 0), [expenses, budgets]);

  // 2. Formateador de moneda
  const formatMoney = (val) => new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency 
  }).format(val);

  // 3. Datos del Río Financiero (últimos 7 días)
  const riverData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayTotal = expenses
        .filter(e => new Date(e.date).toDateString() === d.toDateString())
        .reduce((s, e) => s + e.amount, 0);
      return { 
        day: d.toLocaleDateString('es-MX', { weekday: 'short' }), 
        amount: dayTotal 
      };
    });
  }, [expenses]);

  // 4. Top Categorías del Mes
  const categoryData = useMemo(() => {
    const totals = expenses.reduce((acc, exp) => {
      acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
      return acc;
    }, {});

    return Object.entries(totals)
      .map(([id, amount]) => {
        const cat = SYSTEM_CATEGORIES.find(c => c.id === id);
        return { name: cat?.label || 'Otro', value: amount, color: cat?.color || '#cbd5e1' };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [expenses]);

  // 5. Gastos Hormiga (< $50)
  const smallExpensesTotal = useMemo(() => {
    return expenses
      .filter(e => e.amount < 50)
      .reduce((s, e) => s + e.amount, 0);
  }, [expenses]);

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold dark:text-white">Hola, {user?.displayName || 'Usuario'} 👋</h1>
        <p className="text-secondary-500">Tu resumen financiero hoy.</p>
      </header>

      {/* Fila 1: Salud y Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="text-secondary-100 dark:text-secondary-800" strokeDasharray="100, 100" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-primary-500" strokeDasharray={`${health.score}, 100`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl dark:text-white">{health.score}</div>
            </div>
            <div>
              <h3 className="font-bold text-lg dark:text-white">Salud Financiera</h3>
              <p className="text-sm text-secondary-500">Vas por buen camino, mantén el control.</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-sm text-secondary-500 mb-1">Total Gastado</p>
            <p className="text-2xl font-bold text-primary-600">{formatMoney(health.totalSpent)}</p>
          </div>
        </Card>
      </div>

      {/* Río Financiero */}
      <Card title="Flujo de Gastos (7d)">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riverData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={3} fill="url(#colorAmt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Categorías */}
        <Card title="Top Categorías">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Insights y Hormiga */}
        <div className="space-y-4">
          <div className="p-4 bg-warning-50 rounded-2xl flex items-center justify-between border border-warning-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐜</span>
              <div>
                <p className="font-bold text-warning-700">Gastos Hormiga</p>
                <p className="text-xs text-warning-600">Pequeños gastos acumulados</p>
              </div>
            </div>
            <p className="text-xl font-bold text-warning-700">{formatMoney(smallExpensesTotal)}</p>
          </div>

          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div key={i} className="p-3 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 text-sm flex gap-2">
                <span>💡</span> {insight.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;