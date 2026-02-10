import React, { useMemo } from "react";
import { useExpenseStore } from "../../stores/expenseStore";
import { useBudgetStore } from "../../stores/budgetStore";
import { Info, AlertTriangle, CheckCircle, TrendingUp, Wallet } from "lucide-react";

const HealthScore = () => {
  const { expenses } = useExpenseStore();
  const { incomeSources } = useBudgetStore();

  // Fecha Actual (Mes Local)
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; 
  const currentMonthName = now.toLocaleString('es-MX', { month: 'long' });

  // Helper para obtener la key de mes
  const getMonthKey = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput.seconds ? dateInput.seconds * 1000 : dateInput);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  // 1. Calcular Ingresos REALES del Mes
  const monthlyIncome = useMemo(() => {
    return incomeSources
      .filter(inc => getMonthKey(inc.date) === currentMonthKey)
      .reduce((sum, inc) => sum + Number(inc.amount), 0);
  }, [incomeSources, currentMonthKey]);

  // 2. Calcular Gastos del Mes
  const monthlySpent = useMemo(() => {
    return expenses
      .filter(exp => getMonthKey(exp.date) === currentMonthKey)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [expenses, currentMonthKey]);

  // 3. Lógica del Score
  let score = 100;
  let statusText = "Sin Datos";
  let statusColor = "#94a3b8"; // Gris
  let message = "Agrega ingresos.";
  let Icon = Info;

  if (monthlyIncome > 0) {
    const ratio = monthlySpent / monthlyIncome;
    score = Math.max(0, Math.round(100 - (ratio * 100)));

    if (score === 0) {
      statusText = "Agotado";
      statusColor = "#ef4444"; // Rojo
      message = "Has consumido todo.";
      Icon = AlertTriangle;
    } else if (score < 30) {
      statusText = "Crítico";
      statusColor = "#f97316"; // Naranja
      message = "Frena tus gastos.";
      Icon = AlertTriangle;
    } else if (score < 60) {
      statusText = "Riesgo";
      statusColor = "#eab308"; // Amarillo
      message = "Consumo elevado.";
      Icon = Info;
    } else {
      statusText = "Excelente";
      statusColor = "#10b981"; // Verde
      message = "Finanzas sanas.";
      Icon = CheckCircle;
    }
  }

  // Gráfico Circular
  const circumference = 2 * Math.PI * 35; 
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="h-full relative overflow-hidden bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl p-5 flex flex-col justify-between group hover:scale-[1.01] transition-transform">
      
      {/* Header */}
      <div className="w-full flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl shadow-sm">
            <TrendingUp size={16} className="text-secondary-500 dark:text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary-500 dark:text-secondary-400">
              Salud Financiera
            </p>
            <p className="text-[8px] font-bold text-secondary-400 uppercase tracking-widest opacity-70">
              {currentMonthName}
            </p>
          </div>
        </div>
        
        {/* Etiqueta de Estado */}
        <div className="px-2 py-1 rounded-lg border backdrop-blur-md transition-colors" style={{ backgroundColor: `${statusColor}15`, borderColor: `${statusColor}30` }}>
          <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1" style={{ color: statusColor }}>
            <Icon size={10} /> {statusText}
          </span>
        </div>
      </div>

      {/* Gráfico Central con GLOW */}
      <div className="relative w-32 h-32 flex items-center justify-center mx-auto my-1">
        <div 
          className="absolute inset-0 blur-2xl opacity-20 rounded-full transition-colors duration-1000" 
          style={{ backgroundColor: statusColor }} 
        />
        <svg className="w-full h-full transform -rotate-90 relative z-10">
          <circle cx="64" cy="64" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-secondary-200/50 dark:text-white/10" />
          <circle cx="64" cy="64" r="35" stroke={statusColor} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-md" />
        </svg>
        <div className="absolute flex flex-col items-center z-20">
          <span className="text-4xl font-black text-secondary-900 dark:text-white leading-none tracking-tighter drop-shadow-sm">
            {score}
          </span>
          <span className="text-[7px] font-bold uppercase tracking-widest mt-1" style={{ color: statusColor }}>
            Puntos
          </span>
        </div>
      </div>

      {/* Footer: Gastado vs Presupuesto */}
      <div className="mt-2 bg-white/30 dark:bg-black/20 rounded-2xl p-3 border border-white/10 flex justify-between items-center">
        <div>
          <p className="text-[8px] font-bold uppercase text-secondary-400 tracking-wider mb-0.5">Gastado</p>
          <p className="text-xs font-black text-secondary-900 dark:text-white">
            ${monthlySpent.toLocaleString()}
          </p>
        </div>
        <div className="h-6 w-px bg-secondary-200/50 dark:bg-white/10" />
        <div className="text-right">
          <p className="text-[8px] font-bold uppercase text-secondary-400 tracking-wider mb-0.5">Presupuesto</p>
          <p className={`text-xs font-black ${monthlyIncome > 0 ? 'text-emerald-500' : 'text-secondary-400'}`}>
            {monthlyIncome > 0 ? `$${monthlyIncome.toLocaleString()}` : "---"}
          </p>
        </div>
      </div>

    </div>
  );
};

export default HealthScore;