import React from "react";
import Card from "../common/Card";
import { TrendingDown, TrendingUp, CalendarDays, Info } from "lucide-react";

const MonthSummary = ({ spent, budget, lastMonthSpent }) => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay;

  // Proyección Real: (Gasto / días transcurridos) * total días del mes
  const averagePerDay = currentDay > 0 ? spent / currentDay : 0;
  const projection = averagePerDay * daysInMonth;
  
  const diffAmount = spent - lastMonthSpent;
  const diffPercent = lastMonthSpent > 0 ? (diffAmount / lastMonthSpent) * 100 : 0;

  return (
    <Card className="p-5 sm:p-7 bg-white dark:bg-secondary-900 border-none shadow-xl rounded-[2.5rem] h-full">
      <div className="flex flex-col h-full justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-4 flex-1">
            <div>
              <p className="text-[10px] font-black uppercase text-secondary-400 tracking-widest mb-1">Total hoy (Día {currentDay})</p>
              <p className="text-4xl font-black text-secondary-900 dark:text-white tracking-tighter">
                ${spent.toLocaleString()}
              </p>
            </div>
            
            <div className="relative group">
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-[10px] font-black uppercase text-secondary-400 tracking-widest">Proyección al cierre</p>
                <Info size={10} className="text-secondary-300 cursor-help" />
                
                {/* TOOLTIP EXPLICATIVO */}
                <div className="absolute bottom-full left-0 mb-2 w-48 p-3 bg-secondary-900 text-white text-[8px] font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50 uppercase leading-relaxed">
                  Basado en tu gasto promedio de <span className="text-amber-400">${averagePerDay.toFixed(2)}/día</span>, estima cuánto habrás gastado al finalizar los {daysInMonth} días del mes.
                </div>
              </div>
              <p className="text-2xl font-black text-[#6366f1] tracking-tighter">
                ${Math.round(projection).toLocaleString()}
              </p>
              <p className="text-[8px] font-bold text-secondary-400 uppercase mt-1 leading-tight max-w-[200px]">
                Estimado mensual según tu ritmo actual de gasto diario.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-4 py-3 rounded-2xl flex sm:flex-col items-center sm:items-end justify-between gap-2">
            <div className="flex items-center gap-2 text-[#f59e0b]">
              <CalendarDays size={18} />
              <span className="text-xl font-black leading-none">{daysRemaining}</span>
            </div>
            <p className="text-[8px] font-black uppercase text-secondary-500 tracking-tighter text-right leading-tight">
              Días para <br className="hidden sm:block" /> fin de mes
            </p>
          </div>
        </div>

        <div className={`pt-4 border-t border-secondary-50 dark:border-secondary-800 flex justify-between items-center ${diffAmount <= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          <p className="text-[9px] font-black uppercase text-secondary-400">Vs mes anterior</p>
          <div className="flex items-center gap-1 font-black text-sm">
            {diffAmount <= 0 ? <TrendingDown size={16}/> : <TrendingUp size={16}/>}
            {Math.abs(Math.round(diffPercent))}%
          </div>
        </div>

      </div>
    </Card>
  );
};

export default MonthSummary;