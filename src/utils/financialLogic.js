import { startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

export const calculateFinancialHealth = (expenses, budgets, incomes = 0) => {
  const now = new Date();
  const currentMonthRange = { start: startOfMonth(now), end: endOfMonth(now) };
  
  const monthExpenses = expenses.filter(e => isWithinInterval(new Date(e.date), currentMonthRange));
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // 1. Cumplimiento de Presupuesto (40% del score)
  let budgetScore = 100;
  if (budgets.length > 0) {
    const exceeded = budgets.filter(b => {
      const spentInCat = monthExpenses.filter(e => e.categoryId === b.categoryId).reduce((s, e) => s + e.amount, 0);
      return spentInCat > b.amount;
    }).length;
    budgetScore = Math.max(0, 100 - (exceeded * (100 / budgets.length)));
  }

  // 2. Score de Ahorro/Ingresos (60% del score)
  const savingsRate = incomes > 0 ? ((incomes - totalSpent) / incomes) * 100 : 0;
  const savingsScore = Math.min(100, Math.max(0, savingsRate + 50));

  // 3. Penalizador Psicológico (Novedad: Reduce hasta 15 puntos por impulsos)
  const impulseCount = monthExpenses.filter(e => e.isImpulse).length;
  const impulsePenalty = Math.min(impulseCount * 3, 15);

  const healthScore = Math.round(((budgetScore * 0.4) + (savingsScore * 0.6)) - impulsePenalty);

  return {
    score: Math.max(0, healthScore),
    totalSpent,
    savingsRate,
    status: healthScore > 70 ? 'success' : healthScore > 40 ? 'warning' : 'danger'
  };
};

export const generateInsights = (expenses, budgets, previousMonthExpenses) => {
  const insights = [];
  const now = new Date();
  const currentMonthRange = { start: startOfMonth(now), end: endOfMonth(now) };
  
  const monthExpenses = expenses.filter(e => isWithinInterval(new Date(e.date), currentMonthRange));
  const currentTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);

  // Insight 1: Variación Mensual
  if (currentTotal > previousMonthExpenses && previousMonthExpenses > 0) {
    insights.push({
      type: 'warning',
      text: `Has gastado un ${((currentTotal/previousMonthExpenses - 1)*100).toFixed(0)}% más que el mes pasado.`
    });
  }

  // Insight 2: Gastos Hormiga (Requerimiento 4.1)
  const antExpenses = monthExpenses.filter(e => e.amount > 0 && e.amount < 50);
  const antTotal = antExpenses.reduce((s, e) => s + e.amount, 0);
  if (antExpenses.length >= 5) {
    insights.push({
      type: 'info',
      text: `Llevas ${antExpenses.length} "gastos hormiga" que suman $${antTotal.toFixed(2)}. ¡Cuidado con las pequeñas fugas!`
    });
  }

  // Insight 3: Análisis Psicológico (Requerimiento 7.8)
  const stressExpenses = monthExpenses.filter(e => e.emotion === 'stressed' || e.emotion === 'sad').length;
  if (stressExpenses > 2) {
    insights.push({
      type: 'danger',
      text: `Detectamos compras vinculadas a estrés o tristeza. Intenta esperar 24h antes de comprar cuando te sientas así.`
    });
  }

  // Insight 4: Presupuesto Crítico (Requerimiento 5.3)
  budgets.forEach(b => {
    const spentInCat = monthExpenses.filter(e => e.categoryId === b.categoryId).reduce((s, e) => s + e.amount, 0);
    const usage = (spentInCat / b.amount) * 100;
    if (usage >= 80 && usage < 100) {
      insights.push({
        type: 'warning',
        text: `Estás al ${usage.toFixed(0)}% de tu presupuesto en ${b.categoryName || 'una categoría'}.`
      });
    }
  });

  return insights;
};