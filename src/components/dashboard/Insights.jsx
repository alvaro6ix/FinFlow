import { useExpenseStore } from "../../stores/expenseStore";
import { generatePsychologyInsights } from "../../utils/psychologyInsights";
import { AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";

const ICONS = {
  warning: AlertTriangle,
  info: Lightbulb,
  success: CheckCircle
};

const COLORS = {
  warning: "bg-red-50 text-red-700 border-red-200",
  info: "bg-amber-50 text-amber-700 border-amber-200",
  success: "bg-green-50 text-green-700 border-green-200"
};

export default function Insights() {
  const expenses = useExpenseStore(s => s.expenses);
  const insights = generatePsychologyInsights(expenses);

  if (!insights.length) return null;

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const Icon = ICONS[insight.type];
        return (
          <div
            key={i}
            className={`flex gap-3 p-4 rounded-2xl border ${COLORS[insight.type]}`}
          >
            <Icon size={20} className="mt-1" />
            <div>
              <p className="font-black text-sm">{insight.title}</p>
              <p className="text-xs opacity-80">{insight.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
