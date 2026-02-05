import { useAuthStore } from '../stores/authStore';

const useAuth = () => {
  const store = useAuthStore();

  return {
    ...store,
    isAuthenticated: !!store.user,
  };
};

export default useAuth;