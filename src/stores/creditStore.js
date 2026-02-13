import { create } from 'zustand';
import { db } from '../firebase/config';
import { 
  collection, addDoc, query, where, onSnapshot, serverTimestamp, 
  doc, updateDoc, increment, deleteDoc, writeBatch, getDocs, getDoc 
} from 'firebase/firestore';

export const useCreditStore = create((set, get) => ({
  cards: [],
  installments: [],
  loading: false,
  error: null,

  // 1. Suscribirse a Tarjetas
  subscribeCards: (userId) => {
    if (!userId) return;
    set({ loading: true });
    const q = query(collection(db, 'credit_cards'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ cards, loading: false });
    }, (error) => {
      console.error("Error fetching cards:", error);
      set({ error: error.message, loading: false });
    });
  },

  // 2. Suscribirse a Compras a Plazos
  subscribeInstallments: (userId) => {
    if (!userId) return;
    const q = query(collection(db, 'credit_installments'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const installments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ installments });
    });
  },

  // 3. Agregar Tarjeta
  addCard: async (cardData, userId) => {
    try {
      set({ loading: true });
      await addDoc(collection(db, 'credit_cards'), {
        ...cardData,
        userId,
        currentBalance: 0,
        createdAt: serverTimestamp(),
      });
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false };
    }
  },

  // 4. Agregar Compra a Meses
  addInstallment: async (data, userId) => {
    try {
      set({ loading: true });
      const { cardId, totalAmount, months, installmentsPaid } = data;

      const monthlyPayment = Number(totalAmount) / Number(months);
      const paidAmount = Number(installmentsPaid) * monthlyPayment;
      const remainingDebt = Number(totalAmount) - paidAmount;

      await addDoc(collection(db, 'credit_installments'), {
        ...data,
        userId,
        monthlyPayment,
        paidAmount, 
        installmentsPaid: Number(installmentsPaid),
        isActive: true,
        createdAt: serverTimestamp(),
      });

      if (remainingDebt > 0) {
        const cardRef = doc(db, 'credit_cards', cardId);
        await updateDoc(cardRef, {
          currentBalance: increment(remainingDebt)
        });
      }

      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false };
    }
  },

  // 5. Actualizar Tarjeta
  updateCard: async (cardId, updatedData) => {
    try {
      set({ loading: true });
      const cardRef = doc(db, 'credit_cards', cardId);
      await updateDoc(cardRef, updatedData);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false };
    }
  },

  // ✅ 6. Eliminar Tarjeta (CORREGIDO: CASCADA REAL)
  deleteCard: async (cardId) => {
    try {
      set({ loading: true });
      const batch = writeBatch(db);
      
      // A. Buscar todas las compras de esa tarjeta
      const q = query(collection(db, 'credit_installments'), where('cardId', '==', cardId));
      const snapshot = await getDocs(q);
      
      // B. Borrarlas una por una en el lote
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // C. Borrar la tarjeta
      const cardRef = doc(db, 'credit_cards', cardId);
      batch.delete(cardRef);

      // D. Ejecutar todo junto (Atómico)
      await batch.commit();

      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false };
    }
  },

  // ✅ 7. Eliminar Compra Individual (NUEVO)
  deleteInstallment: async (installmentId) => {
    try {
      set({ loading: true });
      const instRef = doc(db, 'credit_installments', installmentId);
      const instSnap = await getDoc(instRef);
      
      if (instSnap.exists()) {
        const data = instSnap.data();
        // Calculamos cuánto saldo ocupaba esta compra para devolverlo
        const remainingDebt = data.totalAmount - (data.paidAmount || 0);
        
        const batch = writeBatch(db);
        batch.delete(instRef);
        
        // Devolver saldo disponible a la tarjeta
        if (remainingDebt > 0 && data.cardId) {
          const cardRef = doc(db, 'credit_cards', data.cardId);
          batch.update(cardRef, {
            currentBalance: increment(-remainingDebt) // Restar saldo usado = Liberar crédito
          });
        }
        await batch.commit();
      }
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false };
    }
  },

  // ✅ 8. Adelantar Pago (NUEVO - "Magic Button")
  makePayment: async (installmentId, amount) => {
    try {
      set({ loading: true });
      const instRef = doc(db, 'credit_installments', installmentId);
      const instSnap = await getDoc(instRef);
      
      if (!instSnap.exists()) throw new Error("Compra no encontrada");
      
      const data = instSnap.data();
      const newPaidAmount = (data.paidAmount || 0) + amount;
      
      // Recalcular cuántos meses representa lo pagado
      const newInstallmentsPaid = Math.min(data.months, newPaidAmount / data.monthlyPayment);
      
      const batch = writeBatch(db);

      // Actualizar compra
      batch.update(instRef, {
        paidAmount: newPaidAmount,
        installmentsPaid: newInstallmentsPaid,
        lastPaymentDate: serverTimestamp()
      });

      // Actualizar tarjeta (Liberar saldo por lo que pagaste)
      const cardRef = doc(db, 'credit_cards', data.cardId);
      batch.update(cardRef, {
        currentBalance: increment(-amount)
      });

      await batch.commit();
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false };
    }
  }
}));