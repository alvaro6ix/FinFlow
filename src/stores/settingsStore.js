import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      currency: 'MXN',
      language: 'es',
      darkMode: 'auto',
      fiscalMonthStart: 1, // Día que inicia el mes financiero
      
      setCurrency: (currency) => set({ currency }),
      setDarkMode: (mode) => {
        set({ darkMode: mode });
        if (mode === 'dark') document.documentElement.classList.add('dark');
        else if (mode === 'light') document.documentElement.classList.remove('dark');
      },
      setLanguage: (language) => set({ language }),
    }),
    { name: 'finflow-settings' }
  )
);