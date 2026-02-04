import React, { useMemo } from "react";
import Card from "../common/Card";
import { SYSTEM_CATEGORIES } from "../../constants/categories";

const TopCategories = ({ currentExpenses }) => {
  const topData = useMemo(() => {
    const categoriesMap = {};
    let totalMonth = 0;

    currentExpenses.forEach(e => {
      const amount = Number(e.amount);
      totalMonth += amount;
      if (!categoriesMap[e.categoryId]) {
        categoriesMap[e.categoryId] = {
          id: e.categoryId,
          name: e.categoryName,
          amount: 0,
          color: SYSTEM_CATEGORIES.find(c => c.id === e.categoryId)?.color || "#94a3b8"
        };
      }
      categoriesMap[e.categoryId].amount += amount;
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
    <Card title="Top Categorías" className="p-6 bg-white dark:bg-secondary-900 border-none shadow-xl rounded-[2.5rem]">
      <div className="space-y-5 mt-4">
        {topData.length > 0 ? topData.map((cat) => (
          <div key={cat.id} className="space-y-1.5">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] font-black uppercase text-secondary-700 dark:text-secondary-200 tracking-tight">
                  {cat.name}
                </span>
              </div>
              <span className="text-[10px] font-black text-secondary-900 dark:text-white">
                ${cat.amount.toLocaleString()} <span className="text-secondary-400 ml-1">({Math.round(cat.percent)}%)</span>
              </span>
            </div>
            <div className="w-full h-1.5 bg-secondary-50 dark:bg-secondary-800 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
              />
            </div>
          </div>
        )) : (
          <p className="text-center py-10 text-[10px] font-black text-secondary-400 uppercase tracking-widest">
            Sin datos suficientes
          </p>
        )}
      </div>
    </Card>
  );
};

export default TopCategories;