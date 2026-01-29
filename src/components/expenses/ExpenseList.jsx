import React from 'react';
import ExpenseCard from './ExpenseCard';

const ExpenseList = ({ expenses = [], onDelete, onEdit, currency }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
          No hay gastos registrados
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400">
          Usa el botón + para agregar tu primer gasto
        </p>
      </div>
    );
  }

  // Agrupar por fecha
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = new Date(expense.date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedExpenses).map(([date, expensesForDate]) => (
        <div key={date}>
          <h3 className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 mb-3">
            {date}
          </h3>
          <div className="space-y-3">
            {expensesForDate.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={onDelete}
                onEdit={onEdit}
                currency={currency}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;