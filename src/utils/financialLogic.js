import { startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

export const calculateFinancialHealth = (expenses, budgets, incomes = 0) => {
  const now = new Date();
  const currentMonthRange = { start: startOfMonth(now), end: endOfMonth(now) };
  
  // 1. Gastos vs Ingresos
  const monthExpenses = expenses.filter(e => isWithinInterval(new Date(e.date), currentMonthRange));
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // 2. Cumplimiento de Presupuesto
  let budgetScore = 100;
  if (budgets.length > 0) {
    const exceeded = budgets.filter(b => {
      const spentInCat = monthExpenses.filter(e => e.categoryId === b.categoryId).reduce((s, e) => s + e.amount, 0);
      return spentInCat > b.amount;
    }).length;
    budgetScore = Math.max(0, 100 - (exceeded * (100 / budgets.length)));
  }

  // 3. Score Final (Ponderado)
  const savingsRate = incomes > 0 ? ((incomes - totalSpent) / incomes) * 100 : 0;
  const healthScore = Math.round((budgetScore * 0.4) + (Math.min(100, Math.max(0, savingsRate + 50)) * 0.6));

  return {
    score: healthScore,
    totalSpent,
    savingsRate,
    status: healthScore > 70 ? 'success' : healthScore > 40 ? 'warning' : 'danger'
  };
};

export const generateInsights = (expenses, budgets, previousMonthExpenses) => {
  const insights = [];
  const now = new Date();
  const currentTotal = expenses.filter(e => isWithinInterval(new Date(e.date), { start: startOfMonth(now), end: endOfMonth(now) }))
                               .reduce((s, e) => s + e.amount, 0);

  if (currentTotal > previousMonthExpenses && previousMonthExpenses > 0) {
    insights.push({
      type: 'warning',
      text: `Has gastado un ${((currentTotal/previousMonthExpenses - 1)*100).toFixed(0)}% más que el mes pasado.`
    });
  }

  const impulseExpenses = expenses.filter(e => e.isImpulse).length;
  if (impulseExpenses > 3) {
    insights.push({
      type: 'info',
      text: `Detectamos ${impulseExpenses} gastos por impulso. ¡Respira antes de comprar! 🧘‍♂️`
    });
  }

  return insights;
};