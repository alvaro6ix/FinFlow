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

  // Suscripción reactiva filtrando por usuario y estado activo
  subscribeBudgets: (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });
    
    if (get().unsubscribe) get().unsubscribe();

    // Filtramos solo presupuestos activos para el dashboard y la vista de presupuestos
    const q = query(
      collection(db, 'budgets'), 
      where('userId', '==', userId),
      where('active', '==', true) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      set({ budgets, loading: false });
    }, (error) => {
      console.error("Budget Subscription Error:", error);
      set({ error: error.message, loading: false });
    });

    set({ unsubscribe });
  },

  addBudget: async (budgetData) => {
    set({ loading: true, error: null });
    try {
      // Verificación de integridad: Evitar duplicados para la misma categoría
      const existing = get().budgets.find(b => b.categoryId === budgetData.categoryId);
      if (existing) {
        throw new Error(`Ya tienes un presupuesto asignado a esta categoría.`);
      }

      await addDoc(collection(db, 'budgets'), {
        ...budgetData,
        createdAt: serverTimestamp(),
        active: true
      });
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  updateBudget: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      await updateDoc(doc(db, 'budgets', id), { 
        ...updates, 
        updatedAt: serverTimestamp() 
      });
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // REQUERIMIENTO 12.3: Eliminación de presupuestos
  deleteBudget: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'budgets', id));
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  clearError: () => set({ error: null }),

  clearBudgets: () => {
    if (get().unsubscribe) get().unsubscribe();
    set({ budgets: [], unsubscribe: null, error: null });
  }
}));