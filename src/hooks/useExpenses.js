import { useExpenseStore } from '../stores/expenseStore';
import { useAuthStore } from '../stores/authStore';

const useExpenses = () => {
  const {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    loadExpenses,
    getFilteredExpenses,
    setFilters,
    clearFilters,
  } = useExpenseStore();

  const { user } = useAuthStore();

  const addNewExpense = async (expenseData) => {
    if (!user) return { success: false, error: 'No autenticado' };
    return await addExpense(expenseData, user.uid);
  };

  const loadUserExpenses = async () => {
    if (!user) return { success: false, error: 'No autenticado' };
    return await loadExpenses(user.uid);
  };

  return {
    expenses,
    loading,
    error,
    addExpense: addNewExpense,
    updateExpense,
    deleteExpense,
    loadExpenses: loadUserExpenses,
    getFilteredExpenses,
    setFilters,
    clearFilters,
  };
};

export default useExpenses;