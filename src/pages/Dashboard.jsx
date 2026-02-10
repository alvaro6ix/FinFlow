import React, { useMemo, useEffect } from "react";
import { useExpenseStore } from "../stores/expenseStore";
import { useBudgetStore } from "../stores/budgetStore";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import { useCategoryStore } from "../stores/categoryStore"; 
import { Plus } from "lucide-react"; 

// Componentes
import HealthScore from "../components/dashboard/HealthScore";
import MonthSummary from "../components/dashboard/MonthSummary";
import FinancialRiver from "../components/dashboard/FinancialRiver";
import TopCategories from "../components/dashboard/TopCategories";
import Insights from "../components/dashboard/Insights";
import SmallExpenses from "../components/dashboard/SmallExpenses";
import ProactiveAssistant from "../components/dashboard/ProactiveAssistant";
import PsychologyDashboard from "../components/dashboard/PsychologyDashboard";
import StatCards from "../components/dashboard/StatCards";
import QuickAddModal from "../components/expenses/QuickAddModal"; 

const Dashboard = () => {
  const { expenses, subscribeExpenses } = useExpenseStore();
  // ✅ Añadido incomeSources y subscribeIncome para HealthScore
  const { budgets, subscribeBudgets, subscribeIncome } = useBudgetStore();
  const { user } = useAuthStore();
  const { subscribeCategories } = useCategoryStore();
  
  const { openQuickAddModal } = useUIStore(); 

  useEffect(() => {
    if (user?.uid) {
      const unsubExp = subscribeExpenses(user.uid);
      const unsubBud = subscribeBudgets(user.uid);
      // ✅ Suscripción vital para HealthScore
      const unsubInc = subscribeIncome(user.uid);
      const unsubCat = subscribeCategories(user.uid);
      
      return () => {
        if (unsubExp) unsubExp();
        if (unsubBud) unsubBud();
        if (unsubInc) unsubInc(); // Cleanup
        if (unsubCat) unsubCat();
      };
    }
  }, [user?.uid]);

  const dashboardData = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const normalizeDate = (date) => (date?.toDate ? date.toDate() : new Date(date));

    // Cálculos
    const allExpenses = expenses.map(e => ({ ...e, date: normalizeDate(e.date) }));
    const todayExpenses = allExpenses.filter(e => e.date.toDateString() === todayStr);
    const monthExpenses = allExpenses.filter(e => e.date.getMonth() === currentMonth && e.date.getFullYear() === currentYear);
    
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthExpenses = allExpenses.filter(e => e.date.getMonth() === lastMonth && e.date.getFullYear() === lastYear);

    const totalToday = todayExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalMonth = monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const lastMonthSpent = lastMonthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalGlobal = allExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    
    const recurringExpenses = allExpenses.filter(e => e.isRecurring === true);
    const totalRecurring = recurringExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    
    // Total de límites configurados (opcional, pero útil para MonthSummary)
    const totalBudget = budgets.reduce((sum, b) => sum + (b.isActive ? Number(b.amount || 0) : 0), 0);

    return {
      totalToday, todayExpenses,
      totalMonth, monthExpenses,
      totalGlobal, allExpenses,
      totalRecurring, recurringExpenses,
      lastMonthSpent, lastMonthExpenses,
      totalBudget
    };
  }, [expenses, budgets]);

  return (
    <div className="space-y-6 pb-32 px-2 sm:px-0 max-w-5xl mx-auto overflow-x-hidden relative animate-in fade-in duration-500">
      <header className="pt-6 px-1">
        <h1 className="text-4xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter leading-none">
          Hola, <span className="text-indigo-600 dark:text-indigo-400">{user?.displayName?.split(" ")[0]}</span>
        </h1>
        <p className="text-[10px] font-black text-secondary-500 uppercase tracking-[0.3em] mt-2 ml-1">Inteligencia Financiera</p>
      </header>

      <ProactiveAssistant spent={dashboardData.totalMonth} budget={dashboardData.totalBudget} />
      
      <StatCards data={dashboardData} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 h-full">
          {/* ✅ HealthScore ahora es inteligente y calcula sus propios datos */}
          <HealthScore />
        </div>
        <div className="md:col-span-8 h-full">
          <MonthSummary spent={dashboardData.totalMonth} budget={dashboardData.totalBudget} lastMonthSpent={dashboardData.lastMonthSpent} />
        </div>
      </div>

      <Insights currentExpenses={dashboardData.monthExpenses} lastExpenses={dashboardData.lastMonthExpenses} budget={dashboardData.totalBudget} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8">
          <FinancialRiver expenses={dashboardData.allExpenses} />
        </div>
        <div className="md:col-span-4">
          <SmallExpenses expenses={dashboardData.monthExpenses} />
        </div>
      </div>

      <TopCategories currentExpenses={dashboardData.monthExpenses} />
      <PsychologyDashboard expenses={expenses} />

      {/* ✅ BOTÓN "LIQUID GOLD" FLOTANTE */}
      <button
        onClick={openQuickAddModal}
        className="fixed z-[100] bottom-24 right-4 lg:bottom-10 lg:right-10 
          w-16 h-16 
          bg-[#FFD700] hover:bg-[#ffc800] 
          text-[#1e1b4b] 
          rounded-full 
          shadow-[0_10px_40px_-10px_rgba(255,215,0,0.5)]
          border-4 border-white/20 backdrop-blur-md
          flex items-center justify-center 
          transition-all duration-300
          hover:scale-110 active:scale-95
          animate-in zoom-in duration-300"
        aria-label="Agregar Gasto"
      >
        <Plus size={36} strokeWidth={3} />
      </button>

      {/* MODAL GLOBAL */}
      <QuickAddModal />
    </div>
  );
};

export default Dashboard;