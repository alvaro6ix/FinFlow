export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected routes
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  BUDGETS: '/budgets',
  GOALS: '/goals',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Default redirect
  DEFAULT: '/dashboard',
};

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.EXPENSES,
  ROUTES.BUDGETS,
  ROUTES.GOALS,
  ROUTES.ANALYTICS,
  ROUTES.SETTINGS,
  ROUTES.PROFILE,
];