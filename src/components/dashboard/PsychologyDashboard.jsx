import { useMemo } from "react";
import Card from "../common/Card";
import { Frown, Meh, Smile, Star, Brain, Zap, Target, AlertTriangle, Crown } from "lucide-react";

// Configuración visual
const EMOTION_MAP = {
  sad: { label: "Triste", icon: Frown, color: "text-blue-500", bg: "bg-blue-500" },
  stressed: { label: "Estresado", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500" },
  neutral: { label: "Normal", icon: Meh, color: "text-gray-400", bg: "bg-gray-400" },
  happy: { label: "Feliz", icon: Smile, color: "text-emerald-500", bg: "bg-emerald-500" },
  excited: { label: "Emocionado", icon: Star, color: "text-amber-500", bg: "bg-amber-500" },
};

const PURCHASE_MAP = {
  need: { label: "Necesidad", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500" },
  planned: { label: "Planificado", icon: Brain, color: "text-indigo-500", bg: "bg-indigo-500" },
  impulse: { label: "Impulso", icon: Zap, color: "text-amber-500", bg: "bg-amber-500" },
};

const PsychologyDashboard = ({ expenses = [] }) => {
  const analysis = useMemo(() => {
    let totalSpent = 0;
    const emoStats = {};
    const typeStats = {};

    expenses.forEach(e => {
      const amount = Number(e.amount) || 0;
      totalSpent += amount;

      if (e.emotion) {
        emoStats[e.emotion] = (emoStats[e.emotion] || 0) + amount;
      }
      if (e.purchaseType) {
        typeStats[e.purchaseType] = (typeStats[e.purchaseType] || 0) + amount;
      }
    });

    const getDominant = (stats, map) => {
      const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
      if (sorted.length === 0) return null;
      
      const key = sorted[0][0];
      const amount = sorted[0][1];
      const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      
      if (!map[key]) return null;

      return { ...map[key], amount, percentage };
    };

    const domEmo = getDominant(emoStats, EMOTION_MAP);
    const domType = getDominant(typeStats, PURCHASE_MAP);

    let smartPhrase = "Registra más gastos para obtener un análisis.";
    if (domType) {
      if (domType.label === "Impulso" && domType.percentage > 40) {
        smartPhrase = `⚠️ Cuidado: El ${Math.round(domType.percentage)}% es gasto impulsivo.`;
      } else if (domType.label === "Necesidad" && domType.percentage > 50) {
        smartPhrase = `✅ Muy bien: El ${Math.round(domType.percentage)}% cubre necesidades.`;
      } else {
        smartPhrase = `💡 Tu hábito principal es "${domType.label}".`;
      }
    }

    return { totalSpent, emoStats, typeStats, domEmo, domType, smartPhrase };
  }, [expenses]);

  return (
    <Card className="p-5 sm:p-6 bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl overflow-hidden">
      
      {/* HEADER RESPONSIVE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-[10px] sm:text-xs font-black uppercase text-secondary-900 dark:text-white tracking-[0.2em]">
            Psicología del Gasto
          </h3>
          <p className="text-[9px] font-bold text-secondary-500 mt-1">
            Análisis de ${analysis.totalSpent.toLocaleString()}
          </p>
        </div>

        {analysis.domType && (
          <div className="flex items-start sm:items-center gap-3 px-4 py-3 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/20 backdrop-blur-md shadow-sm w-full sm:w-auto">
            <Brain size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-[9px] font-black text-secondary-700 dark:text-secondary-200 uppercase leading-tight">
              {analysis.smartPhrase}
            </span>
          </div>
        )}
      </div>

      {/* DOMINANTES RESPONSIVE (1 col en móvil, 2 en PC) */}
      {(analysis.domEmo || analysis.domType) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          
          {/* Dominante Emoción */}
          {analysis.domEmo && (
            <div className="relative p-4 rounded-3xl bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-transparent border border-white/30 overflow-hidden">
              <div className={`absolute right-[-10px] top-[-10px] opacity-10 ${analysis.domEmo.color}`}>
                <analysis.domEmo.icon size={80} />
              </div>
              <p className="text-[8px] sm:text-[9px] font-black uppercase text-secondary-400 tracking-widest mb-2">Emoción Dominante</p>
              <div className="flex items-center gap-3 relative z-10">
                <div className={`p-2 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-md ${analysis.domEmo.color}`}>
                  <analysis.domEmo.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-secondary-900 dark:text-white uppercase leading-none">
                    {analysis.domEmo.label}
                  </p>
                  <p className="text-[10px] font-bold text-secondary-500 mt-0.5">
                    {Math.round(analysis.domEmo.percentage)}% del total
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dominante Intención */}
          {analysis.domType && (
            <div className="relative p-4 rounded-3xl bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-transparent border border-white/30 overflow-hidden">
              <div className={`absolute right-[-10px] top-[-10px] opacity-10 ${analysis.domType.color}`}>
                <analysis.domType.icon size={80} />
              </div>
              <p className="text-[8px] sm:text-[9px] font-black uppercase text-secondary-400 tracking-widest mb-2">Gasto más recurrente</p>
              <div className="flex items-center gap-3 relative z-10">
                <div className={`p-2 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-md ${analysis.domType.color}`}>
                  <analysis.domType.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-secondary-900 dark:text-white uppercase leading-none">
                    {analysis.domType.label}
                  </p>
                  <p className="text-[10px] font-bold text-secondary-500 mt-0.5">
                    {Math.round(analysis.domType.percentage)}% del total
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LISTAS DETALLADAS (1 col móvil, 2 en PC) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        
        {/* COLUMNA 1: EMOCIONES */}
        <div>
          <p className="text-[9px] font-black uppercase text-secondary-400 mb-3 tracking-widest pl-1 border-b border-secondary-100 dark:border-white/10 pb-2">
            Desglose Emocional
          </p>
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(EMOTION_MAP).map(([key, config]) => {
              const amount = analysis.emoStats[key] || 0;
              if (amount === 0) return null;
              const percent = (amount / analysis.totalSpent) * 100;
              
              return (
                <div key={key} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-secondary-600 dark:text-secondary-300">
                      <config.icon size={14} className={config.color} />
                      {config.label}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-secondary-900 dark:text-white block">
                        {Math.round(percent)}%
                      </span>
                      <span className="text-[8px] font-bold text-secondary-400 hidden sm:inline">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-secondary-100/50 dark:bg-white/5 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full opacity-80 ${config.bg}`} 
                        style={{ width: `${percent}%` }} 
                     />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA 2: TIPO DE COMPRA */}
        <div>
          <p className="text-[9px] font-black uppercase text-secondary-400 mb-3 tracking-widest pl-1 border-b border-secondary-100 dark:border-white/10 pb-2">
            Intención de Compra
          </p>
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(PURCHASE_MAP).map(([key, config]) => {
              const amount = analysis.typeStats[key] || 0;
              if (amount === 0) return null;
              const percent = (amount / analysis.totalSpent) * 100;

              return (
                <div key={key} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-secondary-600 dark:text-secondary-300">
                      <config.icon size={14} className={config.color} />
                      {config.label}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-secondary-900 dark:text-white block">
                        {Math.round(percent)}%
                      </span>
                      <span className="text-[8px] font-bold text-secondary-400 hidden sm:inline">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-secondary-100/50 dark:bg-white/5 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full opacity-80 ${config.bg}`} 
                        style={{ width: `${percent}%` }} 
                     />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </Card>
  );
};

export default PsychologyDashboard;