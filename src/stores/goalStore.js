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

const useGoalStore = create(
  persist(
    (set, get) => ({
      goals: [],
      loading: false,
      error: null,

      // Agregar meta
      addGoal: async (goal, userId) => {
        set({ loading: true, error: null });
        try {
          const goalData = {
            ...goal,
            userId,
            currentAmount: goal.currentAmount || 0,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          if (navigator.onLine) {
            const docRef = await addDoc(collection(db, 'goals'), goalData);
            goalData.id = docRef.id;
          } else {
            goalData.id = `temp-${Date.now()}`;
          }

          set((state) => ({
            goals: [...state.goals, goalData],
            loading: false,
          }));

          return { success: true, id: goalData.id };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Actualizar meta
      updateGoal: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const updatedData = {
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          if (navigator.onLine && !id.startsWith('temp-')) {
            const goalRef = doc(db, 'goals', id);
            await updateDoc(goalRef, updatedData);
          }

          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === id ? { ...goal, ...updatedData } : goal
            ),
            loading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Agregar contribución a meta
      addContribution: async (id, amount) => {
        const goal = get().goals.find((g) => g.id === id);
        if (!goal) return { success: false, error: 'Meta no encontrada' };

        const newAmount = goal.currentAmount + amount;
        const completed = newAmount >= goal.targetAmount;

        return await get().updateGoal(id, {
          currentAmount: newAmount,
          completed,
          completedAt: completed ? new Date().toISOString() : null,
        });
      },

      // Eliminar meta
      deleteGoal: async (id) => {
        set({ loading: true, error: null });
        try {
          if (navigator.onLine && !id.startsWith('temp-')) {
            const goalRef = doc(db, 'goals', id);
            await deleteDoc(goalRef);
          }

          set((state) => ({
            goals: state.goals.filter((goal) => goal.id !== id),
            loading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Cargar metas
      loadGoals: async (userId) => {
        set({ loading: true, error: null });
        try {
          const q = query(
            collection(db, 'goals'),
            where('userId', '==', userId)
          );

          const querySnapshot = await getDocs(q);
          const goals = [];
          querySnapshot.forEach((doc) => {
            goals.push({ id: doc.id, ...doc.data() });
          });

          set({ goals, loading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'goal-storage',
      partialize: (state) => ({ goals: state.goals }),
    }
  )
);

export { useGoalStore };