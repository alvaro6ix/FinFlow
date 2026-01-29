export const APP_CONFIG = {
  name: 'FinFlow',
  version: '1.0.0',
  description: 'Tu asistente financiero personal',
  author: 'FinFlow Team',
  
  limits: {
    maxFileSize: 5 * 1024 * 1024,
    maxExpenseAmount: 1000000,
    minExpenseAmount: 0.01,
    maxDescriptionLength: 200,
    maxCategoryNameLength: 50,
  },

  date: {
    format: 'DD/MM/YYYY',
    locale: 'es-MX',
  },

  notifications: {
    duration: 5000,
    position: 'top-right',
  },

  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },

  storageKeys: {
    theme: 'finflow-theme',
    currency: 'finflow-currency',
    language: 'finflow-language',
    onboarding: 'finflow-onboarding-complete',
  },

  chartColors: [
    '#f59e0b',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#10b981',
    '#f43f5e',
    '#06b6d4',
    '#f97316',
  ],

  firebase: {
    collections: {
      expenses: 'expenses',
      budgets: 'budgets',
      goals: 'goals',
      users: 'users',
      categories: 'categories',
    },
  },
};

export default APP_CONFIG;