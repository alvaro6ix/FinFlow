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
  orderBy,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      loading: false,
      error: null,
      filters: {
        startDate: null,
        endDate: null,
        categories: [],
        paymentMethods: [],
        minAmount: null,
        maxAmount: null,
        searchTerm: '',
      },
      sortBy: 'date',
      sortOrder: 'desc',

      // Agregar gasto
      addExpense: async (expense, userId) => {
        set({ loading: true, error: null });
        try {
          const expenseData = {
            ...expense,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            synced: navigator.onLine,
          };

          if (navigator.onLine) {
            const docRef = await addDoc(collection(db, 'expenses'), expenseData);
            expenseData.id = docRef.id;
            expenseData.synced = true;
          } else {
            expenseData.id = `temp-${Date.now()}`;
            expenseData.synced = false;
          }

          set((state) => ({
            expenses: [expenseData, ...state.expenses],
            loading: false,
          }));

          return { success: true, id: expenseData.id };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Actualizar gasto
      updateExpense: async (id, updates) => {
        set({ loading: true, error: null });
        try {
          const updatedData = {
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          if (navigator.onLine && !id.startsWith('temp-')) {
            const expenseRef = doc(db, 'expenses', id);
            await updateDoc(expenseRef, updatedData);
          }

          set((state) => ({
            expenses: state.expenses.map((exp) =>
              exp.id === id ? { ...exp, ...updatedData } : exp
            ),
            loading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Eliminar gasto
      deleteExpense: async (id) => {
        set({ loading: true, error: null });
        try {
          if (navigator.onLine && !id.startsWith('temp-')) {
            const expenseRef = doc(db, 'expenses', id);
            await deleteDoc(expenseRef);
          }

          set((state) => ({
            expenses: state.expenses.filter((exp) => exp.id !== id),
            loading: false,
          }));

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Cargar gastos del usuario
      loadExpenses: async (userId) => {
        set({ loading: true, error: null });
        try {
          const q = query(
            collection(db, 'expenses'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          );

          const querySnapshot = await getDocs(q);
          const expenses = [];
          querySnapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
          });

          set({ expenses, loading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Suscribirse a cambios en tiempo real
      subscribeToExpenses: (userId) => {
        const q = query(
          collection(db, 'expenses'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
          const expenses = [];
          snapshot.forEach((doc) => {
            expenses.push({ id: doc.id, ...doc.data() });
          });
          set({ expenses });
        });
      },

      // Sincronizar gastos pendientes
      syncPendingExpenses: async (userId) => {
        const { expenses } = get();
        const pendingExpenses = expenses.filter(
          (exp) => !exp.synced && exp.id.startsWith('temp-')
        );

        for (const expense of pendingExpenses) {
          try {
            const { id, ...expenseData } = expense;
            const docRef = await addDoc(collection(db, 'expenses'), {
              ...expenseData,
              synced: true,
            });

            set((state) => ({
              expenses: state.expenses.map((exp) =>
                exp.id === id
                  ? { ...exp, id: docRef.id, synced: true }
                  : exp
              ),
            }));
          } catch (error) {
            console.error('Error syncing expense:', error);
          }
        }
      },

      // Aplicar filtros
      setFilters: (filters) => set({ filters }),

      // Cambiar ordenamiento
      setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),

      // Obtener gastos filtrados
      getFilteredExpenses: () => {
        const { expenses, filters, sortBy, sortOrder } = get();
        let filtered = [...expenses];

        // Filtro por fecha
        if (filters.startDate) {
          filtered = filtered.filter(
            (exp) => new Date(exp.date) >= new Date(filters.startDate)
          );
        }
        if (filters.endDate) {
          filtered = filtered.filter(
            (exp) => new Date(exp.date) <= new Date(filters.endDate)
          );
        }

        // Filtro por categorías
        if (filters.categories.length > 0) {
          filtered = filtered.filter((exp) =>
            filters.categories.includes(exp.categoryId)
          );
        }

        // Filtro por métodos de pago
        if (filters.paymentMethods.length > 0) {
          filtered = filtered.filter((exp) =>
            filters.paymentMethods.includes(exp.paymentMethod)
          );
        }

        // Filtro por monto
        if (filters.minAmount !== null) {
          filtered = filtered.filter((exp) => exp.amount >= filters.minAmount);
        }
        if (filters.maxAmount !== null) {
          filtered = filtered.filter((exp) => exp.amount <= filters.maxAmount);
        }

        // Búsqueda por texto
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filtered = filtered.filter(
            (exp) =>
              exp.description?.toLowerCase().includes(term) ||
              exp.tags?.some((tag) => tag.toLowerCase().includes(term))
          );
        }

        // Ordenamiento
        filtered.sort((a, b) => {
          const aValue = sortBy === 'date' ? new Date(a.date) : a.amount;
          const bValue = sortBy === 'date' ? new Date(b.date) : b.amount;

          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        return filtered;
      },

      // Limpiar filtros
      clearFilters: () =>
        set({
          filters: {
            startDate: null,
            endDate: null,
            categories: [],
            paymentMethods: [],
            minAmount: null,
            maxAmount: null,
            searchTerm: '',
          },
        }),
    }),
    {
      name: 'expense-storage',
      partialize: (state) => ({
        expenses: state.expenses,
        filters: state.filters,
      }),
    }
  )
);

export { useExpenseStore };