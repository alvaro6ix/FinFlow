import { useEffect } from 'react';
import { useBudgetStore } from '../stores/budgetStore';

/**
 * Hook personalizado para gestión de presupuestos
 * Proporciona funcionalidades completas del store de presupuestos
 */
const useBudgets = () => {
  const {
    budgets,
    alerts,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    updateBudgetSpent,
    addAlert,
    markAlertAsRead,
    deleteAlert,
    clearAllAlerts,
    isDateInPeriod,
    getDaysRemaining,
    resetPeriodSpending,
    getActiveBudgets,
    getExceededBudgets,
    getUnreadAlerts,
    createSmartBudget,
    getBudgetSuggestions,
    adjustBudgetsByIncome,
  } = useBudgetStore();

  // Reset spending for expired periods on mount
  useEffect(() => {
    resetPeriodSpending();
  }, []);

  // Calculate total budget across all active budgets
  const getTotalBudget = () => {
    return budgets
      .filter((b) => b.isActive && b.period === 'monthly')
      .reduce((sum, budget) => sum + budget.amount, 0);
  };

  // Calculate total spent across all active budgets
  const getTotalSpent = () => {
    return budgets
      .filter((b) => b.isActive && b.period === 'monthly')
      .reduce((sum, budget) => sum + (budget.spent || 0), 0);
  };

  // Get overall budget health percentage
  const getOverallHealth = () => {
    const total = getTotalBudget();
    const spent = getTotalSpent();
    return total > 0 ? ((total - spent) / total) * 100 : 100;
  };

  // Get budgets by status
  const getBudgetsByStatus = () => {
    const activeBudgets = getActiveBudgets();

    const healthy = activeBudgets.filter((b) => {
      const percentage = (b.spent / b.amount) * 100;
      return percentage < b.alertThreshold;
    });

    const warning = activeBudgets.filter((b) => {
      const percentage = (b.spent / b.amount) * 100;
      return percentage >= b.alertThreshold && percentage < 100;
    });

    const exceeded = getExceededBudgets();

    return { healthy, warning, exceeded };
  };

  // Get budget by category
  const getBudgetByCategory = (categoryId) => {
    return budgets.find((b) => b.categoryId === categoryId && b.isActive);
  };

  // Check if category has active budget
  const hasBudget = (categoryId) => {
    return budgets.some((b) => b.categoryId === categoryId && b.isActive);
  };

  // Get remaining amount for category
  const getCategoryRemaining = (categoryId) => {
    const budget = getBudgetByCategory(categoryId);
    if (!budget) return null;
    return budget.amount - (budget.spent || 0);
  };

  // Get percentage used for category
  const getCategoryPercentage = (categoryId) => {
    const budget = getBudgetByCategory(categoryId);
    if (!budget) return null;
    return ((budget.spent || 0) / budget.amount) * 100;
  };

  // Check if expense would exceed budget
  const wouldExceedBudget = (categoryId, amount) => {
    const budget = getBudgetByCategory(categoryId);
    if (!budget) return false;
    return (budget.spent || 0) + amount > budget.amount;
  };

  // Get suggested daily spending
  const getSuggestedDailySpending = (budgetId) => {
    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return null;

    const remaining = budget.amount - (budget.spent || 0);
    const daysLeft = getDaysRemaining(budget);

    if (daysLeft <= 0 || remaining <= 0) return 0;

    return remaining / daysLeft;
  };

  // Apply 50/30/20 rule
  const apply503020Rule = (monthlyIncome, categories) => {
    return createSmartBudget(monthlyIncome, categories);
  };

  // Get budget statistics
  const getBudgetStats = () => {
    const activeBudgets = getActiveBudgets();
    const { healthy, warning, exceeded } = getBudgetsByStatus();

    return {
      total: budgets.length,
      active: activeBudgets.length,
      inactive: budgets.length - activeBudgets.length,
      healthy: healthy.length,
      warning: warning.length,
      exceeded: exceeded.length,
      totalBudget: getTotalBudget(),
      totalSpent: getTotalSpent(),
      overallHealth: getOverallHealth(),
      unreadAlerts: getUnreadAlerts().length,
    };
  };

  // Get budget progress for dashboard
  const getBudgetProgress = () => {
    return budgets
      .filter((b) => b.isActive)
      .map((budget) => ({
        id: budget.id,
        category: budget.categoryName,
        percentage: ((budget.spent || 0) / budget.amount) * 100,
        spent: budget.spent || 0,
        total: budget.amount,
        remaining: budget.amount - (budget.spent || 0),
        daysLeft: getDaysRemaining(budget),
        status:
          (budget.spent || 0) >= budget.amount
            ? 'exceeded'
            : ((budget.spent || 0) / budget.amount) * 100 >= budget.alertThreshold
            ? 'warning'
            : 'healthy',
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  // Export budget data for reports
  const exportBudgetData = () => {
    return budgets.map((budget) => ({
      categoria: budget.categoryName,
      presupuesto: budget.amount,
      gastado: budget.spent || 0,
      disponible: budget.amount - (budget.spent || 0),
      porcentaje: (((budget.spent || 0) / budget.amount) * 100).toFixed(2) + '%',
      periodo: budget.period,
      fechaInicio: new Date(budget.startDate).toLocaleDateString('es-MX'),
      diasRestantes: getDaysRemaining(budget),
      estado: budget.isActive ? 'Activo' : 'Pausado',
    }));
  };

  return {
    // State
    budgets,
    alerts,
    loading,
    error,

    // CRUD operations
    createBudget,
    updateBudget,
    deleteBudget,
    updateBudgetSpent,

    // Alert operations
    addAlert,
    markAlertAsRead,
    deleteAlert,
    clearAllAlerts,
    getUnreadAlerts,

    // Budget queries
    getActiveBudgets,
    getExceededBudgets,
    getBudgetsByStatus,
    getBudgetByCategory,
    hasBudget,
    getCategoryRemaining,
    getCategoryPercentage,
    wouldExceedBudget,

    // Calculations
    getDaysRemaining,
    getSuggestedDailySpending,
    getTotalBudget,
    getTotalSpent,
    getOverallHealth,
    getBudgetStats,
    getBudgetProgress,

    // Smart features
    createSmartBudget,
    apply503020Rule,
    getBudgetSuggestions,
    adjustBudgetsByIncome,

    // Utilities
    isDateInPeriod,
    resetPeriodSpending,
    exportBudgetData,
  };
};

export default useBudgets;