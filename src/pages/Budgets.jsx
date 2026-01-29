import React from 'react';
import { useBudgetStore } from '../stores/budgetStore';
import { useExpenseStore } from '../stores/expenseStore';
import { SYSTEM_CATEGORIES } from '../constants/categories';
import Card from '../components/common/Card';

const Budgets = () => {
  const { budgets } = useBudgetStore();
  const { expenses } = useExpenseStore();

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Presupuestos</h1>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-xl font-bold text-sm">＋ Crear</button>
      </div>

      <div className="grid gap-4">
        {budgets.map((budget) => {
          const category = SYSTEM_CATEGORIES.find(c => c.id === budget.categoryId);
          const spent = expenses
            .filter(e => e.categoryId === budget.categoryId)
            .reduce((s, e) => s + e.amount, 0);
          const percent = Math.min((spent / budget.amount) * 100, 100);

          return (
            <Card key={budget.id} title={category?.label || 'Presupuesto'}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-secondary-500">Gastado: ${spent.toFixed(2)}</span>
                <span className="text-sm font-bold">${budget.amount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-secondary-100 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${percent > 90 ? 'bg-danger-500' : 'bg-primary-500'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-[10px] text-secondary-400 mt-2">
                {percent >= 100 ? '⚠️ Has superado el límite' : `Te queda un ${(100 - percent).toFixed(0)}%`}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;