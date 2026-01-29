import { useAuthStore } from '../stores/authStore';

const useAuth = () => {
  const {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile,
    changePassword,
    deleteAccount,
    clearError,
  } = useAuthStore();

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile,
    changePassword,
    deleteAccount,
    clearError,
  };
};

export default useAuth;