import React from 'react';
import BudgetCard from './BudgetCard';

const BudgetList = ({ budgets = [], expenses = [], currency, onEdit, onDelete }) => {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
          No hay presupuestos
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400">
          Crea tu primer presupuesto para controlar tus gastos
        </p>
      </div>
    );
  }

  // Calcular gasto por categoría
  const getSpentByCategory = (categoryId) => {
    return expenses
      .filter(exp => exp.categoryId === categoryId)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          spent={getSpentByCategory(budget.categoryId)}
          currency={currency}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BudgetList;