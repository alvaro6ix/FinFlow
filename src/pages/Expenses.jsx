import React, { useState } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import Card from '../components/common/Card';
import { SYSTEM_CATEGORIES } from '../constants/categories';

const Expenses = () => {
  const { expenses, deleteExpense } = useExpenseStore();
  const [filter, setFilter] = useState('');

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(filter.toLowerCase()) ||
    e.categoryName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white text-secondary-900">Mis Gastos</h1>
      </header>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Buscar por descripción o categoría..."
          className="w-full p-4 rounded-2xl bg-white dark:bg-secondary-900 border-none shadow-sm focus:ring-2 focus:ring-primary-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredExpenses.map((expense) => {
          const category = SYSTEM_CATEGORIES.find(c => c.id === expense.categoryId);
          return (
            <Card key={expense.id} className="hover:scale-[1.01] transition-transform">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-secondary-50 dark:bg-secondary-800">
                    {category?.icon || '💰'}
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white">{expense.description}</h4>
                    <p className="text-xs text-secondary-500">
                      {new Date(expense.date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-danger-600">-${expense.amount.toFixed(2)}</p>
                  <button 
                    onClick={() => confirm('¿Borrar gasto?') && deleteExpense(expense.id)}
                    className="text-[10px] text-secondary-400 uppercase tracking-widest hover:text-danger-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Expenses;