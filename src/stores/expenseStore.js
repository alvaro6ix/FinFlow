import { create } from 'zustand';
import { 
  collection, addDoc, query, where, orderBy, onSnapshot, 
  serverTimestamp, deleteDoc, doc, updateDoc, limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  loading: false,
  isSaving: false,
  unsubscribe: null,

  // Suscripción con límite inicial para performance
  subscribeExpenses: (userId) => {
    if (!userId) return;
    if (get().unsubscribe) get().unsubscribe();

    set({ loading: true });

    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(100) // Paginación inicial
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: d.data().date?.toDate() || new Date()
      }));
      set({ expenses: data, loading: false });
    }, (error) => {
      console.error("Error en suscripción:", error);
      set({ loading: false });
    });

    set({ unsubscribe: unsub });
  },

  addExpense: async (data) => {
    set({ isSaving: true });
    try {
      // Normalización para filtros rápidos y lógica de "Gasto Hormiga"
      const dateObj = data.date || new Date();
      const expenseData = {
        ...data,
        amount: parseFloat(data.amount),
        dateString: dateObj.toISOString().split('T')[0],
        isAntExpense: parseFloat(data.amount) < 50,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'expenses'), expenseData);
      set({ isSaving: false });
      return { success: true };
    } catch (e) {
      set({ isSaving: false });
      return { success: false, error: e.message };
    }
  },

  updateExpense: async (id, data) => {
    try {
      await updateDoc(doc(db, 'expenses', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  deleteExpense: async (id) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  clearExpenses: () => {
    if (get().unsubscribe) get().unsubscribe();
    set({ expenses: [], unsubscribe: null });
  }
}));