import { useMemo } from "react";
import Card from "../common/Card";
import { Frown, Meh, Smile, Star, Brain, Zap, Target } from "lucide-react";

// ✅ IDs corregidos para coincidir con el Modal (excited en lugar de stressed)
const EMOTION_ORDER = ["sad", "neutral", "happy", "excited"];

const EMOTION_MAP = {
  sad: { label: "Triste", icon: Frown, color: "text-blue-500" },
  neutral: { label: "Normal", icon: Meh, color: "text-gray-500" },
  happy: { label: "Feliz", icon: Smile, color: "text-emerald-500" },
  excited: { label: "Emocionado", icon: Star, color: "text-amber-500" }, // <--- Corregido
};

const PURCHASE_MAP = {
  need: { label: "Necesidad", icon: Target, color: "text-emerald-500" },
  planned: { label: "Planificado", icon: Brain, color: "text-indigo-500" },
  impulse: { label: "Impulso", icon: Zap, color: "text-amber-500" },
};

const PsychologyDashboard = ({ expenses = [] }) => {
  const analysis = useMemo(() => {
    // Filtramos solo gastos que tengan ambos datos psicológicos
    const valid = expenses.filter((e) => e.emotion && e.purchaseType);
    if (!valid.length) return null;

    const emotionCount = {};
    const purchaseCount = {};

    valid.forEach((e) => {
      emotionCount[e.emotion] = (emotionCount[e.emotion] || 0) + 1;
      purchaseCount[e.purchaseType] = (purchaseCount[e.purchaseType] || 0) + 1;
    });

    const topEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];
    const topPurchase = Object.entries(purchaseCount).sort((a, b) => b[1] - a[1])[0];

    return { emotionCount, purchaseCount, topEmotion, topPurchase, total: valid.length };
  }, [expenses]);

  if (!analysis) {
    return (
      <Card title="Psicología de tus gastos">
        <p className="text-sm text-secondary-400 font-semibold text-center py-10 uppercase tracking-widest">
          Aún no hay análisis psicológico suficiente
        </p>
      </Card>
    );
  }

  const TopEmotionIcon = EMOTION_MAP[analysis.topEmotion[0]]?.icon || Meh;
  const TopPurchaseIcon = PURCHASE_MAP[analysis.topPurchase[0]]?.icon || Brain;

  return (
    <Card title="Psicología de tus gastos">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-3xl bg-secondary-50 dark:bg-secondary-800">
            <div className={`p-3 rounded-2xl bg-white dark:bg-secondary-900 shadow-sm ${EMOTION_MAP[analysis.topEmotion[0]]?.color}`}>
                <TopEmotionIcon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-secondary-400">Emoción dominante</p>
              <p className="font-black text-lg uppercase tracking-tighter">{EMOTION_MAP[analysis.topEmotion[0]]?.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-3xl bg-secondary-50 dark:bg-secondary-800">
            <div className={`p-3 rounded-2xl bg-white dark:bg-secondary-900 shadow-sm ${PURCHASE_MAP[analysis.topPurchase[0]]?.color}`}>
                <TopPurchaseIcon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-secondary-400">Tipo de compra</p>
              <p className="font-black text-lg uppercase tracking-tighter">{PURCHASE_MAP[analysis.topPurchase[0]]?.label}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 px-2">
          <div>
            <p className="text-[9px] font-black uppercase text-secondary-400 mb-4 tracking-widest">Desglose Emocional</p>
            <div className="space-y-3">
              {EMOTION_ORDER.map((k) => {
                const item = EMOTION_MAP[k];
                const Icon = item.icon;
                const count = analysis.emotionCount[k] || 0;
                return (
                  <div key={k} className="flex justify-between items-center text-[11px] font-black uppercase">
                    <span className="flex items-center gap-2">
                      <Icon size={14} className={item.color} />
                      {item.label}
                    </span>
                    <span className="bg-secondary-100 dark:bg-secondary-800 px-2 py-0.5 rounded-lg">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[9px] font-black uppercase text-secondary-400 mb-4 tracking-widest">Patrón de Consumo</p>
            <div className="space-y-3">
              {Object.entries(PURCHASE_MAP).map(([k, v]) => {
                const Icon = v.icon;
                const count = analysis.purchaseCount[k] || 0;
                return (
                  <div key={k} className="flex justify-between items-center text-[11px] font-black uppercase">
                    <span className="flex items-center gap-2">
                      <Icon size={14} className={v.color} />
                      {v.label}
                    </span>
                    <span className="bg-secondary-100 dark:bg-secondary-800 px-2 py-0.5 rounded-lg">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PsychologyDashboard;