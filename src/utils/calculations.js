// Calcular total de gastos
export const calculateTotal = (expenses) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

// Calcular promedio de gastos
export const calculateAverage = (expenses) => {
  if (expenses.length === 0) return 0;
  return calculateTotal(expenses) / expenses.length;
};

// Calcular porcentaje
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Calcular cambio porcentual
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Agrupar gastos por categoría
export const groupByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const categoryId = expense.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        categoryId,
        expenses: [],
        total: 0,
      };
    }
    acc[categoryId].expenses.push(expense);
    acc[categoryId].total += expense.amount;
    return acc;
  }, {});
};

// Agrupar gastos por fecha
export const groupByDate = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const date = expense.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = {
        date,
        expenses: [],
        total: 0,
      };
    }
    acc[date].expenses.push(expense);
    acc[date].total += expense.amount;
    return acc;
  }, {});
};

// Calcular proyección de gasto mensual
export const calculateMonthlyProjection = (expenses, currentDay, daysInMonth) => {
  const total = calculateTotal(expenses);
  if (currentDay === 0) return 0;
  return (total / currentDay) * daysInMonth;
};

// Calcular score de salud financiera
export const calculateHealthScore = (data) => {
  const {
    currentMonthExpenses = 0,
    previousMonthExpenses = 0,
    budget = 0,
    savings = 0,
  } = data;

  let score = 50;

  if (previousMonthExpenses > 0) {
    const change = ((previousMonthExpenses - currentMonthExpenses) / previousMonthExpenses) * 100;
    if (change > 0) {
      score += Math.min(change, 30);
    } else {
      score += Math.max(change, -30);
    }
  }

  if (budget > 0) {
    const budgetUsage = (currentMonthExpenses / budget) * 100;
    if (budgetUsage <= 80) {
      score += 30;
    } else if (budgetUsage <= 100) {
      score += 15;
    } else {
      score -= 20;
    }
  }

  if (savings > 0) {
    const savingsRate = (savings / (currentMonthExpenses + savings)) * 100;
    if (savingsRate >= 20) {
      score += 20;
    } else {
      score += savingsRate;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

// Calcular días hasta la meta
export const calculateDaysToGoal = (current, goal, monthlyContribution) => {
  if (monthlyContribution <= 0 || goal <= current) return 0;
  const remaining = goal - current;
  const months = Math.ceil(remaining / monthlyContribution);
  return months * 30;
};

// Detectar gastos anómalos
export const detectAnomalies = (expenses, threshold = 2) => {
  const amounts = expenses.map(e => e.amount);
  const average = calculateAverage(expenses);
  const stdDev = Math.sqrt(
    amounts.reduce((sum, amount) => sum + Math.pow(amount - average, 2), 0) / amounts.length
  );

  return expenses.filter(expense => {
    const zScore = Math.abs((expense.amount - average) / stdDev);
    return zScore > threshold;
  });
};