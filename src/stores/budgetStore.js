import { create } from 'zustand';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useBudgetStore = create((set, get) => ({
  budgets: [],
  incomeSources: [],
  alerts: [], // ✅ Aquí vivirán las alertas sincronizadas con Firebase
  loading: false,
  error: null,
  
  unsubscribeBudgets: null,
  unsubscribeIncome: null,
  unsubscribeAlerts: null, // ✅ Nueva suscripción

  // --- SUSCRIPCIONES ---
  subscribeBudgets: (userId) => {
    if (!userId) return;
    set({ loading: true });
    
    // Limpiar suscripciones anteriores para evitar fugas de memoria
    if (get().unsubscribeBudgets) get().unsubscribeBudgets();
    if (get().unsubscribeAlerts) get().unsubscribeAlerts(); // Limpiar listener de alertas

    // 1. Escuchar Presupuestos
    const qBudgets = query(collection(db, 'budgets'), where('userId', '==', userId));
    const unsubBudgets = onSnapshot(qBudgets, (snapshot) => {
      const budgetsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Normalización de datos para evitar NaN
        spent: Number(doc.data().spent || 0),
        amount: Number(doc.data().amount || 0),
        isActive: doc.data().isActive ?? true,
      }));
      set({ budgets: budgetsData, loading: false });
    }, (error) => set({ error: error.message, loading: false }));

    // 2. Escuchar Alertas (ESTO FALTABA) 🔔
    // Ahora el store siempre sabrá qué alertas hay en Firebase en tiempo real
    const qAlerts = query(collection(db, 'alerts'), where('userId', '==', userId));
    const unsubAlerts = onSnapshot(qAlerts, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenamos: No leídas primero, luego por fecha reciente
      alertsData.sort((a, b) => {
        if (a.read === b.read) {
            // Si ambas son leídas o no leídas, ordenar por fecha (más nueva arriba)
            const timeA = a.timestamp?.seconds || 0;
            const timeB = b.timestamp?.seconds || 0;
            return timeB - timeA;
        }
        return a.read ? 1 : -1; // No leídas arriba
      });

      set({ alerts: alertsData });
    });

    set({ unsubscribeBudgets: unsubBudgets, unsubscribeAlerts: unsubAlerts });
  },

  subscribeIncome: (userId) => {
    if (!userId) return;
    if (get().unsubscribeIncome) get().unsubscribeIncome();

    const q = query(collection(db, 'incomes'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incomeData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ incomeSources: incomeData });
    });
    set({ unsubscribeIncome: unsubscribe });
  },

  // --- ACCIONES DE PRESUPUESTO (CRUD) ---
  createBudget: async (budgetData) => {
    try {
      await addDoc(collection(db, 'budgets'), {
        ...budgetData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) { console.error("Error creating budget:", error); }
  },

  updateBudget: async (id, budgetData) => {
    try {
      await updateDoc(doc(db, 'budgets', id), {
        ...budgetData,
        updatedAt: serverTimestamp()
      });
    } catch (error) { console.error("Error updating budget:", error); }
  },

  deleteBudget: async (id) => {
    try { await deleteDoc(doc(db, 'budgets', id)); } 
    catch (error) { console.error("Error deleting budget:", error); }
  },

  // --- ACCIONES DE ALERTAS (CORREGIDO) ---
  
  // 1. Generar Alertas (Sin duplicados y sin memoria local volátil)
  generateAlerts: async (budgetsWithSpent) => {
    const { alerts } = get(); // Obtenemos las alertas REALES de Firebase
    
    budgetsWithSpent.forEach(async (budget) => {
      if (!budget.isActive) return;

      const spent = Number(budget.spent);
      const limit = Number(budget.amount);
      const threshold = (budget.alertThreshold || 80) / 100;
      const percentage = (spent / limit) * 100;

      // Definir tipo de alerta necesaria
      let type = null;
      if (spent >= limit) type = 'exceeded';
      else if (spent >= limit * threshold) type = 'warning';

      if (type) {
        // ✅ EVITAR ZOMBIES: Verificamos si YA EXISTE una alerta de este tipo para este presupuesto
        // en la lista que bajamos de Firebase.
        const alreadyExists = alerts.some(a => a.budgetId === budget.id && a.type === type);
        
        if (!alreadyExists) {
          try {
            await addDoc(collection(db, 'alerts'), {
              userId: budget.userId,
              budgetId: budget.id,
              type: type, 
              categoryLabel: budget.categoryLabel || 'Presupuesto',
              percentage: percentage,
              message: type === 'exceeded' 
                ? `Has excedido tu límite en ${budget.categoryLabel}`
                : `Has alcanzado el ${percentage.toFixed(0)}% de tu límite en ${budget.categoryLabel}`,
              severity: type === 'exceeded' ? 'error' : 'warning',
              read: false, 
              timestamp: serverTimestamp()
            });
          } catch (e) { console.error("Error generating alert:", e); }
        }
      }
    });
  },

  // 2. Marcar como Leída (Persistencia en Firebase) ✅
  markAlertAsRead: async (id) => {
    try {
      // Optimistic update (para que la UI reaccione instantáneo)
      const alerts = get().alerts.map(a => a.id === id ? { ...a, read: true } : a);
      set({ alerts });
      
      // Update real en Firebase
      const alertRef = doc(db, 'alerts', id);
      await updateDoc(alertRef, { read: true });
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  },

  // 3. Eliminar Alerta (Persistencia en Firebase) ✅
  deleteAlert: async (id) => {
    try {
      // Optimistic update
      const alerts = get().alerts.filter(a => a.id !== id);
      set({ alerts });

      // Delete real en Firebase
      await deleteDoc(doc(db, 'alerts', id));
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  },

  // --- ACCIONES DE INGRESOS ---
  addIncome: async (data) => {
    try { await addDoc(collection(db, 'incomes'), data); } catch (e) { console.error(e); }
  },
  updateIncome: async (id, data) => {
    try { await updateDoc(doc(db, 'incomes', id), data); } catch (e) { console.error(e); }
  },
  deleteIncome: async (id) => {
    try { await deleteDoc(doc(db, 'incomes', id)); } catch (e) { console.error(e); }
  }
}));