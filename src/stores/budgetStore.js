import { create } from 'zustand';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useBudgetStore = create((set, get) => ({
  budgets: [],
  incomeSources: [],
  alerts: [],
  processedAlertKeys: new Set(),
  loading: false,
  error: null,
  unsubscribeBudgets: null,
  unsubscribeIncome: null,

  // --- SUSCRIPCIONES ---
  subscribeBudgets: (userId) => {
    if (!userId) return;
    set({ loading: true });
    
    if (get().unsubscribeBudgets) get().unsubscribeBudgets();

    const q = query(collection(db, 'budgets'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const budgetsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          spent: Number(data.spent || 0),
          amount: Number(data.amount || 0),
          isActive: data.isActive ?? true,
          startDate: data.startDate?.seconds ? new Date(data.startDate.seconds * 1000) : new Date(data.startDate || Date.now()),
          endDate: data.endDate?.seconds ? new Date(data.endDate.seconds * 1000) : (data.endDate ? new Date(data.endDate) : null)
        };
      });
      set({ budgets: budgetsData, loading: false });
      // Las alertas se generan desde la vista con generateAlerts para usar el gasto calculado
    }, (error) => set({ error: error.message, loading: false }));

    set({ unsubscribeBudgets: unsubscribe });
  },

  subscribeIncome: (userId) => {
    if (!userId) return;
    if (get().unsubscribeIncome) get().unsubscribeIncome();

    const q = query(collection(db, 'incomes'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incomes = snapshot.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          // Asegurar fecha válida para el ingreso
          date: data.date?.seconds ? new Date(data.date.seconds * 1000) : (data.date ? new Date(data.date) : new Date())
        };
      });
      set({ incomeSources: incomes });
    });
    set({ unsubscribeIncome: unsubscribe });
  },

  // --- ALERTAS ---
  generateAlerts: (calculatedBudgets) => {
    const todayStr = new Date().toDateString();
    const newAlerts = [];
    const currentAlerts = get().alerts;
    const processed = new Set(get().processedAlertKeys);

    calculatedBudgets.forEach(budget => {
      if (!budget.isActive) return;

      const percentage = (budget.spent / budget.amount) * 100;
      const threshold = budget.alertThreshold || 80;
      let type = null;

      if (percentage >= 100) type = 'exceeded';
      else if (percentage >= threshold) type = 'threshold';

      if (type) {
        const key = `${budget.id}-${type}-${todayStr}`;
        
        if (!processed.has(key)) {
          // Evitar duplicados visuales si ya existe en el estado
          const alreadyExists = currentAlerts.some(a => a.id === key);
          if (!alreadyExists) {
            newAlerts.push({
              id: key,
              budgetId: budget.id,
              categoryName: budget.categoryLabel,
              percentage: percentage,
              type: type,
              read: false, // Estado inicial: no leído
              timestamp: new Date()
            });
            processed.add(key);
          }
        }
      }
    });

    if (newAlerts.length > 0) {
      set(state => ({
        alerts: [...newAlerts, ...state.alerts],
        processedAlertKeys: processed
      }));
    }
  },

  markAlertAsRead: (alertId) => {
    set(state => ({
      alerts: state.alerts.map(a => a.id === alertId ? { ...a, read: true } : a)
    }));
  },

  deleteAlert: (alertId) => {
    set(state => ({
      alerts: state.alerts.filter(a => a.id !== alertId)
    }));
  },

  // --- CRUD ---
  createBudget: async (data) => {
    try {
      const safeData = JSON.parse(JSON.stringify(data));
      await addDoc(collection(db, 'budgets'), {
        ...safeData,
        spent: 0,
        createdAt: serverTimestamp(),
        isActive: true
      });
    } catch (e) { console.error(e); }
  },

  updateBudget: async (id, data) => {
    try {
      const safeData = JSON.parse(JSON.stringify(data));
      await updateDoc(doc(db, 'budgets', id), { ...safeData, updatedAt: serverTimestamp() });
    } catch (e) { console.error(e); }
  },

  deleteBudget: async (id) => {
    try { await deleteDoc(doc(db, 'budgets', id)); } catch (e) { console.error(e); }
  },

  addIncome: async (data) => {
    try { 
      // Aseguramos que la fecha se guarde correctamente
      const incomeData = {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'incomes'), incomeData); 
    } catch (e) { console.error(e); }
  },

  updateIncome: async (id, data) => {
    try { 
      const incomeData = {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        updatedAt: serverTimestamp()
      };
      await updateDoc(doc(db, 'incomes', id), incomeData); 
    } catch (e) { console.error(e); }
  },

  deleteIncome: async (id) => {
    try { await deleteDoc(doc(db, 'incomes', id)); } catch (e) { console.error(e); }
  },

  calculateTotalIncome: () => {
    return get().incomeSources.reduce((acc, curr) => acc + Number(curr.amount), 0);
  },

  calculateSmartBudget: (totalIncome) => {
    return {
      needs: totalIncome * 0.50,
      wants: totalIncome * 0.30,
      savings: totalIncome * 0.20
    };
  }
}));