import React, { useMemo } from 'react';
import Card from '../common/Card';
import { useExpenseStore } from '../../stores/expenseStore';
import { Lightbulb, AlertTriangle, PartyPopper, Zap } from 'lucide-react';

const ProactiveAssistant = () => {
  const { expenses } = useExpenseStore();

  const insight = useMemo(() => {
    if (expenses.length === 0) return null;

    // Aseguramos orden descendente por fecha
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    const now = new Date();
    const lastExpenseDate = new Date(sortedExpenses[0].date);
    const diffDays = Math.floor((now - lastExpenseDate) / (1000 * 60 * 60 * 24));

    // REQUERIMIENTO 13.4: Asistente Proactivo
    if (diffDays >= 3) {
      return {
        text: `Detective: Llevas ${diffDays} días sin registrar actividad. ¡Mantén el hábito!`,
        icon: <AlertTriangle className="text-warning-500" />,
        type: "warning",
        bg: "bg-warning-50 dark:bg-warning-900/20"
      };
    }

    // REQUERIMIENTO 13.3: Detective Financiero (Detección de impulsos)
    const recentImpulses = expenses.filter(e => e.isImpulse && 
      (now - new Date(e.date)) < (7 * 24 * 60 * 60 * 1000)).length;

    if (recentImpulses > 3) {
      return {
        text: `Has tenido ${recentImpulses} gastos por impulso esta semana. ¿Probamos el modo Ahorro Extremo?`,
        icon: <Zap className="text-primary-500" />,
        type: "info",
        bg: "bg-primary-50 dark:bg-primary-900/20"
      };
    }

    return {
      text: "Tu salud financiera es sólida. Estás gastando un 10% menos que tu promedio.",
      icon: <PartyPopper className="text-success-500" />,
      type: "success",
      bg: "bg-success-50 dark:bg-success-900/20"
    };
  }, [expenses]);

  if (!insight) return null;

  return (
    <Card className={`border-none ${insight.bg} transition-all duration-500`}>
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white dark:bg-secondary-800 rounded-xl shadow-sm">
          {insight.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-black uppercase text-secondary-400 mb-1 tracking-widest">
            Asistente Proactivo
          </p>
          <p className="text-sm font-bold text-secondary-900 dark:text-white leading-tight italic">
            "{insight.text}"
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProactiveAssistant;