import React, { useEffect, useState } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { DEFAULT_CATEGORIES } from '../constants/categories';

const Expenses = () => {
  const { expenses, loadExpenses, deleteExpense, getFilteredExpenses } = useExpenseStore();
  const { user } = useAuthStore();
  const { currency } = useSettingsStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (user) {
      loadExpenses(user.uid);
    }
  }, [user]);

  const filteredExpenses = getFilteredExpenses();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryById = (id) => {
    return DEFAULT_CATEGORIES.find((cat) => cat.id === id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto?')) {
      await deleteExpense(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Gastos
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Historial de tus gastos
        </p>
      </div>

      {/* Category Filter */}
      <Card>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
              px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
              ${!selectedCategory
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
              }
            `}
          >
            Todas
          </button>
          {DEFAULT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2
                ${selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                No hay gastos registrados
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Usa el botón + para agregar tu primer gasto
              </p>
            </div>
          </Card>
        ) : (
          filteredExpenses.map((expense) => {
            const category = getCategoryById(expense.categoryId);
            return (
              <Card key={expense.id} hover className="cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-2xl">
                    {category?.icon || '💰'}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-secondary-900 dark:text-white">
                      {expense.description}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <span>{category?.name || 'Otro'}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600">
                      {formatCurrency(expense.amount)}
                    </div>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-sm text-danger-600 hover:text-danger-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Stats */}
      {filteredExpenses.length > 0 && (
        <Card>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Gastos</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {filteredExpenses.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Promedio</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {formatCurrency(
                  filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) /
                    filteredExpenses.length
                )}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Expenses;