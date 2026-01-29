import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { isAfter, addDays, addWeeks, addMonths, addYears, parseISO } from 'date-fns';

export const processRecurringExpenses = async (userId) => {
  const q = query(
    collection(db, 'recurring_configs'),
    where('userId', '==', userId),
    where('active', '==', true)
  );

  const snapshot = await getDocs(q);
  const now = new Date();

  for (const configDoc of snapshot.docs) {
    const config = { id: configDoc.id, ...configDoc.data() };
    let nextDate = config.nextExecution?.toDate() || parseISO(config.startDate);

    while (isAfter(now, nextDate)) {
      // 1. Registrar el gasto real
      await addDoc(collection(db, 'expenses'), {
        amount: config.amount,
        categoryId: config.categoryId,
        categoryName: config.categoryName,
        description: `${config.description} (Recurrente)`,
        date: nextDate,
        userId: userId,
        type: 'expense',
        isRecurring: true,
        recurringConfigId: config.id
      });

      // 2. Calcular siguiente fecha según frecuencia
      if (config.frequency === 'daily') nextDate = addDays(nextDate, 1);
      if (config.frequency === 'weekly') nextDate = addWeeks(nextDate, 1);
      if (config.frequency === 'monthly') nextDate = addMonths(nextDate, 1);
      if (config.frequency === 'yearly') nextDate = addYears(nextDate, 1);

      // Si hay fecha de fin y ya la pasamos, desactivar
      if (config.endDate && isAfter(nextDate, config.endDate.toDate())) {
        await updateDoc(doc(db, 'recurring_configs', config.id), { active: false });
        break;
      }
    }

    // Actualizar la configuración con la próxima fecha de ejecución
    await updateDoc(doc(db, 'recurring_configs', config.id), {
      nextExecution: nextDate,
      lastExecuted: serverTimestamp()
    });
  }
};