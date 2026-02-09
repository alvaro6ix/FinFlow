import React, { useState, useMemo, useEffect } from 'react';
import { useBudgetStore } from '../stores/budgetStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';
import { SYSTEM_CATEGORIES } from '../constants/categories';
import IncomeManager from '../components/budgets/IncomeManager';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetAlerts from '../components/budgets/BudgetAlerts';
import Modal from '../components/common/Modal';
import { Plus, Target, Sparkles, Bell, TrendingUp } from 'lucide-react';

import { 
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Wallet, Landmark, Receipt, PiggyBank, Star, Zap, HelpCircle
} from 'lucide-react';

const ICON_LOOKUP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle
};

const Budgets = () => {
  const { 
    budgets, 
    subscribeBudgets, 
    subscribeIncome,
    subscribeAlerts,
    calculateTotalIncome, 
    calculateSmartBudget,
    calculateSpentInPeriod,
    createBudget,
    updateBudget,
    deleteBudget,
    createAlert,
    getUnreadAlerts
  } = useBudgetStore();
  
  const { expenses, subscribeExpenses } = useExpenseStore();
  const { user } = useAuthStore();
  const { customCategories, subscribeCategories } = useCategoryStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alertsProcessed, setAlertsProcessed] = useState(new Set());

  useEffect(() => {
    if (user) {
      subscribeBudgets(user.uid);
      subscribeIncome(user.uid);
      subscribeExpenses(user.uid);
      subscribeCategories(user.uid);
      subscribeAlerts(user.uid);
    }
  }, [user]);

  const allCategories = useMemo(() => {
    const customWithFlag = customCategories.map(c => ({ ...c, isCustom: true }));
    return [...SYSTEM_CATEGORIES, ...customWithFlag];
  }, [customCategories]);

  const totalIncome = calculateTotalIncome();
  const smartTips = calculateSmartBudget(totalIncome);
  const unreadAlerts = getUnreadAlerts();

  const budgetsWithSpent = useMemo(() => {
    return budgets.map(budget => {
      const spent = calculateSpentInPeriod(
        budget.categoryId,
        budget.period,
        budget.startDate?.seconds ? new Date(budget.startDate.seconds * 1000) : new Date(budget.startDate),
        expenses
      );

      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      const alertKey = `${budget.id}-${Math.floor(percentage / 10)}`;

      // Crear alertas SOLO si no se han procesado antes
      if (user && budget.isActive && !alertsProcessed.has(alertKey)) {
        if (percentage >= budget.alertThreshold && percentage < 100) {
          createAlert(
            user.uid,
            budget.id,
            'threshold',
            `${budget.categoryLabel}: Has alcanzado el ${budget.alertThreshold}% de tu presupuesto`,
            percentage,
            budget.categoryLabel
          );
          setAlertsProcessed(prev => new Set([...prev, alertKey]));
        }
        
        if (percentage >= 100) {
          createAlert(
            user.uid,
            budget.id,
            'exceeded',
            `${budget.categoryLabel}: Has excedido tu presupuesto`,
            percentage,
            budget.categoryLabel
          );
          setAlertsProcessed(prev => new Set([...prev, alertKey]));
        }
      }

      return { 
        ...budget, 
        spent,
        percentage
      };
    });
  }, [budgets, expenses, user, calculateSpentInPeriod, createAlert, alertsProcessed]);

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

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('¿Estás seguro de eliminar este presupuesto?')) {
      await deleteBudget(budgetId);
    }
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-secondary-900 dark:text-white italic uppercase tracking-tighter">
            Presupuestos
          </h2>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            Gestiona tus límites de gasto
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Bell size={16} />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadAlerts.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}
            className="bg-[#FFD700] text-[#1e1b4b] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Plus size={16} />
            Nuevo
          </button>
        </div>
      </div>

      {/* Alertas */}
      {showAlerts && (
        <div className="animate-in slide-in-from-top-4">
          <BudgetAlerts showInDashboard={false} />
        </div>
      )}

      {!showAlerts && <BudgetAlerts showInDashboard={true} />}

      <IncomeManager />

      {/* Sugerencias 50/30/20 */}
      {totalIncome > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-500 rounded-xl">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-secondary-900 dark:text-white">
                Sugerencias Inteligentes
              </h3>
              <p className="text-xs text-secondary-600 dark:text-secondary-400">
                Basado en el método 50/30/20
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-2xl border-l-4 border-emerald-500 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-secondary-400 dark:text-secondary-500 tracking-wider">
                  Necesidades (50%)
                </span>
              </div>
              <p className="text-2xl font-black text-secondary-900 dark:text-white">
                ${smartTips.needs.toLocaleString()}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Comida, vivienda, transporte
              </p>
            </div>

            <div className="bg-white dark:bg-secondary-800 p-4 rounded-2xl border-l-4 border-indigo-500 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-indigo-500" />
                <span className="text-[10px] font-black uppercase text-secondary-400 dark:text-secondary-500 tracking-wider">
                  Deseos (30%)
                </span>
              </div>
              <p className="text-2xl font-black text-secondary-900 dark:text-white">
                ${smartTips.wants.toLocaleString()}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Entretenimiento, ocio
              </p>
            </div>

            <div className="bg-white dark:bg-secondary-800 p-4 rounded-2xl border-l-4 border-amber-500 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase text-secondary-400 dark:text-secondary-500 tracking-wider">
                  Ahorro (20%)
                </span>
              </div>
              <p className="text-2xl font-black text-secondary-900 dark:text-white">
                ${smartTips.savings.toLocaleString()}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Emergencias, inversiones
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {budgetsWithSpent.length > 0 ? (
        <div>
          <h3 className="text-lg font-black text-secondary-900 dark:text-white mb-4">
            Mis Presupuestos ({budgetsWithSpent.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetsWithSpent.map(budget => {
              const cat = allCategories.find(c => c.id === budget.categoryId);
              let IconComponent = cat?.icon;
              
              if (cat?.isCustom && cat?.iconName && ICON_LOOKUP[cat.iconName]) {
                IconComponent = ICON_LOOKUP[cat.iconName];
              }

              return (
                <BudgetCard 
                  key={budget.id} 
                  budget={budget} 
                  categoryIcon={IconComponent}
                  categoryColor={cat?.color}
                  onEdit={() => handleEdit(budget)}
                  onDelete={() => handleDelete(budget.id)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary-50/50 dark:bg-secondary-900/50 rounded-3xl border-2 border-dashed border-secondary-200 dark:border-secondary-800">
          <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target size={40} className="text-secondary-400" />
          </div>
          <h3 className="text-xl font-black text-secondary-900 dark:text-white mb-2">
            No hay presupuestos
          </h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">
            Crea tu primer presupuesto
          </p>
          <button 
            onClick={() => { setEditingBudget(null); setIsModalOpen(true); }}
            className="bg-[#FFD700] text-[#1e1b4b] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Crear Presupuesto
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-black text-secondary-900 dark:text-white mb-6">
            {editingBudget ? 'Editar' : 'Nuevo Presupuesto'}
          </h2>
          <BudgetForm 
            onSubmit={editingBudget ? handleUpdate : handleCreate}
            initialData={editingBudget}
            allCategories={allCategories}
            onCancel={() => setIsModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Budgets;