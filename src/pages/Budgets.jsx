import React, { useState, useMemo } from 'react';
import { useBudgetStore } from '../stores/budgetStore';
import { useExpenseStore } from '../stores/expenseStore';
import { useCategoryStore } from '../stores/categoryStore';
import { SYSTEM_CATEGORIES } from '../constants/categories';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetCard from '../components/budgets/BudgetCard';
import { Plus, Target } from 'lucide-react';

const Budgets = () => {
  const store = useBudgetStore(); 
  const { expenses } = useExpenseStore();
  const { customCategories } = useCategoryStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const allCategories = useMemo(() => [...SYSTEM_CATEGORIES, ...customCategories], [customCategories]);

  // Blindaje de cálculos
  const totalBudgeted = store.budgets?.reduce((sum, b) => sum + (Number(b.amount) || 0), 0) || 0;
  
  // Verificamos que la función exista antes de usarla para evitar el error "a is not a function"
  const smartTips = typeof store.calculateSmartBudget === 'function' 
    ? store.calculateSmartBudget(totalBudgeted) 
    : { needs: 0, wants: 0, savings: 0 };

  const handleOpenEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  return (
    <div className="space-y-6 pb-32 max-w-5xl mx-auto px-4">
      <header className="flex justify-between items-end pt-8">
        <div>
          <h1 className="text-4xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter leading-none">Límites</h1>
          <p className="text-[10px] font-black text-secondary-500 uppercase tracking-widest mt-1 ml-1 leading-none">Presupuestos Reales</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </header>

      {/* 5.4 Guía Inteligente 50/30/20 */}
      {totalBudgeted > 0 && (
        <Card className="bg-indigo-600 border-none text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <Target className="absolute -right-4 -top-4 opacity-10" size={160} />
          <div className="relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 text-indigo-100 opacity-80 text-center sm:text-left">Distribución Ideal de tus Límites</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[8px] font-bold uppercase opacity-60 mb-1">Necesidades (50%)</p>
                <p className="text-xl font-black">${(smartTips.needs || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold uppercase opacity-60 mb-1">Deseos (30%)</p>
                <p className="text-xl font-black">${(smartTips.wants || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold uppercase opacity-60 mb-1">Ahorro (20%)</p>
                <p className="text-xl font-black">${(smartTips.savings || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 5.2 Lista de Cards Responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {store.budgets.map((budget) => {
          const cat = allCategories.find(c => c.id === budget.categoryId);
          return (
            <BudgetCard 
              key={budget.id} 
              budget={budget} 
              categoryIcon={cat?.icon || '💰'}
              onEdit={() => handleOpenEdit(budget)}
              onDelete={() => store.deleteBudget(budget.id)}
            />
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose} title={editingBudget ? "Editar Límite" : "Nuevo Límite"}>
        <BudgetForm 
          onSubmit={async (data) => {
            if (editingBudget) {
              await store.updateBudget(editingBudget.id, data);
            } else {
              await store.createBudget(data);
            }
            handleClose();
          }} 
          onCancel={handleClose} 
          editBudget={editingBudget} 
        />
      </Modal>
    </div>
  );
};

export default Budgets;