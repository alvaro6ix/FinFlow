export const checkAchievements = (expenses, budgets, goals) => {
  const achievements = [];
  const now = new Date();

  // 1. Logro: Primer Gasto
  if (expenses.length >= 1) {
    achievements.push({ id: 'first_expense', title: 'Primer paso', icon: '🎯', desc: 'Registraste tu primer gasto' });
  }

  // 2. Logro: Racha de Registro (Días consecutivos)
  const dates = [...new Set(expenses.map(e => new Date(e.date).toDateString()))];
  if (dates.length >= 7) {
    achievements.push({ id: 'streak_7', title: 'Constancia', icon: '🔥', desc: '7 días seguidos registrando gastos' });
  }

  // 3. Logro: Meta Completada
  if (goals.some(g => g.completed)) {
    achievements.push({ id: 'goal_met', title: 'Visionario', icon: '🏆', desc: 'Completaste tu primera meta de ahorro' });
  }

  // 4. Logro: Disciplina Presupuestaria
  const monthBudgets = budgets.length;
  const keptBudgets = budgets.filter(b => {
    const spent = expenses.filter(e => e.categoryId === b.categoryId).reduce((s, e) => s + e.amount, 0);
    return spent <= b.amount;
  }).length;

  if (monthBudgets > 0 && keptBudgets === monthBudgets) {
    achievements.push({ id: 'budget_master', title: 'Maestro del Control', icon: '🛡️', desc: 'Respetaste todos tus presupuestos este mes' });
  }

  return achievements;
};