import { addMonths, setDate, isAfter, differenceInDays, format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export const getCardStatus = (card) => {
  if (!card.cutOffDay || !card.paymentDay) return { status: 'unknown', message: 'Configurar fechas' };

  const today = startOfDay(new Date());
  const currentMonth = new Date();
  
  // 1. Calcular Fecha de Corte más próxima
  let nextCutOff = setDate(currentMonth, card.cutOffDay);
  if (isAfter(today, nextCutOff)) {
    nextCutOff = addMonths(nextCutOff, 1);
  }

  // 2. Calcular Fecha de Pago Límite (Generalmente es el próximo después del corte)
  // Nota: Esto es una estimación. En la vida real depende si ya pasó el corte o no.
  // Asumimos: Si hoy < Corte, el pago es el del mes pasado (o ya pagaste).
  // Si hoy > Corte, te estás preparando para el pago del mes siguiente.
  
  let nextPayment = setDate(currentMonth, card.paymentDay);
  if (isAfter(today, nextPayment)) {
    nextPayment = addMonths(nextPayment, 1);
  }

  const daysToCutOff = differenceInDays(nextCutOff, today);
  const daysToPayment = differenceInDays(nextPayment, today);

  // Lógica del Semáforo
  if (daysToPayment <= 5 && daysToPayment >= 0) {
    return {
      status: 'urgent',
      color: '#ef4444', // Rojo
      message: `¡Pagar en ${daysToPayment} días!`,
      date: nextPayment
    };
  }

  if (daysToCutOff <= 3 && daysToCutOff >= 0) {
    return {
      status: 'warning',
      color: '#f59e0b', // Ambar
      message: `Corte en ${daysToCutOff} días`,
      subMessage: 'Evita compras grandes',
      date: nextCutOff
    };
  }

  if (daysToCutOff > 20) {
    return {
      status: 'optimal',
      color: '#10b981', // Verde
      message: 'Inicio de ciclo',
      subMessage: 'Buen momento para comprar',
      date: nextCutOff
    };
  }

  return {
    status: 'normal',
    color: '#6366f1', // Indigo
    message: `Corte: ${format(nextCutOff, 'dd MMM', { locale: es })}`,
    date: nextCutOff
  };
};