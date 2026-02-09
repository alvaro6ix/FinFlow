import { create } from 'zustand';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useBudgetStore = create((set, get) => ({
  budgets: [],
  incomeSources: [],
  alerts: [],
  loading: false,
  error: null,
  unsubscribeBudgets: null,
  unsubscribeIncome: null,
  unsubscribeAlerts: null,
  alertsCreated: new Set(),

  // --- SUSCRIPCIONES ---
  subscribeBudgets: (userId) => {
    if (!userId) return;
    set({ loading: true });
    if (get().unsubscribeBudgets) get().unsubscribeBudgets();

    const q = query(collection(db, 'budgets'), where('userId', '==', userId));
    const unsub = onSnapshot(q, (snapshot) => {
      const budgetsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          spent: Number(data.spent || 0),
          amount: Number(data.amount || 1),
          isActive: data.isActive ?? true
        };
      });
      set({ budgets: budgetsData, loading: false });
    }, (error) => set({ error: error.message, loading: false }));
    set({ unsubscribeBudgets: unsub });
  },

  subscribeIncome: (userId) => {
    if (!userId) return;
    if (get().unsubscribeIncome) get().unsubscribeIncome();

    const q = query(collection(db, 'incomes'), where('userId', '==', userId));
    const unsub = onSnapshot(q, (snapshot) => {
      const incomes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ incomeSources: incomes });
    });
    set({ unsubscribeIncome: unsub });
  },

  subscribeAlerts: (userId) => {
    if (!userId) return;
    if (get().unsubscribeAlerts) get().unsubscribeAlerts();

    const q = query(collection(db, 'budgetAlerts'), where('userId', '==', userId));
    const unsub = onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      alerts.sort((a, b) => {
        const dateA = a.timestamp?.seconds || 0;
        const dateB = b.timestamp?.seconds || 0;
        return dateB - dateA;
      });
      set({ alerts });
    });
    set({ unsubscribeAlerts: unsub });
  },

  // --- CRUD BUDGETS ---
  createBudget: async (data) => {
    try {
      const safeData = {
        userId: data.userId,
        categoryId: data.categoryId,
        categoryLabel: data.categoryLabel,
        categoryColor: data.categoryColor,
        categoryIconName: data.categoryIconName || null,
        amount: Number(data.amount),
        period: data.period,
        alertThreshold: Number(data.alertThreshold || 80),
        startDate: data.startDate,
        spent: 0,
        isActive: true,
        lastAlertPercentage: 0
      };
      
      await addDoc(collection(db, 'budgets'), {
        ...safeData,
        createdAt: serverTimestamp()
      });
    } catch (e) { 
      console.error("Error creating budget:", e); 
      set({ error: e.message });
    }
  },

  updateBudget: async (id, data) => {
    try {
      const safeData = {
        categoryId: data.categoryId,
        categoryLabel: data.categoryLabel,
        categoryColor: data.categoryColor,
        categoryIconName: data.categoryIconName || null,
        amount: Number(data.amount),
        period: data.period,
        alertThreshold: Number(data.alertThreshold || 80),
        startDate: data.startDate,
        isActive: data.isActive ?? true
      };
      
      await updateDoc(doc(db, 'budgets', id), { 
        ...safeData, 
        updatedAt: serverTimestamp() 
      });
    } catch (e) { 
      console.error("Error updating budget:", e);
      set({ error: e.message });
    }
  },

  deleteBudget: async (id) => {
    try { 
      await deleteDoc(doc(db, 'budgets', id)); 
    } catch (e) { 
      console.error("Error deleting budget:", e);
      set({ error: e.message });
    }
  },

  // --- CRUD INCOME ---
  addIncome: async (data) => {
    try {
      const safeData = {
        userId: data.userId,
        name: data.name,
        amount: Number(data.amount),
        type: data.type,
        frequency: data.frequency || 'monthly',
        isActive: true
      };
      
      await addDoc(collection(db, 'incomes'), {
        ...safeData,
        createdAt: serverTimestamp()
      });
    } catch (e) { 
      console.error("Error adding income:", e);
      set({ error: e.message });
    }
  },

  updateIncome: async (id, data) => {
    try {
      const safeData = {
        name: data.name,
        amount: Number(data.amount),
        type: data.type,
        frequency: data.frequency || 'monthly',
        isActive: data.isActive ?? true
      };
      
      await updateDoc(doc(db, 'incomes', id), {
        ...safeData,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error updating income:", e);
      set({ error: e.message });
    }
  },

  deleteIncome: async (id) => {
    try { 
      await deleteDoc(doc(db, 'incomes', id)); 
    } catch (e) { 
      console.error("Error deleting income:", e);
      set({ error: e.message });
    }
  },

  // --- ALERTS (SIN DUPLICADOS) ---
  createAlert: async (userId, budgetId, type, message, percentage, categoryLabel) => {
    try {
      const alertKey = `${budgetId}-${type}`;
      const alertsCreated = get().alertsCreated;
      
      if (alertsCreated.has(alertKey)) {
        return;
      }

      await addDoc(collection(db, 'budgetAlerts'), {
        userId,
        budgetId,
        type,
        severity: type === 'exceeded' ? 'error' : 'warning',
        message,
        percentage: Math.round(percentage),
        categoryLabel,
        read: false,
        timestamp: serverTimestamp()
      });

      alertsCreated.add(alertKey);
      set({ alertsCreated });

      setTimeout(() => {
        const currentSet = get().alertsCreated;
        currentSet.delete(alertKey);
        set({ alertsCreated: currentSet });
      }, 24 * 60 * 60 * 1000);

    } catch (e) {
      console.error("Error creating alert:", e);
    }
  },

  markAlertAsRead: async (alertId) => {
    try {
      await updateDoc(doc(db, 'budgetAlerts', alertId), {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error marking alert as read:", e);
    }
  },

  deleteAlert: async (alertId) => {
    try {
      await deleteDoc(doc(db, 'budgetAlerts', alertId));
    } catch (e) {
      console.error("Error deleting alert:", e);
    }
  },

  clearAllAlerts: async () => {
    const alerts = get().alerts;
    try {
      await Promise.all(alerts.map(alert => deleteDoc(doc(db, 'budgetAlerts', alert.id))));
    } catch (e) {
      console.error("Error clearing alerts:", e);
    }
  },

  getUnreadAlerts: () => {
    return get().alerts.filter(alert => !alert.read);
  },

  // --- CÁLCULOS ---
  calculateTotalIncome: () => {
    const incomes = get().incomeSources.filter(inc => inc.isActive !== false);
    return incomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  },

  calculateSmartBudget: (totalIncome) => {
    return {
      needs: Math.round(totalIncome * 0.50),
      wants: Math.round(totalIncome * 0.30),
      savings: Math.round(totalIncome * 0.20)
    };
  },

  // CÁLCULO CORREGIDO DE GASTOS POR PERIODO
  calculateSpentInPeriod: (categoryId, period, startDate, expenses) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    let budgetStart = startDate;
    if (startDate?.seconds) {
      budgetStart = new Date(startDate.seconds * 1000);
    } else if (typeof startDate === 'string') {
      budgetStart = new Date(startDate);
    } else if (!(startDate instanceof Date)) {
      budgetStart = new Date();
    }
    budgetStart.setHours(0, 0, 0, 0);

    let cycleStart = new Date(budgetStart);
    let cycleEnd = new Date(budgetStart);

    switch (period) {
      case 'daily':
        cycleStart = new Date(now);
        cycleEnd = new Date(now);
        cycleEnd.setHours(23, 59, 59, 999);
        break;

      case 'weekly': {
        const diffMs = now - budgetStart;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const weeksPassed = Math.floor(diffDays / 7);
        
        cycleStart = new Date(budgetStart);
        cycleStart.setDate(budgetStart.getDate() + (weeksPassed * 7));
        
        cycleEnd = new Date(cycleStart);
        cycleEnd.setDate(cycleStart.getDate() + 6);
        cycleEnd.setHours(23, 59, 59, 999);
        break;
      }

      case 'monthly': {
        let monthsPassed = (now.getFullYear() - budgetStart.getFullYear()) * 12;
        monthsPassed += now.getMonth() - budgetStart.getMonth();
        
        cycleStart = new Date(budgetStart);
        cycleStart.setMonth(budgetStart.getMonth() + monthsPassed);
        
        if (cycleStart.getDate() > now.getDate()) {
          cycleStart.setMonth(cycleStart.getMonth() - 1);
        }
        
        cycleEnd = new Date(cycleStart);
        cycleEnd.setMonth(cycleStart.getMonth() + 1);
        cycleEnd.setDate(cycleStart.getDate() - 1);
        cycleEnd.setHours(23, 59, 59, 999);
        break;
      }

      case 'yearly': {
        const yearsPassed = now.getFullYear() - budgetStart.getFullYear();
        cycleStart = new Date(budgetStart);
        cycleStart.setFullYear(budgetStart.getFullYear() + yearsPassed);
        
        if (cycleStart > now) {
          cycleStart.setFullYear(cycleStart.getFullYear() - 1);
        }
        
        cycleEnd = new Date(cycleStart);
        cycleEnd.setFullYear(cycleStart.getFullYear() + 1);
        cycleEnd.setDate(cycleStart.getDate() - 1);
        cycleEnd.setHours(23, 59, 59, 999);
        break;
      }

      default:
        break;
    }

    const periodExpenses = expenses.filter(expense => {
      if (expense.categoryId !== categoryId) return false;
      
      let expenseDate;
      if (expense.date?.seconds) {
        expenseDate = new Date(expense.date.seconds * 1000);
      } else if (expense.date instanceof Date) {
        expenseDate = new Date(expense.date);
      } else {
        expenseDate = new Date(expense.date);
      }
      expenseDate.setHours(0, 0, 0, 0);
      
      return expenseDate >= cycleStart && expenseDate <= cycleEnd;
    });

    return periodExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  }
}));