import { create } from "zustand";
import { db, storage, auth } from "../firebase/config";
import { 
  collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, 
  query, where, orderBy, serverTimestamp, getDocs, writeBatch 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useExpenseStore = create((set, get) => ({
  expenses: [],
  loading: false,
  isSaving: false,

  subscribeExpenses: (userId) => {
    if (!userId) return;
    set({ loading: true });
    
    // Mantenemos el orden descendente para que los más nuevos aparezcan arriba
    const q = query(
      collection(db, "expenses"), 
      where("userId", "==", userId), 
      orderBy("date", "desc")
    );
    
    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        // Normalizamos la fecha de Firestore a objeto Date de JS
        date: d.data().date?.toDate ? d.data().date.toDate() : new Date(d.data().date)
      }));
      set({ expenses: docs, loading: false });
    }, (err) => {
      console.error("Error Firestore:", err);
      set({ loading: false });
    });
  },

  addExpense: async (data) => {
    set({ isSaving: true });
    try {
      await addDoc(collection(db, "expenses"), { 
        ...data, 
        createdAt: serverTimestamp() 
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    } finally {
      set({ isSaving: false });
    }
  },

  updateExpense: async (id, data) => {
    set({ isSaving: true });
    try {
      const docRef = doc(db, "expenses", id);
      await updateDoc(docRef, { 
        ...data, 
        updatedAt: serverTimestamp() 
      });
      return { success: true };
    } catch (e) {
      console.error("Error actualizando:", e);
      return { success: false, error: e.message };
    } finally {
      set({ isSaving: false });
    }
  },

  deleteExpense: async (id) => {
    try {
      // Nota: Eliminamos el window.confirm de aquí para que handleDeleteAll pueda 
      // borrar en bucle sin interrupciones. La confirmación se queda en el componente.
      await deleteDoc(doc(db, "expenses", id));
      return { success: true };
    } catch (e) { 
      console.error("Error al borrar:", e); 
      return { success: false };
    }
  },

  clearAllExpenses: async (userId) => {
    if (!userId) return { success: false, error: "No user authenticated" };
    
    set({ loading: true });
    try {
      const q = query(collection(db, "expenses"), where("userId", "==", userId));
      const snap = await getDocs(q);
      
      if (snap.empty) return { success: true };

      // Usamos WriteBatch para eliminar todo en un solo movimiento atómico
      const batch = writeBatch(db);
      snap.docs.forEach((d) => {
        batch.delete(d.ref);
      });

      await batch.commit();
      
      // Limpiamos el estado local inmediatamente
      set({ expenses: [] });
      
      return { success: true };
    } catch (e) {
      console.error("Error masivo:", e);
      return { success: false, error: e.message };
    } finally {
      set({ loading: false });
    }
  },

  uploadTicket: async (file) => {
    if (!file || !auth.currentUser) return null;
    try {
      const storageRef = ref(storage, `tickets/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (e) {
      console.error("Error en Storage:", e);
      return null;
    }
  },
}));