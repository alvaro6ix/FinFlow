import { useGoalStore } from '../stores/goalStore';
import { useAuthStore } from '../stores/authStore';

const useGoals = () => {
  const {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    loadGoals,
  } = useGoalStore();

  const { user } = useAuthStore();

  const addNewGoal = async (goalData) => {
    if (!user) return { success: false, error: 'No autenticado' };
    return await addGoal(goalData, user.uid);
  };

  const loadUserGoals = async () => {
    if (!user) return { success: false, error: 'No autenticado' };
    return await loadGoals(user.uid);
  };

  return {
    goals,
    loading,
    error,
    addGoal: addNewGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    loadGoals: loadUserGoals,
  };
};

export default useGoals;