import React, { useMemo } from "react";
import { TrendingUp, CheckCircle2, AlertTriangle, PieChart } from "lucide-react";
import { SYSTEM_CATEGORIES } from "../../constants/categories";

const Insights = ({ currentExpenses, lastExpenses }) => {
  const insights = useMemo(() => {
    const list = [];
    const totalCurrent = currentExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalLast = lastExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // 1. INSIGHT DE TENDENCIA (Comparativa mes)
    if (totalCurrent > totalLast && totalLast > 0) {
      const diff = ((totalCurrent - totalLast) / totalLast) * 100;
      list.push({
        id: 'trend-bad',
        icon: TrendingUp,
        text: `Estás gastando un ${Math.round(diff)}% más que el mes pasado.`,
        color: 'text-red-500',
        bg: 'bg-red-500/5 border-red-500/20'
      });
    } else if (totalCurrent < totalLast && new Date().getDate() > 20) {
      list.push({
        id: 'trend-good',
        icon: CheckCircle2,
        text: `Vas ganando: has reducido tus gastos respecto al mes anterior.`,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/5 border-emerald-500/20'
      });
    }

    // 2. INSIGHT DE CATEGORÍA DOMINANTE (Lo que pediste)
    if (currentExpenses.length > 0) {
      const catStats = {};
      currentExpenses.forEach(e => {
        catStats[e.categoryId] = (catStats[e.categoryId] || 0) + Number(e.amount);
      });
      
      const sortedCats = Object.entries(catStats).sort((a, b) => b[1] - a[1]);
      const topCatId = sortedCats[0][0];
      const topCatAmount = sortedCats[0][1];
      const topCatPercent = (topCatAmount / totalCurrent) * 100;
      
      const categoryName = SYSTEM_CATEGORIES.find(c => c.id === topCatId)?.label || "Otros";

      list.push({
        id: 'top-cat',
        icon: PieChart,
        text: `Atención: El ${Math.round(topCatPercent)}% de tus gastos es ${categoryName}.`,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/5 border-indigo-500/20'
      });
    }

    return list.slice(0, 2); // Solo mostrar los 2 más importantes
  }, [currentExpenses, lastExpenses]);

  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black uppercase text-secondary-400 dark:text-secondary-500 tracking-[0.2em] ml-2">
        Análisis IA
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center gap-4 p-4 rounded-[1.8rem] backdrop-blur-xl border ${item.bg} transition-all hover:scale-[1.01] shadow-sm`}
          >
            <div className={`p-2.5 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-md ${item.color}`}>
              <item.icon size={18} />
            </div>
            <p className="text-[10px] font-bold text-secondary-700 dark:text-secondary-200 uppercase leading-relaxed pr-2">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;