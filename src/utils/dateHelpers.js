// Obtener primer día del mes
export const getFirstDayOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Obtener último día del mes
export const getLastDayOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

// Obtener días en el mes
export const getDaysInMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Obtener días transcurridos del mes
export const getDaysPassedInMonth = (date = new Date()) => {
  return date.getDate();
};

// Obtener días restantes del mes
export const getDaysRemainingInMonth = (date = new Date()) => {
  return getDaysInMonth(date) - getDaysPassedInMonth(date);
};

// Verificar si es hoy
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

// Verificar si es ayer
export const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === yesterday.getDate() &&
    checkDate.getMonth() === yesterday.getMonth() &&
    checkDate.getFullYear() === yesterday.getFullYear()
  );
};

// Verificar si es esta semana
export const isThisWeek = (date) => {
  const now = new Date();
  const checkDate = new Date(date);
  
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return checkDate >= startOfWeek && checkDate <= endOfWeek;
};

// Verificar si es este mes
export const isThisMonth = (date) => {
  const now = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getMonth() === now.getMonth() &&
    checkDate.getFullYear() === now.getFullYear()
  );
};

// Obtener rango de fechas
export const getDateRange = (type) => {
  const now = new Date();
  let startDate, endDate;

  switch (type) {
    case 'today':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'month':
      startDate = getFirstDayOfMonth(now);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      startDate = getFirstDayOfMonth(now);
      endDate = new Date(now);
  }

  return { startDate, endDate };
};

// Agregar días a una fecha
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Diferencia en días entre dos fechas
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};