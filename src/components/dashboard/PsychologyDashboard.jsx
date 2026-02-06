import { useMemo } from "react";
import Card from "../common/Card";
import { 
  Frown, Meh, Smile, Star, Brain, Zap, Target, AlertTriangle, 
  Crown, CheckCircle, Info
} from "lucide-react";

// Configuración visual
const EMOTION_MAP = {
  sad: { label: "Triste", icon: Frown, color: "text-blue-500", bg: "bg-blue-500", border: "border-blue-200" },
  stressed: { label: "Estresado", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500", border: "border-red-200" },
  neutral: { label: "Normal", icon: Meh, color: "text-gray-400", bg: "bg-gray-400", border: "border-gray-200" },
  happy: { label: "Feliz", icon: Smile, color: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-200" },
  excited: { label: "Emocionado", icon: Star, color: "text-amber-500", bg: "bg-amber-500", border: "border-amber-200" },
};

const PURCHASE_MAP = {
  need: { label: "Necesidad", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500", border: "border-emerald-200" },
  planned: { label: "Planificado", icon: Brain, color: "text-indigo-500", bg: "bg-indigo-500", border: "border-indigo-200" },
  impulse: { label: "Impulso", icon: Zap, color: "text-amber-500", bg: "bg-amber-500", border: "border-amber-200" },
};

const PsychologyDashboard = ({ expenses }) => {
  const analysis = useMemo(() => {
    if (!expenses || expenses.length === 0) return null;

    let totalSpent = 0;
    const emotions = {};
    const types = {};

    expenses.forEach((e) => {
      const amount = Number(e.amount);
      totalSpent += amount;

      if (e.emotion) emotions[e.emotion] = (emotions[e.emotion] || 0) + amount;
      if (e.purchaseType) types[e.purchaseType] = (types[e.purchaseType] || 0) + amount;
    });

    // 1. Calcular Emoción Dominante
    const topEmotionKey = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b, null);
    const topEmotionPercent = topEmotionKey ? (emotions[topEmotionKey] / totalSpent) * 100 : 0;
    const topEmotionData = topEmotionKey ? EMOTION_MAP[topEmotionKey] : null;

    // 2. Calcular Tipo de Gasto Dominante
    const topTypeKey = Object.keys(types).reduce((a, b) => types[a] > types[b] ? a : b, null);
    const topTypePercent = topTypeKey ? (types[topTypeKey] / totalSpent) * 100 : 0;
    const topTypeData = topTypeKey ? PURCHASE_MAP[topTypeKey] : null;

    // 3. CALCULAR INSIGHT PRINCIPAL (El mensaje que querías recuperar)
    const needPercent = types["need"] ? (types["need"] / totalSpent) * 100 : 0;
    const impulsePercent = types["impulse"] ? (types["impulse"] / totalSpent) * 100 : 0;

    let mainInsight = { 
      icon: Info, 
      text: "Tus gastos están diversificados.", 
      color: "text-secondary-500",
      bg: "bg-secondary-50 dark:bg-secondary-800 border-secondary-200" 
    };

    if (impulsePercent > 30) {
      mainInsight = {
        icon: AlertTriangle,
        text: `Cuidado: El ${Math.round(impulsePercent)}% son compras impulsivas.`,
        color: "text-amber-500",
        bg: "bg-amber-500/10 border-amber-500/30"
      };
    } else if (needPercent > 50) {
      mainInsight = {
        icon: CheckCircle,
        text: `Muy bien: El ${Math.round(needPercent)}% cubre necesidades.`,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10 border-emerald-500/30"
      };
    }

    return { totalSpent, emotions, types, topEmotionData, topEmotionPercent, topTypeData, topTypePercent, mainInsight };
  }, [expenses]);

  if (!analysis) return null;

  return (
    <Card className="bg-white/40 dark:bg-secondary-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 p-4 sm:p-6">
      
      {/* Título de Sección */}
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Crown className="text-[#FFD700]" size={18} />
        <h3 className="text-[10px] sm:text-xs font-black text-secondary-900 dark:text-white uppercase tracking-widest">
          Psicología del Gasto
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* === COLUMNA IZQUIERDA: RESUMEN === */}
        <div className="flex flex-col gap-4">
          
          {/* Total */}
          <div>
            <p className="text-[9px] font-black uppercase text-secondary-400 tracking-widest mb-1">
              Análisis Total
            </p>
            <p className="text-2xl sm:text-3xl font-black text-secondary-900 dark:text-white">
              ${analysis.totalSpent.toLocaleString()}
            </p>
          </div>

          {/* ✅ INSIGHT PRINCIPAL RECUPERADO */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${analysis.mainInsight.bg}`}>
            <analysis.mainInsight.icon size={20} className={`shrink-0 ${analysis.mainInsight.color}`} strokeWidth={2.5} />
            <p className={`text-xs font-bold ${analysis.mainInsight.color} leading-relaxed`}>
              {analysis.mainInsight.text}
            </p>
          </div>

          {/* Tarjetas Pequeñas (Dominantes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
            
            {/* Emoción Dominante */}
            {analysis.topEmotionData && (
              <div className={`p-3 rounded-2xl border bg-white/60 dark:bg-black/20 ${analysis.topEmotionData.border}`}>
                <p className="text-[9px] font-black uppercase text-secondary-400 mb-2">Estado de Ánimo</p>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white dark:bg-black/40`}>
                    <analysis.topEmotionData.icon size={18} className={analysis.topEmotionData.color} />
                  </div>
                  <div>
                    <p className={`text-xs font-black ${analysis.topEmotionData.color}`}>
                      {analysis.topEmotionData.label}
                    </p>
                    <p className="text-[9px] font-bold text-secondary-500">
                      {Math.round(analysis.topEmotionPercent)}% del total
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tipo de Gasto Dominante */}
            {analysis.topTypeData && (
              <div className={`p-3 rounded-2xl border bg-white/60 dark:bg-black/20 ${analysis.topTypeData.border}`}>
                <p className="text-[9px] font-black uppercase text-secondary-400 mb-2">Intención</p>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white dark:bg-black/40`}>
                    <analysis.topTypeData.icon size={18} className={analysis.topTypeData.color} />
                  </div>
                  <div>
                    <p className={`text-xs font-black ${analysis.topTypeData.color}`}>
                      {analysis.topTypeData.label}
                    </p>
                    <p className="text-[9px] font-bold text-secondary-500">
                      {Math.round(analysis.topTypePercent)}% del total
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === COLUMNA DERECHA: BARRAS DETALLADAS === */}
        <div className="space-y-6 pt-4 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-6">
          
          {/* POR EMOCIÓN */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase text-secondary-400 tracking-widest mb-2">Desglose Emocional</p>
            {Object.entries(EMOTION_MAP).map(([key, config]) => {
              const amount = analysis.emotions[key] || 0;
              if (amount === 0) return null;
              const percent = (amount / analysis.totalSpent) * 100;

              return (
                <div key={key} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-secondary-600 dark:text-secondary-300">
                      <config.icon size={12} className={config.color} />
                      {config.label}
                    </span>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-[9px] font-bold text-secondary-400 opacity-60">
                        ${amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-secondary-900 dark:text-white">
                        {Math.round(percent)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-secondary-100/50 dark:bg-white/5 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full opacity-80 ${config.bg} transition-all duration-1000`} 
                        style={{ width: `${percent}%` }} 
                     />
                  </div>
                </div>
              );
            })}
          </div>

          {/* POR TIPO DE COMPRA */}
          <div className="space-y-3 pt-4 border-t border-secondary-100 dark:border-white/5">
            <p className="text-[9px] font-black uppercase text-secondary-400 tracking-widest mb-2">Desglose por Tipo</p>
            {Object.entries(PURCHASE_MAP).map(([key, config]) => {
              const amount = analysis.types[key] || 0;
              if (amount === 0) return null;
              const percent = (amount / analysis.totalSpent) * 100;

              return (
                <div key={key} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase text-secondary-600 dark:text-secondary-300">
                      <config.icon size={12} className={config.color} />
                      {config.label}
                    </span>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-[9px] font-bold text-secondary-400 opacity-60">
                        ${amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-secondary-900 dark:text-white">
                        {Math.round(percent)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-secondary-100/50 dark:bg-white/5 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full opacity-80 ${config.bg} transition-all duration-1000`} 
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