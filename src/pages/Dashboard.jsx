import { useMemo, useEffect } from "react";
import { useExpenseStore } from "../stores/expenseStore";
import { useBudgetStore } from "../stores/budgetStore";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import Card from "../components/common/Card";
import FloatingActionButton from "../components/common/FloatingActionButton";
import QuickAddModal from "../components/expenses/QuickAddModal";
import PsychologyDashboard from "../components/dashboard/PsychologyDashboard";
import Insights from "../components/dashboard/Insights";
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-secondary-900 p-4 rounded-xl shadow-xl border border-secondary-200 dark:border-secondary-800">
        <p className="text-[10px] font-black uppercase text-secondary-500 mb-1">{data.fullDate}</p>
        <p className="text-sm font-bold text-secondary-900 dark:text-white uppercase">{data.categoryName}</p>
        <p className="text-xl font-black text-amber-500 mt-1">${Number(data.amount).toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { expenses, subscribeExpenses } = useExpenseStore();
  const { budgets } = useBudgetStore();
  const { user } = useAuthStore();
  const { openQuickAddModal } = useUIStore();

  useEffect(() => {
    if (user?.uid) {
      const unsub = subscribeExpenses(user.uid);
      return () => unsub && unsub();
    }
  }, [user?.uid, subscribeExpenses]);

  const metrics = useMemo(() => {
    const now = new Date();
    const normalizeDate = (date) => (date?.toDate ? date.toDate() : new Date(date));

    // LIMPIEZA TOTAL: Filtramos undefined y convertimos montos
    const cleanExpenses = expenses.filter(e => e.categoryName && e.categoryName !== "undefined");
    
    const currentMonthExpenses = cleanExpenses.filter((e) => {
      const d = normalizeDate(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const antTotal = currentMonthExpenses.filter((e) => Number(e.amount) < 50).reduce((sum, e) => sum + Number(e.amount), 0);

    let score = 100;
    if (totalBudget > 0) score = Math.max(0, Math.min(100, Math.round((1 - (totalSpent / totalBudget)) * 100)));
    else score = Math.max(10, 100 - Math.floor(totalSpent / 1500) * 5);

    // ORDEN CRONOLÓGICO: Antiguo (Izq) -> Reciente (Der)
    const chartData = [...currentMonthExpenses]
      .sort((a, b) => normalizeDate(a.date).getTime() - normalizeDate(b.date).getTime())
      .slice(-7)
      .map((e) => {
        const d = normalizeDate(e.date);
        return {
          ...e,
          amount: Number(e.amount),
          displayDate: `${d.getDate()}-${d.toLocaleString('es-MX',{month:'short'}).replace('.','')}`,
          fullDate: d.toLocaleDateString("es-MX", { day: "2-digit", month: "long" }),
          categoryName: e.categoryName || "Otros"
        };
      });

    return { totalSpent, totalBudget, antTotal, score, chartData };
  }, [expenses, budgets]);

  const scoreColor = metrics.score > 70 ? "#10b981" : metrics.score > 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-8 pb-24 px-2 sm:px-0">
      <div className="flex items-center justify-between pt-4 px-1">
        <div>
          <h1 className="text-4xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter">Hola, <span className="text-amber-500">{user?.displayName?.split(" ")[0]}</span></h1>
          <p className="text-[10px] font-black text-secondary-500 uppercase tracking-[0.3em] mt-2 ml-1">Resumen Mensual</p>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center font-black">
          <svg className="w-full h-full -rotate-90"><circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-secondary-200 dark:text-secondary-800" /><circle cx="32" cy="32" r="28" stroke={scoreColor} strokeWidth="5" fill="transparent" strokeDasharray={175} strokeDashoffset={175-(175*metrics.score)/100} strokeLinecap="round" className="transition-all duration-1000" /></svg>
          <span className="absolute text-xs" style={{ color: scoreColor }}>{metrics.score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-indigo-600 p-8 shadow-xl text-white">
          <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">Total Mensual</p>
          <p className="mt-2 text-4xl font-black tracking-tighter">${metrics.totalSpent.toLocaleString()}</p>
        </div>
        <Card className="bg-white dark:bg-secondary-900 border-none shadow-lg rounded-[2rem]">
          <p className="text-[10px] font-black uppercase text-secondary-400 tracking-widest">Gasto Hormiga 🐜</p>
          <p className="mt-2 text-4xl font-black text-red-500 tracking-tighter">${metrics.antTotal.toLocaleString()}</p>
        </Card>
      </div>

      <Insights expenses={expenses} />

      <Card title="Flujo de Gastos Recientes" className="border-none shadow-lg rounded-[2rem]">
        <div className="h-64 mt-4 w-full">
          {metrics.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.chartData} key={`chart-${metrics.chartData.map(e=>e.id).join('-')}`}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} width={35} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} />
                <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={32} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-full flex flex-col items-center justify-center text-secondary-400 italic font-black text-[10px] uppercase">Sin actividad este mes</div>}
        </div>
      </Card>

      <PsychologyDashboard expenses={expenses} />
      <FloatingActionButton onClick={openQuickAddModal} />
      <QuickAddModal />
    </div>
  );
};

export default Dashboard;