import React, { useMemo } from "react";
import { SYSTEM_CATEGORIES } from "../../constants/categories";

const TopCategories = ({ currentExpenses }) => {
  const topData = useMemo(() => {
    const categoriesMap = {};
    let totalMonth = 0;

    currentExpenses.forEach(e => {
      const amount = Number(e.amount);
      totalMonth += amount;
      // Usamos el ID para agrupar, pero el nombre del store si es custom
      const catId = e.categoryId;
      if (!categoriesMap[catId]) {
        const sysCat = SYSTEM_CATEGORIES.find(c => c.id === catId);
        categoriesMap[catId] = {
          id: catId,
          name: e.categoryName || sysCat?.label || "Otros",
          amount: 0,
          color: sysCat?.color || "#94a3b8" // Color por defecto gris
        };
      }
      categoriesMap[catId].amount += amount;
    });

    return Object.values(categoriesMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(c => ({
        ...c,
        percent: totalMonth > 0 ? (c.amount / totalMonth) * 100 : 0
      }));
  }, [currentExpenses]);

  return (
    <div className="bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-xl">
      <h3 className="text-xs font-black uppercase text-secondary-900 dark:text-white tracking-[0.2em] mb-6">
        Top Categorías
      </h3>

      <div className="space-y-6">
        {topData.length > 0 ? topData.map((cat) => (
          <div key={cat.id} className="group">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-sm" 
                  style={{ backgroundColor: cat.color }} 
                />
                <span className="text-[10px] font-black uppercase text-secondary-600 dark:text-secondary-300 tracking-tight group-hover:text-secondary-900 dark:group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-xs font-black text-secondary-900 dark:text-white">
                  ${cat.amount.toLocaleString()}
                </span>
                <span className="text-[8px] font-bold text-secondary-400">
                  {Math.round(cat.percent)}%
                </span>
              </div>
            </div>
            
            {/* Barra de progreso con efecto glass */}
            <div className="w-full h-2 bg-secondary-100/50 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
              >
                 {/* Brillo interno en la barra */}
                 <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30" />
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-8 opacity-40">
            <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">
              Sin movimientos este mes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopCategories;