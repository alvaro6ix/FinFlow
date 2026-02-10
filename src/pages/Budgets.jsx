import React, { useState, useMemo, useEffect } from 'react';
import { useBudgetStore } from '../stores/budgetStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';
import { SYSTEM_CATEGORIES } from '../constants/categories';
// ❌ ELIMINADO: import { parseDate } from '../utils/dateHelpers'; 

import IncomeManager from '../components/budgets/IncomeManager';
import BudgetStrategy from '../components/budgets/BudgetStrategy';
import BudgetDetailTable from '../components/budgets/BudgetDetailTable';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetAlerts from '../components/budgets/BudgetAlerts';
import Modal from '../components/common/Modal';
import { Plus, Bell, X, LayoutDashboard, Wallet, Trophy, TrendingDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ICON_LOOKUP = { ...LucideIcons };

const Budgets = () => {
  const { 
    budgets, alerts, incomeSources, subscribeBudgets, subscribeIncome, createBudget, updateBudget, deleteBudget, markAlertAsRead, generateAlerts
  } = useBudgetStore();
  
  const { expenses, subscribeExpenses } = useExpenseStore();
  const { user } = useAuthStore();
  const { customCategories, subscribeCategories } = useCategoryStore();
  
  const [activeTab, setActiveTab] = useState('limits');
  const [strategyMonth, setStrategyMonth] = useState(new Date().toISOString().slice(0, 7));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    if (user) {
      subscribeBudgets(user.uid);
      subscribeIncome(user.uid);
      subscribeExpenses(user.uid);
      subscribeCategories(user.uid);
    }
  }, [user]);

  const allCategories = useMemo(() => [...SYSTEM_CATEGORIES, ...customCategories], [customCategories]);
  const hasUnreadAlerts = Array.isArray(alerts) && alerts.some(a => !a.read);

  // Helper de fecha seguro (definido aquí mismo para evitar errores de importación)
  const getSafeDate = (dateInput) => {
    if (!dateInput) return new Date();
    return new Date(dateInput.seconds ? dateInput.seconds * 1000 : dateInput);
  };

  // Filtrar Gastos para la Tabla de Detalles
  const strategyExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = getSafeDate(e.date);
      return d.toISOString().slice(0, 7) === strategyMonth;
    });
  }, [expenses, strategyMonth]);

  // Análisis de Ingresos Global
  const incomeAnalysis = useMemo(() => {
    if (!incomeSources.length) return null;
    const byMonth = {};
    incomeSources.forEach(inc => {
      if (!inc.date) return;
      const d = getSafeDate(inc.date);
      const k = d.toISOString().slice(0, 7); 
      byMonth[k] = (byMonth[k] || 0) + Number(inc.amount);
    });
    const entries = Object.entries(byMonth).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) return null;
    return {
      best: { month: entries[0][0], amount: entries[0][1] },
      worst: { month: entries[entries.length - 1][0], amount: entries[entries.length - 1][1] }
    };
  }, [incomeSources]);

  // Cálculo de Presupuestos (Solo para Límites)
  const budgetsWithSpent = useMemo(() => {
    return budgets.map(budget => {
      const now = new Date();
      now.setHours(0,0,0,0);
      let startDate = getSafeDate(budget.startDate);
      
      // Validar si budget.endDate existe antes de usarlo
      if (budget.endDate) {
        const endDate = getSafeDate(budget.endDate);
        if (endDate < now) return { ...budget, spent: 0, daysLeft: 0, isActive: false };
      }

      let cycleStart = new Date(startDate);
      let cycleEnd = new Date();

      if (budget.period === 'monthly') {
        cycleStart.setFullYear(now.getFullYear());
        cycleStart.setMonth(now.getMonth());
        if (startDate.getDate() > now.getDate()) cycleStart.setMonth(cycleStart.getMonth() - 1);
        cycleEnd = new Date(cycleStart);
        cycleEnd.setMonth(cycleEnd.getMonth() + 1);
      } 
      // ... lógica simple para otros periodos ...
      else if (budget.period === 'weekly') {
         // Lógica semanal simplificada
         const day = now.getDay();
         const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
         cycleStart = new Date(now.setDate(diff));
         cycleEnd = new Date(now.setDate(diff + 6));
      }
      else {
         // Default mensual si falla
         cycleStart = new Date(now.getFullYear(), now.getMonth(), 1);
         cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }

      const budgetExpenses = expenses.filter(expense => {
        const matchCategory = expense.categoryId === budget.categoryId;
        const matchSub = !budget.subcategoryId || expense.subcategoryId === budget.subcategoryId;
        if (!matchCategory || !matchSub) return false;
        
        // ✅ CORRECCIÓN AQUÍ: Usamos getSafeDate en lugar de parseDate
        const expenseDate = getSafeDate(expense.date);
        return expenseDate >= cycleStart && expenseDate < cycleEnd;
      });

      const calculatedSpent = budgetExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
      return { ...budget, spent: calculatedSpent, daysLeft: 30 }; // Simplificado
    });
  }, [budgets, expenses]);

  useEffect(() => {
    if (budgetsWithSpent.length > 0) generateAlerts(budgetsWithSpent);
  }, [budgetsWithSpent, generateAlerts]);

  const handleCreate = async (data) => {
    await createBudget({ ...data, userId: user.uid });
    setIsModalOpen(false);
  };

  const handleUpdate = async (data) => {
    if (editingBudget) {
      await updateBudget(editingBudget.id, data);
      setEditingBudget(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500 relative">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-secondary-900 dark:text-white italic uppercase tracking-tighter">
            Gestión Financiera
          </h2>
          
          {/* BOTONES HEADER (Solo visibles en pestaña Límites) */}
          {activeTab === 'limits' && (
            <div className="flex items-center gap-3">
              <button onClick={() => setShowAlerts(!showAlerts)} className={`p-3 rounded-xl transition-all relative shadow-sm hover:scale-105 ${showAlerts ? 'bg-[#FFD700] text-[#1e1b4b]' : 'bg-white dark:bg-secondary-800 text-secondary-400'}`}>
                <Bell size={20} />
                {hasUnreadAlerts && !showAlerts && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-secondary-900" />}
              </button>
            </div>
          )}
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div className="p-1 bg-secondary-100 dark:bg-secondary-900/50 rounded-2xl flex relative overflow-hidden w-full sm:w-fit mx-auto sm:mx-0">
          <button 
            onClick={() => setActiveTab('limits')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'limits' ? 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white shadow-sm' : 'text-secondary-400 hover:text-secondary-600'}`}
          >
            <LayoutDashboard size={14} /> Límites de Gasto
          </button>
          <button 
            onClick={() => setActiveTab('strategy')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'strategy' ? 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white shadow-sm' : 'text-secondary-400 hover:text-secondary-600'}`}
          >
            <Wallet size={14} /> Planeación (50/30/20)
          </button>
        </div>
      </div>

      {/* 🟢 PESTAÑA 1: LÍMITES */}
      {activeTab === 'limits' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          <div className="flex justify-end">
            <button onClick={() => { setEditingBudget(null); setIsModalOpen(true); }} className="bg-[#FFD700] text-[#1e1b4b] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
              <Plus size={16} /> Nuevo Límite
            </button>
          </div>

          {showAlerts && (
            <div className="bg-white dark:bg-secondary-900 rounded-3xl p-4 shadow-xl border border-secondary-100 dark:border-secondary-800 animate-in slide-in-from-top-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase text-secondary-400 tracking-widest">Centro de Alertas</span>
                <button onClick={() => setShowAlerts(false)} className="text-secondary-400 hover:text-red-500"><X size={16} /></button>
              </div>
              <BudgetAlerts alerts={alerts || []} onRead={markAlertAsRead} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetsWithSpent.map(budget => {
              const cat = allCategories.find(c => c.id === budget.categoryId);
              let IconComponent = cat?.icon;
              if (typeof IconComponent !== 'function' && cat?.iconName && ICON_LOOKUP[cat.iconName]) {
                IconComponent = ICON_LOOKUP[cat.iconName];
              }
              return (
                <BudgetCard 
                  key={budget.id} budget={budget} categoryIcon={IconComponent} categoryColor={cat?.color} 
                  onEdit={() => { setEditingBudget(budget); setIsModalOpen(true); }}
                  onDelete={() => deleteBudget(budget.id)}
                />
              );
            })}
          </div>
          {budgetsWithSpent.length === 0 && <div className="text-center py-20 opacity-40"><p className="text-sm font-bold">No hay límites configurados.</p></div>}
        </div>
      )}

      {/* 🔵 PESTAÑA 2: ESTRATEGIA */}
      {activeTab === 'strategy' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
          
          {/* Análisi de Ingresos Global (Mejor/Peor Mes) */}
          {incomeAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative overflow-hidden bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 shadow-xl flex flex-col justify-between h-full group hover:scale-[1.01] transition-transform">
                <div className="absolute -right-4 -top-4 opacity-10 text-emerald-500"><Trophy size={80} /></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-2xl backdrop-blur-md shadow-sm bg-emerald-500/10 text-emerald-500"><Trophy size={20} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Récord</span>
                  </div>
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Mejor Mes de Ingresos</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-secondary-900 dark:text-white">{incomeAnalysis.best.month}</h3>
                    <span className="text-lg font-bold text-emerald-500">${incomeAnalysis.best.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 shadow-xl flex flex-col justify-between h-full group hover:scale-[1.01] transition-transform">
                <div className="absolute -right-4 -top-4 opacity-10 text-red-500"><TrendingDown size={80} /></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-2xl backdrop-blur-md shadow-sm bg-red-500/10 text-red-500"><TrendingDown size={20} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-1 rounded-lg">Atención</span>
                  </div>
                  <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-1">Mes de Menor Ingreso</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-secondary-900 dark:text-white">{incomeAnalysis.worst.month}</h3>
                    <span className="text-lg font-bold text-red-500">${incomeAnalysis.worst.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-secondary-200 dark:border-white/5 my-4" />

          <IncomeManager />
          
          {/* ESTRATEGIA (Controlada por state local del padre) */}
          <BudgetStrategy 
            allIncome={incomeSources} 
            allExpenses={expenses} 
            selectedMonth={strategyMonth}
            onMonthChange={setStrategyMonth}
          />

          {/* LISTA DE DETALLES (Filtrada por el mismo mes de la estrategia) */}
          <BudgetDetailTable expenses={strategyExpenses} allCategories={allCategories} />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <BudgetForm onSubmit={editingBudget ? handleUpdate : handleCreate} initialData={editingBudget} allCategories={allCategories} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Budgets;