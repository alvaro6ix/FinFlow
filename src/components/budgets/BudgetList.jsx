import React, { useState } from 'react';
import { useBudgetStore } from '../../stores/budgetStore';
import BudgetCard from './BudgetCard';
import BudgetForm from './BudgetForm';
import { PlusCircle } from 'lucide-react';
// Importa tus iconos para pasarlos a la tarjeta
import * as LucideIcons from 'lucide-react';

const ICON_LOOKUP = { ...LucideIcons };

const BudgetList = ({ allCategories = [] }) => { // Recibimos categorías para iconos
  const { budgets, loading, deleteBudget, updateBudget } = useBudgetStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleToggle = async (id, isActive) => {
    await updateBudget(id, { isActive });
  };

  const handleCreate = async (data) => {
      // Tu lógica de crear (probablemente pasada desde el padre o llamando al store)
      // Este componente parece ser visual, asegúrate de conectar 'createBudget' del store
      const { createBudget, user } = useBudgetStore.getState(); // Acceso directo si no se pasa por props
      // Nota: Idealmente BudgetList debería recibir 'handleCreate' o usar el store.
      // Asumo que ya tienes la lógica de crear en el padre o aquí mismo.
  };

  if (loading) {
    return <div className="text-center text-gray-400 animate-pulse py-10">Cargando presupuestos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Botón de crear */}
      {!isCreating && !editingBudget && (
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full py-4 border-2 border-dashed border-secondary-300 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 text-secondary-400 hover:text-secondary-600 dark:hover:text-white hover:border-[#FFD700] hover:bg-secondary-50 dark:hover:bg-white/5 transition-all group"
          >
            <PlusCircle className="w-8 h-8 group-hover:scale-110 transition-transform text-[#FFD700]" />
            <span className="font-black uppercase tracking-widest text-xs">Crear Nuevo Límite</span>
          </button>
      )}

      {/* Grid de Presupuestos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          // Buscar icono
          const category = allCategories.find(c => c.id === budget.categoryId);
          let IconComponent = category?.icon;
          if (typeof IconComponent !== 'function' && category?.iconName && ICON_LOOKUP[category.iconName]) {
            IconComponent = ICON_LOOKUP[category.iconName];
          }

          return (
            <BudgetCard 
              key={budget.id} 
              budget={budget} 
              categoryIcon={IconComponent}
              categoryColor={category?.color}
              onEdit={() => setEditingBudget(budget)} // Necesitarás manejar esto en el padre o aquí
              onDelete={() => deleteBudget(budget.id)}
              onToggle={handleToggle} // ✅ Conectado
            />
          );
        })}
      </div>
    </div>
  );
};

export default BudgetList;