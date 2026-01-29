import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';

export const getImpulseAnalysis = (expenses) => {
  const impulseStats = expenses.reduce((acc, exp) => {
    if (exp.isImpulse) {
      acc.totalImpulse += exp.amount;
      acc.count++;
      acc.emotions[exp.emotion] = (acc.emotions[exp.emotion] || 0) + exp.amount;
    }
    return acc;
  }, { totalImpulse: 0, count: 0, emotions: {} });

  const topTrigger = Object.entries(impulseStats.emotions)
    .sort(([, a], [, b]) => b - a)[0];

  return {
    ...impulseStats,
    mainTrigger: topTrigger ? topTrigger[0] : null
  };
};

export const predictNextMonthExpense = (expenses) => {
  if (expenses.length === 0) return 0;

  // Agrupar por mes para obtener promedios
  const monthlyTotals = expenses.reduce((acc, exp) => {
    const monthKey = format(new Date(exp.date), 'yyyy-MM');
    acc[monthKey] = (acc[monthKey] || 0) + exp.amount;
    return acc;
  }, {});

  const totals = Object.values(monthlyTotals);
  const average = totals.reduce((a, b) => a + b, 0) / totals.length;
  
  // Factor de tendencia simple (último mes vs promedio)
  const lastMonth = totals[totals.length - 1] || 0;
  return (average + lastMonth) / 2;
};