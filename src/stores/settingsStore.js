import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      // Preferencias de usuario
      currency: 'MXN',
      language: 'es',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      
      // Notificaciones
      notifications: {
        enabled: true,
        dailyReminder: true,
        dailyReminderTime: '20:00',
        budgetAlerts: true,
        budgetThreshold: 80,
        recurringReminders: true,
        goalAlerts: true,
      },

      // Categorías personalizadas
      customCategories: [],

      // Onboarding
      hasCompletedOnboarding: false,
      hasSeenTour: false,

      // Configuración de presupuestos
      budgetMethod: 'manual',

      // Acciones
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setTheme: (theme) => set({ theme }),
      
      updateNotificationSettings: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),

      addCustomCategory: (category) =>
        set((state) => ({
          customCategories: [...state.customCategories, category],
        })),

      updateCustomCategory: (id, updates) =>
        set((state) => ({
          customCategories: state.customCategories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        })),

      deleteCustomCategory: (id) =>
        set((state) => ({
          customCategories: state.customCategories.filter((cat) => cat.id !== id),
        })),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      completeTour: () => set({ hasSeenTour: true }),
      
      setBudgetMethod: (method) => set({ budgetMethod: method }),
    }),
    {
      name: 'settings-storage',
    }
  )
);

export { useSettingsStore };