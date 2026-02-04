import { useMemo, useEffect } from "react";
import { useExpenseStore } from "../stores/expenseStore";
import { useBudgetStore } from "../stores/budgetStore";
import { useAuthStore } from "../stores/authStore";
import { useUIStore } from "../stores/uiStore";
import { useCategoryStore } from "../stores/categoryStore"; // ✅ Importado

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

// Common
import FloatingActionButton from "../components/common/FloatingActionButton";
import QuickAddModal from "../components/expenses/QuickAddModal";

const Dashboard = () => {
  const { expenses, subscribeExpenses } = useExpenseStore();
  const { budgets, subscribeBudgets } = useBudgetStore();
  const { user } = useAuthStore();
  const { openQuickAddModal } = useUIStore();
  const { subscribeCategories } = useCategoryStore(); // ✅ Traer suscripción

  useEffect(() => {
    if (user?.uid) {
      const unsubExp = subscribeExpenses(user.uid);
      const unsubBud = subscribeBudgets(user.uid);
      const unsubCat = subscribeCategories(user.uid); // ✅ Suscripción activa
      return () => {
        if (unsubExp) unsubExp();
        if (unsubBud) unsubBud();
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

    const todayExpenses = expenses.filter(e => normalizeDate(e.date).toDateString() === todayStr);
    const totalToday = todayExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const monthExpenses = expenses.filter(e => {
      const d = normalizeDate(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const totalMonth = monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const lastMonthExpenses = expenses.filter(e => {
      const d = normalizeDate(e.date);
      const lastM = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastY = currentMonth === 0 ? currentYear - 1 : currentYear;
      return d.getMonth() === lastM && d.getFullYear() === lastY;
    });
    const lastMonthSpent = lastMonthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const totalGlobal = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const recurringExpenses = expenses.filter(e => e.isRecurring === true);
    const totalRecurring = recurringExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount || 0), 0);

    return {
      totalToday, todayExpenses,
      totalMonth, monthExpenses,
      totalGlobal, allExpenses: expenses,
      totalRecurring, recurringExpenses,
      lastMonthSpent, lastMonthExpenses,
      totalBudget
    };
  }, [expenses, budgets]);

  return (
    <div className="space-y-6 pb-32 px-2 sm:px-0 max-w-5xl mx-auto overflow-x-hidden">
      <header className="pt-6 px-1">
        <h1 className="text-4xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter leading-none">
          Hola, <span className="text-indigo-600">{user?.displayName?.split(" ")[0]}</span>
        </h1>
        <p className="text-[10px] font-black text-secondary-500 uppercase tracking-[0.3em] mt-2 ml-1">Inteligencia Financiera</p>
      </header>

      <ProactiveAssistant spent={dashboardData.totalMonth} budget={dashboardData.totalBudget} />
      <StatCards data={dashboardData} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <HealthScore spent={dashboardData.totalMonth} budget={dashboardData.totalBudget} />
        </div>
        <div className="md:col-span-8">
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

      <FloatingActionButton onClick={openQuickAddModal} />
      <QuickAddModal />
    </div>
  );
};

export default Dashboard;