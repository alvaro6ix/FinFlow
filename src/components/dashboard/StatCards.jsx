import React, { useState } from "react";
import Card from "../common/Card";
import { Zap, Calendar, Globe, Repeat, ArrowUpRight } from "lucide-react";
import SmallExpensesModal from "./SmallExpensesModal";

const StatCard = ({ title, amount, icon: Icon, color, onClick, subtitle }) => (
  <div onClick={onClick} className="h-full cursor-pointer group">
    <div className="relative overflow-hidden bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 shadow-xl transition-all hover:scale-[1.02] active:scale-95 group-hover:bg-white/50 dark:group-hover:bg-secondary-900/50 h-full flex flex-col justify-between">
      
      {/* Fondo decorativo */}
      <div className="absolute -right-4 -top-4 opacity-10" style={{ color: color }}>
        <Icon size={80} />
      </div>

      <div>
        <div className="relative z-10 flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-2xl backdrop-blur-md shadow-sm" style={{ backgroundColor: `${color}20`, color: color }}>
            <Icon size={20} />
          </div>
          <ArrowUpRight size={16} className="text-secondary-400 group-hover:text-secondary-600 dark:text-secondary-500 transition-colors" />
        </div>
        
        <p className="text-[9px] font-black uppercase text-secondary-500 dark:text-secondary-400 tracking-[0.2em] mb-1">
          {title}
        </p>
        
        <p className="text-2xl sm:text-3xl font-black text-secondary-900 dark:text-white tracking-tighter leading-none">
          ${amount.toLocaleString()}
        </p>
      </div>
      
      <p className="text-[8px] font-bold text-secondary-400 uppercase mt-3 tracking-wide opacity-80">
        {subtitle}
      </p>
    </div>
  </div>
);

const StatCards = ({ data }) => {
  const [modal, setModal] = useState({ isOpen: false, title: "", expenses: [], icon: null });

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Hoy" 
          amount={data.totalToday} 
          icon={Zap} color="#f59e0b" 
          subtitle="Pulso diario"
          onClick={() => setModal({ isOpen: true, title: "Gastos de Hoy", expenses: data.todayExpenses, icon: Zap })}
        />
        <StatCard 
          title="Mes" 
          amount={data.totalMonth} 
          icon={Calendar} color="#6366f1" 
          subtitle="Acumulado"
          onClick={() => setModal({ isOpen: true, title: "Gastos del Mes", expenses: data.monthExpenses, icon: Calendar })}
        />
        <StatCard 
          title="Fijos" 
          amount={data.totalRecurring} 
          icon={Repeat} color="#ec4899" 
          subtitle="Suscripciones"
          onClick={() => setModal({ isOpen: true, title: "Gastos Recurrentes", expenses: data.recurringExpenses, icon: Repeat })}
        />
        <StatCard 
          title="Global" 
          amount={data.totalGlobal} 
          icon={Globe} color="#10b981" 
          subtitle="Histórico"
          onClick={() => setModal({ isOpen: true, title: "Historial Global", expenses: data.allExpenses, icon: Globe })}
        />
      </div>

      <SmallExpensesModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        expenses={modal.expenses}
        customTitle={modal.title}
        icon={modal.icon}
      />
    </>
  );
};

export default StatCards;