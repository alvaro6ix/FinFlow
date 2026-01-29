import React from 'react';
import Alert from '../common/Alert';

const BudgetAlerts = ({ budgets = [], expenses = [] }) => {
  const alerts = [];

  budgets.forEach(budget => {
    const spent = expenses
      .filter(exp => exp.categoryId === budget.categoryId)
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const percentage = (spent / budget.amount) * 100;

    if (percentage >= 100) {
      alerts.push({
        type: 'error',
        message: `Has excedido el presupuesto de ${budget.categoryName} por ${((percentage - 100).toFixed(1))}%`,
      });
    } else if (percentage >= budget.alertThreshold) {
      alerts.push({
        type: 'warning',
        message: `Has usado el ${percentage.toFixed(0)}% de tu presupuesto de ${budget.categoryName}`,
      });
    }
  });

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <Alert key={index} type={alert.type} message={alert.message} />
      ))}
    </div>
  );
};

export default BudgetAlerts;