import { create } from 'zustand';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useGoalStore = create((set, get) => ({
  goals: [],
  subscribeGoals: (userId) => {
    if (!userId) return;
    const q = query(collection(db, 'goals'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      set({ goals: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
    });
  },
  addGoal: async (data) => {
    await addDoc(collection(db, 'goals'), { ...data, currentAmount: 0, createdAt: new Date() });
  },
  addContribution: async (goalId, amount) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (goal) {
      await updateDoc(doc(db, 'goals', goalId), {
        currentAmount: goal.currentAmount + parseFloat(amount)
      });
    }
  }
}));