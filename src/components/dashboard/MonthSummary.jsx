import React from "react";
import Card from "../common/Card";
import { TrendingDown, TrendingUp, CalendarDays } from "lucide-react";

const MonthSummary = ({ spent, budget, lastMonthSpent }) => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay;

  const averagePerDay = currentDay > 0 ? spent / currentDay : 0;
  const projection = averagePerDay * daysInMonth;
  const diffAmount = spent - lastMonthSpent;

  return (
    <Card className="h-full p-6 sm:p-8 bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl flex flex-col justify-between">
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="space-y-4 flex-1 w-full">
          <div>
            <p className="text-[10px] font-black uppercase text-secondary-500 dark:text-secondary-400 tracking-[0.2em] mb-2">
              Proyección Fin de Mes
            </p>
            <p className="text-3xl sm:text-4xl font-black text-secondary-900 dark:text-white tracking-tighter">
              ${projection.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-[9px] font-bold text-secondary-400 mt-2 leading-relaxed max-w-[200px]">
              Basado en tu ritmo de gasto diario de <span className="text-secondary-600 dark:text-secondary-300">${averagePerDay.toLocaleString(undefined, { maximumFractionDigits: 0 })}/día</span>.
            </p>
          </div>
        </div>

        {/* Tarjeta de Días Restantes (Mini Glass) */}
        <div className="w-full sm:w-auto bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 backdrop-blur-md px-5 py-4 rounded-3xl flex sm:flex-col items-center sm:items-end justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-500">
            <CalendarDays size={20} />
            <span className="text-2xl font-black leading-none">{daysRemaining}</span>
          </div>
          <p className="text-[8px] font-black uppercase text-secondary-500 dark:text-secondary-400 tracking-widest text-right leading-tight">
            Días <br className="hidden sm:block" /> restantes
          </p>
        </div>
      </div>

      {/* Footer Comparativo */}
      <div className={`mt-6 pt-6 border-t border-secondary-100/50 dark:border-white/5 flex justify-between items-center ${diffAmount <= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        <p className="text-[9px] font-black uppercase text-secondary-400 tracking-widest">Vs mes anterior</p>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm">
          {diffAmount <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          <span className="text-xs font-black tracking-tight">
            {diffAmount > 0 ? '+' : ''}${Math.abs(diffAmount).toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default MonthSummary;