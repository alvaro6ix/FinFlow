import { create } from 'zustand';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, where, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useBudgetStore = create((set, get) => ({
  budgets: [],
  loading: false,
  error: null,
  unsubscribe: null,

  subscribeBudgets: (userId) => {
    if (!userId) return;
    set({ loading: true });
    
    if (get().unsubscribe) get().unsubscribe();

    const q = query(collection(db, 'budgets'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ budgets, loading: false });
    }, (error) => set({ error: error.message, loading: false }));

    set({ unsubscribe });
  },

  addBudget: async (budgetData) => {
    try {
      await addDoc(collection(db, 'budgets'), {
        ...budgetData,
        createdAt: serverTimestamp(),
        active: true
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateBudget: async (id, updates) => {
    try {
      await updateDoc(doc(db, 'budgets', id), { ...updates, updatedAt: serverTimestamp() });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}));