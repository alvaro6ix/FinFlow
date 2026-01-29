import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const useBudgetStore = create(
  persist(
    (set, get) => ({
      budgets: [],
      loading: false,
      error: null,

      // Agregar presupuesto
      addBudget: async (budget, userId) => {
        set({ loading: true, error: null });
        try {
          const budgetData = {
            ...budget,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          if (navigator.onLine) {
            const docRef = await addDoc(collection(db, 'budgets'), budgetData);
            budgetData.id = docRef.id;
          } else {
            budgetData.id = `temp-${Date.now()}`;
          }

          set((state) => ({
            budgets: [...state.budgets, budgetData],
            loading: false,
          }));

          return { success: true, id: budgetData.id };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Actualizar presupuesto
      updateBudget: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const updatedData = {
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          if (navigator.onLine && !id.startsWith('temp-')) {
            const budgetRef = doc(db, 'budgets', id);
            await updateDoc(budgetRef, updatedData);
          }

          set((state) => ({
            budgets: state.budgets.map((budget) =>
              budget.id === id ? { ...budget, ...updatedData } : budget
            ),
            loading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Eliminar presupuesto
      deleteBudget: async (id) => {
        set({ loading: true, error: null });
        try {
          if (navigator.onLine && !id.startsWith('temp-')) {
            const budgetRef = doc(db, 'budgets', id);
            await deleteDoc(budgetRef);
          }

          set((state) => ({
            budgets: state.budgets.filter((budget) => budget.id !== id),
            loading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Cargar presupuestos
      loadBudgets: async (userId) => {
        set({ loading: true, error: null });
        try {
          const q = query(
            collection(db, 'budgets'),
            where('userId', '==', userId)
          );

          const querySnapshot = await getDocs(q);
          const budgets = [];
          querySnapshot.forEach((doc) => {
            budgets.push({ id: doc.id, ...doc.data() });
          });

          set({ budgets, loading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'budget-storage',
      partialize: (state) => ({ budgets: state.budgets }),
    }
  )
);

export { useBudgetStore };