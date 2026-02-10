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
  let start = new Date(now);
  let end = new Date(now);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (rangeType) {
    case 'day':
      // start y end ya son "hoy"
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
      // ✅ CORRECCIÓN FINAL: Usar el año actual correctamente
      const currentYear = now.getFullYear();
      start = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      end = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      break;
      
    case 'custom':
      if (customStart) {
        // ✅ CORRECCIÓN: Parsear correctamente sin offset
        const parts = customStart.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Meses en JS son 0-11
        const day = parseInt(parts[2]);
        start = new Date(year, month, day, 0, 0, 0, 0);
      }
      if (customEnd) {
        // ✅ CORRECCIÓN: Parsear correctamente sin offset
        const parts = customEnd.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        end = new Date(year, month, day, 23, 59, 59, 999);
      }
      break;
      
    default:
      start.setFullYear(2000);
      break;
  }
  
  return { start, end };
};

export const getPreviousPeriod = (start, end) => {
  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);
  return { start: prevStart, end: prevEnd };
};