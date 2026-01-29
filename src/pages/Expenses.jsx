import React, { useMemo } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { SYSTEM_CATEGORIES } from '../constants/categories';
import Card from '../components/common/Card';

const Expenses = () => {
  const { expenses, deleteExpense } = useExpenseStore();

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses]);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Mis Gastos</h1>
        <span className="text-secondary-500 text-sm">{expenses.length} registros</span>
      </div>

      <div className="grid gap-4">
        {sortedExpenses.length > 0 ? (
          sortedExpenses.map((expense) => {
            const category = SYSTEM_CATEGORIES.find(c => c.id === expense.categoryId);
            return (
              <Card key={expense.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl bg-secondary-50 p-2 rounded-2xl">
                      {category?.icon || '💰'}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{expense.description || 'Sin descripción'}</p>
                      <p className="text-xs text-secondary-500">
                        {new Date(expense.date).toLocaleDateString()} • {category?.label || 'Otros'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-danger-600">
                      -${expense.amount.toFixed(2)}
                    </p>
                    <button 
                      onClick={() => { if(confirm('¿Eliminar?')) deleteExpense(expense.id) }}
                      className="text-xs text-secondary-400 hover:text-danger-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-secondary-400">No hay gastos registrados aún.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expenses;