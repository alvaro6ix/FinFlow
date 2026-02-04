import { useMemo } from "react";
import Card from "../common/Card";
import { Frown, Meh, Smile, Star, Brain, Zap, Target } from "lucide-react";

const EMOTION_ORDER = ["sad", "neutral", "happy", "stressed"];

const EMOTION_MAP = {
  sad: { label: "Triste", icon: Frown, color: "text-blue-500" },
  neutral: { label: "Normal", icon: Meh, color: "text-gray-500" },
  happy: { label: "Feliz", icon: Smile, color: "text-emerald-500" },
  stressed: { label: "Eufórico", icon: Star, color: "text-amber-500" },
};

const PURCHASE_MAP = {
  need: { label: "Necesidad", icon: Target, color: "text-emerald-500" },
  planned: { label: "Planificado", icon: Brain, color: "text-indigo-500" },
  impulse: { label: "Impulso", icon: Zap, color: "text-amber-500" },
};

const PsychologyDashboard = ({ expenses = [] }) => {
  const analysis = useMemo(() => {
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
      <Card>
        <p className="text-sm text-secondary-400 font-semibold text-center">
          Aún no hay análisis psicológico suficiente
        </p>
      </Card>
    );
  }

  // Asignamos a constantes con Mayúscula para que JSX las reconozca como componentes
  const TopEmotionIcon = EMOTION_MAP[analysis.topEmotion[0]]?.icon || Meh;
  const TopPurchaseIcon = PURCHASE_MAP[analysis.topPurchase[0]]?.icon || Brain;

  return (
    <Card title="Psicología de tus gastos">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800">
            <TopEmotionIcon className={`w-8 h-8 ${EMOTION_MAP[analysis.topEmotion[0]]?.color}`} />
            <div>
              <p className="text-xs uppercase font-bold text-secondary-500">Emoción dominante</p>
              <p className="font-black text-lg">{EMOTION_MAP[analysis.topEmotion[0]]?.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800">
            <TopPurchaseIcon className={`w-8 h-8 ${PURCHASE_MAP[analysis.topPurchase[0]]?.color}`} />
            <div>
              <p className="text-xs uppercase font-bold text-secondary-500">Tipo de compra</p>
              <p className="font-black text-lg">{PURCHASE_MAP[analysis.topPurchase[0]]?.label}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-secondary-500 mb-2">Emociones</p>
            <div className="space-y-2">
              {EMOTION_ORDER.map((k) => {
                const Icon = EMOTION_MAP[k].icon; // <--- CORRECCIÓN AQUÍ
                return (
                  <div key={k} className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${EMOTION_MAP[k].color}`} />
                      {EMOTION_MAP[k].label}
                    </span>
                    <span>{analysis.emotionCount[k] || 0}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-secondary-500 mb-2">Tipo de compra</p>
            <div className="space-y-2">
              {Object.entries(PURCHASE_MAP).map(([k, v]) => {
                const Icon = v.icon; // <--- CORRECCIÓN AQUÍ
                return (
                  <div key={k} className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${v.color}`} />
                      {v.label}
                    </span>
                    <span>{analysis.purchaseCount[k] || 0}</span>
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