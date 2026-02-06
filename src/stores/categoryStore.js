import { create } from "zustand";
import { db, auth } from "../firebase/config";
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, setDoc, onSnapshot, 
  query, where, serverTimestamp 
} from "firebase/firestore";

export const useCategoryStore = create((set, get) => ({
  customCategories: [],
  hiddenSystemIds: [], 
  loading: false,

  subscribeCategories: (userId) => {
    if (!userId) return;
    set({ loading: true });

    // 1. Categorías Personalizadas
    const q = query(collection(db, "categories"), where("userId", "==", userId));
    const unsubCats = onSnapshot(q, (snap) => {
      const cats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ customCategories: cats });
    });

    // 2. Preferencias (Creación automática para evitar error de permisos)
    const prefRef = doc(db, "userPreferences", userId);
    setDoc(prefRef, { userId }, { merge: true }).catch(err => console.log("Pref init error:", err));

    const unsubPrefs = onSnapshot(prefRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ hiddenSystemIds: docSnap.data().hiddenSystemCategories || [] });
      }
    });

    set({ loading: false });
    return () => { unsubCats(); unsubPrefs(); };
  },

  // ✅ CORREGIDO: Recibe solo 1 argumento (el objeto de datos)
  addCategory: async (categoryData) => {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No user" };

    try {
      await addDoc(collection(db, "categories"), {
        ...categoryData,
        userId: user.uid, // Se inyecta aquí automáticamente
        subcategories: categoryData.subcategories || [],
        isCustom: true,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: e.message };
    }
  },

  updateCategory: async (id, data) => {
    try {
      await updateDoc(doc(db, "categories", id), {
        ...data,
        subcategories: data.subcategories || [],
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  deleteCategory: async (id) => {
    if (!window.confirm("¿Borrar esta categoría?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      return { success: true };
    } catch (e) { return { success: false }; }
  },

  toggleHideSystemCategory: async (catId) => {
    const user = auth.currentUser;
    if (!user) return;
    const { hiddenSystemIds } = get();
    
    let newHidden = hiddenSystemIds.includes(catId)
      ? hiddenSystemIds.filter(id => id !== catId)
      : [...hiddenSystemIds, catId];

    set({ hiddenSystemIds: newHidden }); 

    try {
      const prefRef = doc(db, "userPreferences", user.uid);
      await setDoc(prefRef, { 
        hiddenSystemCategories: newHidden,
        userId: user.uid 
      }, { merge: true });
    } catch (e) { console.error(e); }
  }
}));