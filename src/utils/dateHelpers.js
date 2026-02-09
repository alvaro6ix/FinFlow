// ✅ PARSER VITAL PARA FIREBASE
export const parseDate = (dateValue) => {
  if (!dateValue) return new Date();
  if (dateValue.toDate && typeof dateValue.toDate === 'function') {
    return dateValue.toDate(); // Timestamp Firebase
  }
  if (dateValue.seconds) {
    return new Date(dateValue.seconds * 1000);
  }
  return new Date(dateValue);
};

export const isSameDay = (d1, d2) => {
  const date1 = parseDate(d1);
  const date2 = parseDate(d2);
  return date1.toDateString() === date2.toDateString();
};

export const isSameMonth = (d1, d2) => {
  const date1 = parseDate(d1);
  const date2 = parseDate(d2);
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

export const getDateRange = (rangeType, customStart = null, customEnd = null) => {
  const now = new Date();
  const start = new Date();
  const end = new Date(); // Hoy

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (rangeType) {
    case 'day':
      break;
    case 'week':
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      break;
    case 'month':
      start.setDate(1);
      break;
    case 'year':
      start.setMonth(0, 1);
      break;
    case 'custom':
      if (customStart) start.setTime(parseDate(customStart).getTime());
      if (customEnd) end.setTime(parseDate(customEnd).getTime());
      break;
    default:
      start.setFullYear(2000);
      break;
  }
  
  return { start, end };
};

// Mantenemos tu nombre de función original
export const getPreviousPeriod = (start, end) => {
  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);
  return { start: prevStart, end: prevEnd };
};