import { useMemo } from "react";
import Card from "../common/Card";
import { Frown, Meh, Smile, Star, Brain, Zap, Target, AlertTriangle } from "lucide-react";

// ✅ Configuración visual sincronizada con ExpenseForm
const EMOTION_MAP = {
  sad: { label: "Triste", icon: Frown, color: "text-blue-500", bg: "bg-blue-500" },
  stressed: { label: "Estresado", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500" }, // Faltaba este
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

    // 1. Sumar montos reales ($)
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

    // 2. Encontrar dominantes por dinero gastado
    const getDominant = (stats, map) => {
      const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
      if (sorted.length === 0) return null;
      
      const key = sorted[0][0];
      const amount = sorted[0][1];
      const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      
      // Si la clave no está en el mapa (ej. datos antiguos), no tronar la app
      if (!map[key]) return null;

      return { ...map[key], amount, percentage };
    };

    const domEmo = getDominant(emoStats, EMOTION_MAP);
    const domType = getDominant(typeStats, PURCHASE_MAP);

    // 3. Generar frase inteligente
    let smartPhrase = "Registra más gastos para obtener un análisis.";
    if (domType) {
      if (domType.label === "Impulso" && domType.percentage > 40) {
        smartPhrase = `⚠️ Cuidado: El ${Math.round(domType.percentage)}% de tu dinero se está yendo en compras impulsivas.`;
      } else if (domType.label === "Necesidad" && domType.percentage > 50) {
        smartPhrase = `✅ Muy bien: El ${Math.round(domType.percentage)}% de tus gastos cubren necesidades reales.`;
      } else {
        smartPhrase = `💡 Tu hábito principal es "${domType.label}", representa el ${Math.round(domType.percentage)}% de tu flujo.`;
      }
    }

    return { totalSpent, emoStats, typeStats, domEmo, domType, smartPhrase };
  }, [expenses]);

  return (
    <Card className="p-6 bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xs font-black uppercase text-secondary-900 dark:text-white tracking-[0.2em]">
            Psicología del Gasto
          </h3>
          <p className="text-[10px] font-bold text-secondary-500 mt-1">
            Basado en ${analysis.totalSpent.toLocaleString()}
          </p>
        </div>

        {/* ALERTA INTELIGENTE */}
        {analysis.domType && (
          <div className="flex items-center gap-3 px-4 py-2 bg-white/60 dark:bg-black/20 rounded-2xl border border-white/20 backdrop-blur-md shadow-sm">
            <Brain size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-[9px] font-black text-secondary-700 dark:text-secondary-200 uppercase leading-tight">
              {analysis.smartPhrase}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        
        {/* COLUMNA 1: EMOCIONES ($) */}
        <div>
          <p className="text-[9px] font-black uppercase text-secondary-400 mb-3 tracking-widest pl-1 border-b border-secondary-100 dark:border-white/10 pb-2">
            Gasto por Emoción
          </p>
          <div className="space-y-4">
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
                      <span className="text-[8px] font-bold text-secondary-400">
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

        {/* COLUMNA 2: TIPO DE COMPRA ($) */}
        <div>
          <p className="text-[9px] font-black uppercase text-secondary-400 mb-3 tracking-widest pl-1 border-b border-secondary-100 dark:border-white/10 pb-2">
            Intención de Compra
          </p>
          <div className="space-y-4">
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
                      <span className="text-[8px] font-bold text-secondary-400">
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