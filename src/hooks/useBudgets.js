import { useBudgetStore } from '../stores/budgetStore';
import { useAuthStore } from '../stores/authStore';

const useBudgets = () => {
  const {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    loadBudgets,
  } = useBudgetStore();

  const { user } = useAuthStore();

  const addNewBudget = async (budgetData) => {
    if (!user) return { success: false, error: 'No autenticado' };
    return await addBudget(budgetData, user.uid);
  };

  const loadUserBudgets = async () => {
    if (!user) return { success: false, error: 'No autenticado' };
    return await loadBudgets(user.uid);
  };

  return {
    budgets,
    loading,
    error,
    addBudget: addNewBudget,
    updateBudget,
    deleteBudget,
    loadBudgets: loadUserBudgets,
  };
};

export default useBudgets;