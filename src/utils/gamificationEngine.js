import { isYesterday, isToday, differenceInDays, startOfMonth, isWithinInterval, endOfMonth } from 'date-fns';

export const checkAchievements = (expenses, budgets, goals) => {
  const achievements = [];
  const now = new Date();

  // 1. Logro: Primer Gasto
  if (expenses.length >= 1) {
    achievements.push({ id: 'first_expense', title: 'Primer paso', icon: '🎯', desc: 'Registraste tu primer gasto' });
  }

  // 2. Logro: Racha Real (Consecutiva)
  const sortedDates = [...new Set(expenses.map(e => new Date(e.date).toISOString().split('T')[0]))]
    .sort((a, b) => new Date(b) - new Date(a));

  let currentStreak = 0;
  if (sortedDates.length > 0) {
    const latest = new Date(sortedDates[0]);
    if (isToday(latest) || isYesterday(latest)) {
      currentStreak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const d1 = new Date(sortedDates[i]);
        const d2 = new Date(sortedDates[i + 1]);
        if (differenceInDays(d1, d2) === 1) currentStreak++;
        else break;
      }
    }
  }

  if (currentStreak >= 7) {
    achievements.push({ id: 'streak_7', title: 'Constancia', icon: '🔥', desc: `${currentStreak} días seguidos registrando` });
  }

  // 3. Logro: Meta Completada (Requerimiento 6.5)
  if (goals.some(g => g.completed)) {
    achievements.push({ id: 'goal_met', title: 'Visionario', icon: '🏆', desc: 'Completaste tu primera meta de ahorro' });
  }

  // 4. Logro: Maestro del Control (Mensual)
  const currentMonth = { start: startOfMonth(now), end: endOfMonth(now) };
  const monthBudgets = budgets.filter(b => b.active);
  const monthExpenses = expenses.filter(e => isWithinInterval(new Date(e.date), currentMonth));

  if (monthBudgets.length > 0) {
    const keptAll = monthBudgets.every(b => {
      const spent = monthExpenses.filter(e => e.categoryId === b.categoryId).reduce((s, e) => s + e.amount, 0);
      return spent <= b.amount;
    });
    if (keptAll && monthExpenses.length > 0) {
      achievements.push({ id: 'budget_master', title: 'Maestro del Control', icon: '🛡️', desc: 'Respetaste tus límites este mes' });
    }
  }

  return achievements;
};