import React, { useMemo } from 'react';
import Card from '../common/Card';
import { useExpenseStore } from '../../stores/expenseStore';

const ProactiveAssistant = () => {
  const { expenses } = useExpenseStore();

  const insight = useMemo(() => {
    if (expenses.length === 0) return null;

    const now = new Date();
    const lastExpense = new Date(expenses[0].date);
    const diffDays = Math.floor((now - lastExpense) / (1000 * 60 * 60 * 24));

    // Lógica del Asistente (Requerimiento 13.4)
    if (diffDays >= 3) {
      return {
        text: `Llevas ${diffDays} días sin registrar gastos. ¡No pierdas el control!`,
        icon: "⚠️",
        type: "warning"
      };
    }

    const impulseExpenses = expenses.filter(e => e.isImpulse).length;
    if (impulseExpenses > 5) {
      return {
        text: "Detectamos varios gastos por impulso. ¿Probamos el reto de 24h antes de comprar?",
        icon: "🕵️",
        type: "info"
      };
    }

    return {
      text: "¡Vas por buen camino! Este mes has ahorrado más que tu promedio histórico.",
      icon: "🎉",
      type: "success"
    };
  }, [expenses]);

  if (!insight) return null;

  return (
    <Card className={`border-l-4 ${
      insight.type === 'warning' ? 'border-l-warning-500' : 
      insight.type === 'success' ? 'border-l-success-500' : 'border-l-primary-500'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{insight.icon}</span>
        <p className="text-sm dark:text-secondary-200">{insight.text}</p>
      </div>
    </Card>
  );
};

export default ProactiveAssistant;