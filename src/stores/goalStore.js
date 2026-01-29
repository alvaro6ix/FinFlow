import { create } from 'zustand';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, where, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useGoalStore = create((set, get) => ({
  goals: [],
  loading: false,
  unsubscribe: null,

  subscribeGoals: (userId) => {
    if (!userId) return;
    const q = query(collection(db, 'goals'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ goals, loading: false });
    });
    set({ unsubscribe });
  },

  addContribution: async (goalId, amount) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (!goal) return;
    const newAmount = (goal.currentAmount || 0) + amount;
    await updateDoc(doc(db, 'goals', goalId), {
      currentAmount: newAmount,
      completed: newAmount >= goal.targetAmount,
      updatedAt: serverTimestamp()
    });
  }
}));