export function generatePsychologyInsights(expenses = []) {
  if (!expenses.length) return [];

  const insights = [];

  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  const byPsychology = {};
  const byCategory = {};

  expenses.forEach(e => {
    byPsychology[e.psychology] = (byPsychology[e.psychology] || 0) + Number(e.amount);
    byCategory[e.category] = (byCategory[e.category] || 0) + Number(e.amount);
  });

  // Insight 1 — Impulso dominante
  if (byPsychology.impulse > total * 0.35) {
    insights.push({
      type: "warning",
      title: "Compras impulsivas altas",
      message: "Más del 35% de tus gastos fueron por impulso. Considera pausar antes de comprar."
    });
  }

  // Insight 2 — Gasto hormiga
  if (byPsychology.ant > total * 0.25) {
    insights.push({
      type: "info",
      title: "Gastos hormiga detectados",
      message: "Pequeños gastos están sumando una cantidad relevante este mes."
    });
  }

  // Insight 3 — Categoría dominante
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push({
      type: "success",
      title: "Categoría dominante",
      message: `La mayor parte de tu dinero se va en "${topCategory[0]}".`
    });
  }

  return insights;
}
