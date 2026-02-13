import React from 'react';
import { ShieldCheck, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

const DebtHealthWidget = ({ cards }) => {
  const totalLimit = cards.reduce((acc, card) => acc + Number(card.limit), 0);
  const totalDebt = cards.reduce((acc, card) => acc + (Number(card.currentBalance) || 0), 0);
  
  if (totalLimit === 0) return null;

  // Cálculo del Score (Inverso a la utilización)
  const utilization = (totalDebt / totalLimit) * 100;
  const healthScore = Math.max(0, Math.round(100 - utilization));

  // Determinar estado
  let status = { color: '#10b981', text: 'Excelente', icon: ShieldCheck, bg: 'bg-emerald-500' };
  if (utilization > 30) status = { color: '#f59e0b', text: 'Aceptable', icon: TrendingUp, bg: 'bg-amber-500' };
  if (utilization > 70) status = { color: '#ef4444', text: 'Crítico', icon: AlertTriangle, bg: 'bg-red-500' };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-secondary-900 border border-secondary-100 dark:border-white/5 shadow-xl p-6 md:p-8">
      {/* Fondo decorativo */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ${status.bg}`} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Lado Izquierdo: Score Circular */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary-100 dark:text-white/10" />
              <circle 
                cx="48" cy="48" r="40" stroke={status.color} strokeWidth="8" fill="transparent" 
                strokeDasharray={251.2} 
                strokeDashoffset={251.2 - (251.2 * healthScore) / 100} 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-secondary-900 dark:text-white">{healthScore}</span>
              <span className="text-[8px] font-bold uppercase text-secondary-400">Puntos</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              Salud Crediticia
              <status.icon size={18} style={{ color: status.color }} />
            </h3>
            <p className="text-xs font-bold text-secondary-500 dark:text-secondary-400 mt-1 max-w-[200px]">
              {utilization > 70 
                ? "Estás usando mucho crédito. Intenta bajar tu deuda para mejorar tu score."
                : utilization > 30 
                ? "Vas bien, pero mantén tus gastos bajo control."
                : "¡Excelente manejo! Tienes gran capacidad de endeudamiento."}
            </p>
          </div>
        </div>

        {/* Lado Derecho: Estadísticas Rápidas */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="p-4 rounded-2xl bg-secondary-50 dark:bg-white/5 border border-white/50 dark:border-white/5">
                <p className="text-[10px] font-black uppercase text-secondary-400 tracking-widest mb-1">Deuda Total</p>
                <p className="text-xl font-black text-secondary-900 dark:text-white">${totalDebt.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-2xl bg-secondary-50 dark:bg-white/5 border border-white/50 dark:border-white/5">
                <p className="text-[10px] font-black uppercase text-secondary-400 tracking-widest mb-1">Disponible</p>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">${(totalLimit - totalDebt).toLocaleString()}</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DebtHealthWidget;