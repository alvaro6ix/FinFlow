import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  loading: false,
  error: null,
  unsubscribe: null,

  subscribeExpenses: (userId) => {
    if (!userId) return;

    // Limpieza segura: solo ejecutamos si es función
    const currentUnsub = get().unsubscribe;
    if (typeof currentUnsub === 'function') {
      currentUnsub();
    }

    set({ loading: true });

    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    // Esta es la suscripción que actualiza la página sola
    const unsub = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convertimos el Timestamp de Firebase a Date de JS
        date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date),
      }));
      set({ expenses: expensesData, loading: false, error: null });
    }, (error) => {
      console.error("CRÍTICO: Error en tiempo real", error);
      set({ error: error.message, loading: false });
    });

    set({ unsubscribe: unsub });
  },

  addExpense: async (expenseData) => {
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  clearExpenses: () => {
    const currentUnsub = get().unsubscribe;
    if (typeof currentUnsub === 'function') {
      currentUnsub();
    }
    set({ expenses: [], unsubscribe: null });
  }
}));