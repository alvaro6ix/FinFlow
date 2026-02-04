import React from "react";
import Card from "../common/Card";

const HealthScore = ({ spent, budget }) => {
  // Cálculo del Score: 100 si no ha gastado nada, disminuye según el % del presupuesto
  let score = 100;
  if (budget > 0) {
    const percentUsed = (spent / budget) * 100;
    score = Math.max(0, Math.min(100, Math.round(100 - percentUsed)));
  } else if (spent > 0) {
    // Si no hay presupuesto, bajamos puntos por cada $1000 gastados como penalización base
    score = Math.max(10, 100 - Math.floor(spent / 1000) * 5);
  }

  const getColor = (s) => {
    if (s >= 70) return "#10b981"; // Verde
    if (s >= 40) return "#f59e0b"; // Amarillo
    return "#ef4444"; // Rojo
  };

  const scoreColor = getColor(score);
  const circumference = 2 * Math.PI * 35; // Radio 35
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="flex flex-col items-center justify-center p-6 bg-white dark:bg-secondary-900 border-none shadow-xl rounded-[2.5rem] h-full">
      <p className="text-[9px] font-black uppercase text-secondary-400 tracking-[0.2em] mb-4">Salud Financiera</p>
      
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Fondo */}
          <circle
            cx="64" cy="64" r="35"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-secondary-100 dark:text-secondary-800"
          />
          {/* Progreso */}
          <circle
            cx="64" cy="64" r="35"
            stroke={scoreColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-secondary-900 dark:text-white leading-none">
            {score}
          </span>
          <span className="text-[7px] font-bold uppercase text-secondary-400">Puntos</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[10px] font-black uppercase px-3 py-1 rounded-full inline-block" 
           style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}>
          {score >= 70 ? "Excelente" : score >= 40 ? "Precaución" : "Crítico"}
        </p>
      </div>
    </Card>
  );
};

export default HealthScore;