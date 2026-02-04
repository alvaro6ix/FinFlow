import React, { useMemo } from "react";
import { Sparkles, AlertTriangle, TrendingUp, CheckCircle2, Info } from "lucide-react";

const Insights = ({ currentExpenses, lastExpenses, budget = 20000 }) => {
  const generatedInsights = useMemo(() => {
    const insights = [];
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();

    const totalCurrent = currentExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalLast = lastExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // 1. Insight de Ahorro o Exceso General
    if (totalCurrent > totalLast && totalLast > 0) {
      const diff = ((totalCurrent - totalLast) / totalLast) * 100;
      insights.push({
        id: 'trend',
        type: 'warning',
        icon: TrendingUp,
        text: `Gastas un ${Math.round(diff)}% más que el mes pasado.`,
        color: 'text-red-500',
        bg: 'bg-red-50 dark:bg-red-900/10'
      });
    } else if (totalCurrent < totalLast && currentDay > 15) {
      insights.push({
        id: 'save',
        type: 'success',
        icon: CheckCircle2,
        text: "¡Vas por buen camino! Estás gastando menos que el mes anterior.",
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/10'
      });
    }

    // 2. Insight de Proyección de Presupuesto
    const projection = (totalCurrent / currentDay) * daysInMonth;
    if (projection > budget && budget > 0) {
      insights.push({
        id: 'budget-alert',
        type: 'danger',
        icon: AlertTriangle,
        text: `A este ritmo, superarás tu presupuesto por $${Math.round(projection - budget).toLocaleString()}.`,
        color: 'text-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-900/10'
      });
    }

    // 3. Insight de Categoría más pesada
    if (currentExpenses.length > 0) {
      const catTotals = currentExpenses.reduce((acc, e) => {
        acc[e.categoryName] = (acc[e.categoryName] || 0) + Number(e.amount);
        return acc;
      }, {});
      
      const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
      const percent = (topCat[1] / totalCurrent) * 100;
      
      if (percent > 40) {
        insights.push({
          id: 'category-heavy',
          type: 'info',
          icon: Sparkles,
          text: `Tu gasto en "${topCat[0]}" representa el ${Math.round(percent)}% de tus salidas.`,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50 dark:bg-indigo-900/10'
        });
      }
    }

    // 4. Insight de Gasto Hormiga (Sincronizado con SmallExpenses)
    const totalHormiga = currentExpenses.filter(e => Number(e.amount) < 50).reduce((sum, e) => sum + Number(e.amount), 0);
    if (totalHormiga > 500) {
      insights.push({
        id: 'ant-alert',
        type: 'info',
        icon: Info,
        text: `Los gastos pequeños ya suman $${totalHormiga.toLocaleString()}. ¡Cuidado con las fugas!`,
        color: 'text-secondary-600',
        bg: 'bg-secondary-50 dark:bg-secondary-800/50'
      });
    }

    return insights.slice(0, 4); // Mostramos máximo 4 para no saturar
  }, [currentExpenses, lastExpenses, budget]);

  if (generatedInsights.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black uppercase text-secondary-400 tracking-[0.2em] ml-2">Insights del Asistente</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {generatedInsights.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center gap-3 p-4 rounded-[1.8rem] ${item.bg} border border-transparent transition-all hover:scale-[1.02]`}
          >
            <div className={`p-2 rounded-xl bg-white dark:bg-secondary-900 shadow-sm ${item.color}`}>
              <item.icon size={18} />
            </div>
            <p className={`text-[11px] font-bold uppercase leading-tight ${item.color}`}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;