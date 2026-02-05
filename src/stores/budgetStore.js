import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useBudgetStore = create((set, get) => ({
  budgets: [],
  loading: false,
  error: null,
  unsubscribe: null,

  // Suscripción en tiempo real
  subscribeBudgets: (userId) => {
    if (!userId) return;
    set({ loading: true });
    
    if (get().unsubscribe) get().unsubscribe();

    const q = query(collection(db, 'budgets'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgetsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        spent: Number(doc.data().spent || 0),
        amount: Number(doc.data().amount || 0),
        isActive: doc.data().isActive ?? true
      }));
      set({ budgets: budgetsData, loading: false });
    }, (error) => {
      set({ error: error.message, loading: false });
    });

    set({ unsubscribe });
    return unsubscribe;
  },

  // CRUD Operaciones
  createBudget: async (data) => {
    try {
      await addDoc(collection(db, 'budgets'), {
        ...data,
        createdAt: serverTimestamp(),
        spent: 0
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  updateBudget: async (id, updates) => {
    try {
      const ref = doc(db, 'budgets', id);
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  deleteBudget: async (id) => {
    try {
      await deleteDoc(doc(db, 'budgets', id));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Lógica 50/30/20 (5.4)
  calculateSmartBudget: (income) => {
    const val = Number(income) || 0;
    return {
      needs: val * 0.5,
      wants: val * 0.3,
      savings: val * 0.2
    };
  }
}));