import React, { useMemo } from "react";
import { TrendingUp, CheckCircle2, PieChart } from "lucide-react";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { useCategoryStore } from "../../stores/categoryStore"; // ✅ Importamos el Store

const Insights = ({ currentExpenses, lastExpenses, budget }) => {
  // ✅ Obtenemos tus categorías personalizadas
  const { customCategories } = useCategoryStore();

  const insights = useMemo(() => {
    const list = [];
    const totalCurrent = currentExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalLast = lastExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // 1. TENDENCIA
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

    // 2. CATEGORÍA DOMINANTE (Corrección de Nombre)
    if (totalCurrent > 0) {
      const catTotals = {};
      currentExpenses.forEach(e => {
        catTotals[e.categoryId] = (catTotals[e.categoryId] || 0) + Number(e.amount);
      });
      
      const topCatId = Object.keys(catTotals).reduce((a, b) => catTotals[a] > catTotals[b] ? a : b);
      const topCatAmount = catTotals[topCatId];
      const topCatPercent = (topCatAmount / totalCurrent) * 100;
      
      // ✅ BÚSQUEDA HÍBRIDA: Primero sistema, luego personalizada
      const sysCat = SYSTEM_CATEGORIES.find(c => c.id === topCatId);
      const customCat = customCategories.find(c => c.id === topCatId);
      
      // Si encuentra la personalizada usa su label, si no busca en el gasto, si no "Otros"
      const categoryName = sysCat?.label || customCat?.label || "Otros";

      list.push({
        id: 'top-cat',
        icon: PieChart,
        text: `Atención: El ${Math.round(topCatPercent)}% de tus gastos es ${categoryName}.`,
        color: 'text-[#FFD700]', // Dorado Liquid
        bg: 'bg-[#FFD700]/10 border-[#FFD700]/30'
      });
    }

    return list.slice(0, 2);
  }, [currentExpenses, lastExpenses, customCategories]); // ✅ Añadido customCategories a dependencias

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
            <div className={`p-3 rounded-full bg-white dark:bg-black/20 ${item.color} shadow-sm`}>
              <item.icon size={20} strokeWidth={2.5} />
            </div>
            <p className={`text-xs font-bold leading-relaxed text-secondary-700 dark:text-secondary-200`}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;