import React, { useState, useMemo, useEffect } from 'react';
import { useBudgetStore } from '../stores/budgetStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';
import { SYSTEM_CATEGORIES } from '../constants/categories';
import { parseDate } from '../utils/dateHelpers'; 

import IncomeManager from '../components/budgets/IncomeManager';
import BudgetStrategy from '../components/budgets/BudgetStrategy';
import BudgetDetailTable from '../components/budgets/BudgetDetailTable';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetAlerts from '../components/budgets/BudgetAlerts';
import Modal from '../components/common/Modal';
import { Plus, Bell, X, LayoutDashboard, Wallet, Trophy, TrendingDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// ✅ MAPA DE SEGURIDAD PARA ICONOS
// Asegura que los nombres de texto se conviertan en componentes reales
const SAFE_ICON_MAP = {
  ...LucideIcons,
  // Mapeos comunes si el nombre difiere ligeramente
  'Utensils': LucideIcons.Utensils,
  'Car': LucideIcons.Car,
  'Home': LucideIcons.Home,
  'ShoppingBag': LucideIcons.ShoppingBag,
  'Heart': LucideIcons.Heart,
  'GraduationCap': LucideIcons.GraduationCap,
  'Film': LucideIcons.Film,
  'Gamepad2': LucideIcons.Gamepad2,
  'Plane': LucideIcons.Plane,
  'Gift': LucideIcons.Gift,
  'Briefcase': LucideIcons.Briefcase,
  'MoreHorizontal': LucideIcons.MoreHorizontal,
};

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

  // ✅ HELPER DE ICONOS MEJORADO
  const getCategoryIcon = (catId) => {
    const cat = allCategories.find(c => c.id === catId);
    if (!cat) return null;
    
    // 1. Si es un componente directo (ej: Categorías del Sistema importadas)
    if (typeof cat.icon === 'function' || typeof cat.icon === 'object') return cat.icon;
    
    // 2. Si es un string (ej: "Utensils")
    const iconName = cat.iconName || (typeof cat.icon === 'string' ? cat.icon : null);
    if (iconName && SAFE_ICON_MAP[iconName]) return SAFE_ICON_MAP[iconName];
    
    return LucideIcons.Tag; // Fallback
  };

  // ✅ HELPER DE FECHAS (Sin UTC Shift)
  const getLocalDate = (dateInput) => {
    const d = parseDate(dateInput);
    if (isNaN(d.getTime())) return new Date();
    // Si es medianoche UTC exacta, ajustar a local
    if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) {
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }
    return d;
  };

  const strategyExpenses = useMemo(() => {
    return expenses.filter(e => {
      const d = parseDate(e.date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return monthKey === strategyMonth;
    });
  }, [expenses, strategyMonth]);

  const incomeAnalysis = useMemo(() => {
    if (!incomeSources.length) return null;
    const byMonth = {};
    incomeSources.forEach(inc => {
      if (!inc.date && inc.type !== 'fixed') return;
      if (inc.type === 'fixed') return; 
      const d = parseDate(inc.date);
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

  // 🔥 CÁLCULO DE LÍMITES (SOLUCIÓN DEFINITIVA DE FECHAS)
  const budgetsWithSpent = useMemo(() => {
    return budgets.map(budget => {
      const now = new Date(); 
      now.setHours(0, 0, 0, 0);

      // 1. Definir Fechas Originales
      let startDate = getLocalDate(budget.startDate);
      let endDate = null;
      let isExpired = false;
      
      if (budget.endDate) {
        endDate = getLocalDate(budget.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        // Verificamos si expiró (Ayer o antes)
        if (endDate < now) {
          isExpired = true;
        }
      }

      let cycleStart, cycleEnd;

      // 🔥 LÓGICA BIFURCADA: HISTÓRICO VS RECURRENTE
      if (isExpired) {
        // CASO 1: PRESUPUESTO VENCIDO (HISTÓRICO)
        // Usamos estrictamente las fechas originales.
        // Si era del 1 Ene al 1 Feb, se queda ahí. No se mueve a hoy.
        cycleStart = new Date(startDate);
        cycleEnd = new Date(endDate);
      } else {
        // CASO 2: PRESUPUESTO ACTIVO (RECURRENTE/VIVO)
        // Calculamos el ciclo actual basado en HOY.
        
        // Componentes base
        const startDay = startDate.getDate();
        cycleStart = new Date(now);
        cycleEnd = new Date(now);

        if (budget.period === 'monthly') {
          cycleStart = new Date(now.getFullYear(), now.getMonth(), startDay);
          // Si hoy es 11 y empieza el 15, estamos en el ciclo que empezó el mes pasado
          if (now.getDate() < startDay) {
            cycleStart.setMonth(cycleStart.getMonth() - 1);
          }
          cycleEnd = new Date(cycleStart);
          cycleEnd.setMonth(cycleEnd.getMonth() + 1);
        } else if (budget.period === 'weekly') {
          const diff = now.getDay() - startDate.getDay();
          const adjDiff = diff < 0 ? diff + 7 : diff;
          cycleStart.setDate(now.getDate() - adjDiff);
          cycleEnd = new Date(cycleStart);
          cycleEnd.setDate(cycleEnd.getDate() + 7);
        } else if (budget.period === 'biweekly') {
          const d = now.getDate();
          if (d <= 15) {
              cycleStart = new Date(now.getFullYear(), now.getMonth(), 1);
              cycleEnd = new Date(now.getFullYear(), now.getMonth(), 16);
          } else {
              cycleStart = new Date(now.getFullYear(), now.getMonth(), 16);
              cycleEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          }
        } else {
          // Anual / Diario / Otros -> Usar fechas originales si no hay lógica de repetición compleja
          cycleStart = new Date(startDate);
          cycleEnd = endDate ? new Date(endDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        }
      }

      // Normalizar horas para comparación precisa
      cycleStart.setHours(0, 0, 0, 0);
      cycleEnd.setHours(0, 0, 0, 0);

      // 3. Filtrado de Gastos
      const budgetExpenses = expenses.filter(expense => {
        if (expense.categoryId !== budget.categoryId) return false;
        
        if (budget.subcategoryId) {
           const isGeneric = ['all', 'general', ''].includes(budget.subcategoryId.toLowerCase());
           if (!isGeneric && (!expense.subcategoryId || expense.subcategoryId !== budget.subcategoryId)) return false; 
        }

        const expenseDate = parseDate(expense.date);
        expenseDate.setHours(0,0,0,0);
        
        // Rango: [Inclusive Inicio, Exclusivo Fin)
        // Ejemplo: 1 Ene 00:00 <= Gasto < 1 Feb 00:00 (Incluye todo Enero)
        return expenseDate >= cycleStart && expenseDate < cycleEnd;
      });

      const calculatedSpent = budgetExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
      
      let daysLeft = 0;
      if (!isExpired) {
        const diffTime = cycleEnd.getTime() - now.getTime();
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) daysLeft = 0;
      }

      // Estado activo visual
      const isActiveState = budget.isActive !== undefined ? budget.isActive : true;

      return { 
        ...budget, 
        spent: calculatedSpent, 
        daysLeft,
        isActive: isActiveState, // Mantiene el estado de DB
        isExpired, 
        cycleLabel: `${cycleStart.toLocaleDateString('es-MX', {day:'numeric', month:'short'})} - ${cycleEnd.toLocaleDateString('es-MX', {day:'numeric', month:'short'})}`
      };
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
      
      {/* HEADER */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-secondary-900 dark:text-white italic uppercase tracking-tighter">
            Gestión Financiera
          </h2>
          {activeTab === 'limits' && (
            <div className="flex items-center gap-3">
              <button onClick={() => setShowAlerts(!showAlerts)} className={`p-3 rounded-xl transition-all relative shadow-sm hover:scale-105 ${showAlerts ? 'bg-[#FFD700] text-[#1e1b4b]' : 'bg-white dark:bg-secondary-800 text-secondary-400'}`}>
                <Bell size={20} />
                {hasUnreadAlerts && !showAlerts && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-secondary-900" />}
              </button>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="p-1 bg-secondary-100 dark:bg-secondary-900/50 rounded-2xl flex relative overflow-hidden w-full sm:w-fit mx-auto sm:mx-0">
          <button onClick={() => setActiveTab('limits')} className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'limits' ? 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white shadow-sm' : 'text-secondary-400 hover:text-secondary-600'}`}>
            <LayoutDashboard size={14} /> Límites
          </button>
          <button onClick={() => setActiveTab('strategy')} className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'strategy' ? 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white shadow-sm' : 'text-secondary-400 hover:text-secondary-600'}`}>
            <Wallet size={14} /> Planeación
          </button>
        </div>
      </div>

      {activeTab === 'limits' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          
          {/* LEYENDA */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white/50 dark:bg-black/20 rounded-2xl border border-secondary-200 dark:border-white/5">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[9px] font-bold text-secondary-500 dark:text-secondary-400 uppercase">Saludable</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-[9px] font-bold text-secondary-500 dark:text-secondary-400 uppercase">Alerta</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[9px] font-bold text-secondary-500 dark:text-secondary-400 uppercase">Excedido</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-secondary-300 dark:bg-secondary-600"></div><span className="text-[9px] font-bold text-secondary-500 dark:text-secondary-400 uppercase">Pausado/Vencido</span></div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => { setEditingBudget(null); setIsModalOpen(true); }} className="bg-[#FFD700] text-[#1e1b4b] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
              <Plus size={16} /> Nuevo Límite
            </button>
          </div>

          {showAlerts && (
            <div className="bg-white dark:bg-secondary-900 rounded-3xl p-4 shadow-xl border border-secondary-100 dark:border-secondary-800 animate-in slide-in-from-top-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase text-secondary-400 tracking-widest">Notificaciones</span>
                <button onClick={() => setShowAlerts(false)} className="text-secondary-400 hover:text-red-500"><X size={16} /></button>
              </div>
              <BudgetAlerts alerts={alerts || []} onRead={markAlertAsRead} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetsWithSpent.map(budget => {
              const IconComponent = getCategoryIcon(budget.categoryId);
              
              // Buscar color de categoría
              const cat = allCategories.find(c => c.id === budget.categoryId);
              
              return (
                <BudgetCard 
                  key={budget.id} 
                  budget={budget} 
                  categoryIcon={IconComponent} 
                  categoryColor={cat?.color || '#6366f1'}
                  onEdit={() => { setEditingBudget(budget); setIsModalOpen(true); }}
                  onDelete={() => deleteBudget(budget.id)}
                  // ✅ CONEXIÓN CORRECTA DEL TOGGLE
                  onToggle={(id, status) => updateBudget(id, { isActive: status })} 
                />
              );
            })}
          </div>
          {budgetsWithSpent.length === 0 && <div className="text-center py-20 opacity-40"><p className="text-sm font-bold">No hay límites configurados.</p></div>}
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
          {incomeAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Resumen de ingresos se mantiene igual */}
            </div>
          )}
          <div className="border-t border-secondary-200 dark:border-white/5 my-4" />
          <IncomeManager />
          <BudgetStrategy allIncome={incomeSources} allExpenses={expenses} selectedMonth={strategyMonth} onMonthChange={setStrategyMonth} />
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