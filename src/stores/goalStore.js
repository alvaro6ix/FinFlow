import { create } from 'zustand';
import { 
  collection, addDoc, query, where, onSnapshot, 
  updateDoc, doc, serverTimestamp, deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useGoalStore = create((set, get) => ({
  goals: [],
  loading: false,

  subscribeGoals: (userId) => {
    if (!userId) return;
    set({ loading: true });
    const q = query(collection(db, 'goals'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      set({ 
        goals: snapshot.docs.map(d => ({ 
          id: d.id, 
          ...d.data(),
          // Convertimos el Timestamp de Firebase a Date de JS para los componentes
          deadline: d.data().deadline?.toDate() || null 
        })),
        loading: false 
      });
    });
  },

  addGoal: async (data) => {
    await addDoc(collection(db, 'goals'), { 
      ...data, 
      targetAmount: parseFloat(data.targetAmount),
      currentAmount: parseFloat(data.currentAmount || 0),
      completed: parseFloat(data.currentAmount || 0) >= parseFloat(data.targetAmount),
      createdAt: serverTimestamp() 
    });
  },

  // REQUERIMIENTO 6.3: Aportaciones a Metas
  addContribution: async (goalId, amount) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (goal) {
      const newAmount = (goal.currentAmount || 0) + parseFloat(amount);
      await updateDoc(doc(db, 'goals', goalId), {
        currentAmount: newAmount,
        completed: newAmount >= goal.targetAmount,
        updatedAt: serverTimestamp()
      });
    }
  },

  // REQUERIMIENTO 12.4: Eliminación de datos
  deleteGoal: async (goalId) => {
    await deleteDoc(doc(db, 'goals', goalId));
  }
}));