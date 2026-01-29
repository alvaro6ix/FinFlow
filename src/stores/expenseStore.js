import { create } from 'zustand';
import { 
  collection, addDoc, query, where, orderBy, onSnapshot, 
  serverTimestamp, deleteDoc, doc, updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  loading: false,
  unsubscribe: null,

  subscribeExpenses: (userId) => {
    if (!userId) return;
    if (get().unsubscribe) get().unsubscribe();

    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: d.data().date?.toDate() || new Date()
      }));
      set({ expenses: data, loading: false });
    });

    set({ unsubscribe: unsub });
  },

  addExpense: async (data) => {
    try {
      await addDoc(collection(db, 'expenses'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  updateExpense: async (id, data) => {
    try {
      await updateDoc(doc(db, 'expenses', id), data);
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