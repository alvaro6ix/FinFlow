import React, { useState } from 'react';
import { useBudgetStore } from '../../stores/budgetStore';
import BudgetCard from './BudgetCard';
import BudgetForm from './BudgetForm';
import { PlusCircle } from 'lucide-react';

const BudgetList = () => {
  const { budgets, loading } = useBudgetStore();
  const [isCreating, setIsCreating] = useState(false);

  if (loading) {
    return <div className="text-center text-gray-400 animate-pulse py-10">Cargando presupuestos...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Botón de crear (Sticky o superior) */}
      {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all group"
          >
            <PlusCircle className="w-8 h-8 group-hover:scale-110 transition-transform text-purple-400" />
            <span className="font-medium">Crear Nuevo Presupuesto</span>
          </button>
      )}

      {/* Formulario de creación */}
      {isCreating && (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-4 fade-in">
           <BudgetForm onClose={() => setIsCreating(false)} />
        </div>
      )}

      {/* Grid de Presupuestos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} />
        ))}
      </div>

      {budgets.length === 0 && !isCreating && (
        <div className="text-center py-12">
            <p className="text-gray-500">No tienes presupuestos activos. ¡Crea uno para comenzar a ahorrar!</p>
        </div>
      )}
    </div>
  );
};

export default BudgetList;