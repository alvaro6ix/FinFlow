import { create } from "zustand";
import { db } from "../firebase/config";
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, 
  query, where, serverTimestamp 
} from "firebase/firestore";

export const useCategoryStore = create((set) => ({
  customCategories: [],
  hiddenSystemIds: [], // Para ocultar las predeterminadas
  loading: false,

  subscribeCategories: (userId) => {
    if (!userId) return;
    set({ loading: true });

    const q = query(collection(db, "categories"), where("userId", "==", userId));
    
    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ customCategories: docs, loading: false });
    });
  },

  addCategory: async (userId, categoryData) => {
    try {
      await addDoc(collection(db, "categories"), {
        ...categoryData,
        userId,
        isCustom: true,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  updateCategory: async (id, data) => {
    try {
      await updateDoc(doc(db, "categories", id), data);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  deleteCategory: async (id) => {
    if (!window.confirm("¿Borrar esta categoría?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
    } catch (e) { console.error(e); }
  },

  toggleHideSystemCategory: (id) => {
    set((state) => ({
      hiddenSystemIds: state.hiddenSystemIds.includes(id)
        ? state.hiddenSystemIds.filter(i => i !== id)
        : [...state.hiddenSystemIds, id]
    }));
  }
}));