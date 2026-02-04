import React, { useState } from "react";
import Card from "../common/Card";
import { Zap, Calendar, Globe, Repeat, ArrowUpRight } from "lucide-react";
import SmallExpensesModal from "./SmallExpensesModal";

const StatCard = ({ title, amount, icon: Icon, color, onClick, subtitle }) => (
  <div onClick={onClick} className="h-full cursor-pointer group">
    <Card className="p-5 bg-white dark:bg-secondary-900 border-none shadow-lg rounded-[2.5rem] h-full transition-all group-hover:scale-[1.02] active:scale-95">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15`, color: color }}>
          <Icon size={18} />
        </div>
        <ArrowUpRight size={14} className="text-secondary-300 group-hover:text-secondary-500 transition-colors" />
      </div>
      <p className="text-[9px] font-black uppercase text-secondary-400 tracking-widest mb-1">{title}</p>
      <p className="text-2xl font-black text-secondary-900 dark:text-white tracking-tighter leading-none">
        ${amount.toLocaleString()}
      </p>
      <p className="text-[7px] font-bold text-secondary-400 uppercase mt-2 tracking-tighter">{subtitle}</p>
    </Card>
  </div>
);

export default function StatCards({ data }) {
  // Inicializamos con null para el icono
  const [modal, setModal] = useState({ isOpen: false, title: "", expenses: [], icon: null });

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1">
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
          subtitle="Acumulado Feb"
          onClick={() => setModal({ isOpen: true, title: "Gastos del Mes", expenses: data.monthExpenses, icon: Calendar })}
        />
        <StatCard 
          title="Recurrentes" 
          amount={data.totalRecurring} 
          icon={Repeat} color="#6366f1" 
          subtitle="Suscripciones"
          onClick={() => setModal({ isOpen: true, title: "Gastos Recurrentes", expenses: data.recurringExpenses, icon: Repeat })}
        />
        <StatCard 
          title="Global" 
          amount={data.totalGlobal} 
          icon={Globe} color="#10b981" 
          subtitle="Todo el tiempo"
          onClick={() => setModal({ isOpen: true, title: "Historial Global", expenses: data.allExpenses, icon: Globe })}
        />
      </div>

      <SmallExpensesModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })}
        expenses={modal.expenses}
        customTitle={modal.title}
        icon={modal.icon} // ✅ Pasamos la referencia del componente
      />
    </>
  );
}