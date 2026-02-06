import React, { useMemo } from "react";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { useCategoryStore } from "../../stores/categoryStore";

const TopCategories = ({ currentExpenses }) => {
  const { customCategories } = useCategoryStore();

  const topData = useMemo(() => {
    const categoriesMap = {};
    let totalMonth = 0;

    currentExpenses.forEach(e => {
      const amount = Number(e.amount);
      totalMonth += amount;
      
      const catId = e.categoryId;
      
      if (!categoriesMap[catId]) {
        // Búsqueda en Sistema y Personalizadas
        const sysCat = SYSTEM_CATEGORIES.find(c => c.id === catId);
        const customCat = customCategories.find(c => c.id === catId);
        const categoryData = customCat || sysCat;

        categoriesMap[catId] = {
          id: catId,
          name: categoryData?.label || e.categoryName || "Otros", 
          amount: 0,
          color: categoryData?.color || "#FFD700" 
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
  }, [currentExpenses, customCategories]);

  return (
    <div className="bg-white/40 dark:bg-secondary-900/40 backdrop-blur-md rounded-[2.5rem] p-6 border border-white/20 dark:border-white/5 shadow-sm">
      <h3 className="text-xs font-black text-secondary-900 dark:text-white uppercase tracking-widest mb-6 ml-1">
        Top Categorías
      </h3>

      <div className="space-y-5">
        {topData.length > 0 ? topData.map((cat) => (
          <div key={cat.id} className="group">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" 
                  style={{ color: cat.color, backgroundColor: cat.color }} 
                />
                <span className="text-[10px] font-bold uppercase text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-900 dark:group-hover:text-white transition-colors">
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
            
            <div className="w-full h-2 bg-secondary-100/50 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
              >
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