import React from "react";
import Card from "../common/Card";

const HealthScore = ({ spent, budget }) => {
  // Lógica de cálculo (sin cambios)
  let score = 100;
  if (budget > 0) {
    const percentUsed = (spent / budget) * 100;
    score = Math.max(0, Math.min(100, Math.round(100 - percentUsed)));
  } else if (spent > 0) {
    score = Math.max(10, 100 - Math.floor(spent / 1000) * 5);
  }

  const getColor = (s) => {
    if (s >= 70) return "#10b981"; // Verde Esmeralda
    if (s >= 40) return "#f59e0b"; // Ámbar
    return "#ef4444"; // Rojo
  };

  const scoreColor = getColor(score);
  const circumference = 2 * Math.PI * 35; 
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="h-full flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl">
      <p className="text-[9px] font-black uppercase text-secondary-500 dark:text-secondary-400 tracking-[0.2em] mb-4">
        Salud Financiera
      </p>
      
      <div className="relative flex items-center justify-center">
        {/* Sombra de neón detrás del gráfico */}
        <div className="absolute inset-0 blur-xl opacity-20 rounded-full" style={{ backgroundColor: scoreColor }} />
        
        <svg className="w-32 h-32 transform -rotate-90 relative z-10">
          {/* Fondo del track */}
          <circle
            cx="64" cy="64" r="35"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-secondary-200/50 dark:text-white/10"
          />
          {/* Progreso */}
          <circle
            cx="64" cy="64" r="35"
            stroke={scoreColor}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-md"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center z-20">
          <span className="text-3xl font-black text-secondary-900 dark:text-white leading-none tracking-tighter">
            {score}
          </span>
          <span className="text-[7px] font-bold uppercase text-secondary-400 tracking-widest">Puntos</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div 
          className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-sm"
          style={{ backgroundColor: `${scoreColor}20` }}
        >
          <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: scoreColor }}>
            {score >= 80 ? 'Excelente' : score >= 60 ? 'Estable' : 'Crítico'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default HealthScore;