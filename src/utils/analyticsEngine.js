import { SYSTEM_CATEGORIES } from "../constants/categories";
import { parseDate } from "./dateHelpers";

// --- HELPERS BÁSICOS ---
export const calculateTotals = (expenses) => {
  return expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
};

export const analyzeCategories = (expenses, totalAmount, customCategories = []) => {
  const grouped = expenses.reduce((acc, curr) => {
    const catId = curr.categoryId;
    if (!acc[catId]) {
      let catInfo = SYSTEM_CATEGORIES.find(c => c.id === catId);
      if (!catInfo) catInfo = customCategories.find(c => c.id === catId);
      const color = catInfo?.color || '#94a3b8';
      const name = catInfo?.label || curr.categoryName || 'Otros';
      acc[catId] = { id: catId, amount: 0, count: 0, name: name, color: color };
    }
    acc[catId].amount += Number(curr.amount);
    acc[catId].count += 1;
    return acc;
  }, {});
  const list = Object.values(grouped)
    .map(cat => ({ ...cat, percentage: totalAmount > 0 ? (cat.amount / totalAmount) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount);
  return { chartData: list, top5: list.slice(0, 5) };
};

export const analyzeTimePatterns = (expenses, period) => {
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayAmounts = new Array(7).fill(0);
  const hourMap = new Array(24).fill(0);
  const trendMap = {};

  expenses.forEach(e => {
    const date = parseDate(e.date);
    const amount = Number(e.amount);
    dayAmounts[date.getDay()] += amount;
    hourMap[date.getHours()] += amount;
    
    // Tendencia simple para el gráfico pequeño
    let key;
    if (period === 'year') {
      key = date.toLocaleDateString('es-MX', { month: 'short' });
    } else {
      key = date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    }
    if (!trendMap[key]) trendMap[key] = { amount: 0, timestamp: date.getTime() };
    trendMap[key].amount += amount;
  });

  const maxDayIndex = dayAmounts.indexOf(Math.max(...dayAmounts));
  const weekData = daysOfWeek.map((day, idx) => ({ name: day, short: day.substring(0, 3), amount: dayAmounts[idx] }));
  const maxHourAmount = Math.max(...hourMap) || 1;
  const hourData = hourMap.map((amount, hour) => ({ hour, label: `${hour}:00`, amount, intensity: amount > 0 ? (amount / maxHourAmount) : 0 }));
  const trendData = Object.keys(trendMap).map(key => ({ date: key, amount: trendMap[key].amount, ts: trendMap[key].timestamp })).sort((a, b) => a.ts - b.ts);

  return { weekData, hourData, trendData, peakDay: daysOfWeek[maxDayIndex], peakHour: hourMap.indexOf(Math.max(...hourMap)) };
};

export const analyzePsychology = (expenses) => {
  const emotions = {};
  const types = { need: 0, impulse: 0, planned: 0 };
  const triggerMap = {}; 
  let total = 0;
  const impulseList = expenses.filter(e => e.purchaseType === 'impulse').sort((a, b) => b.amount - a.amount).slice(0, 5);

  expenses.forEach(e => {
    const amount = Number(e.amount);
    total += amount;
    const emo = e.emotion || 'neutral';
    emotions[emo] = (emotions[emo] || 0) + amount;
    const type = e.purchaseType || 'planned';
    types[type] = (types[type] || 0) + amount;
    if (!triggerMap[emo]) triggerMap[emo] = { total: 0, impulse: 0 };
    triggerMap[emo].total += amount;
    if (type === 'impulse') triggerMap[emo].impulse += amount;
  });

  const emotionsList = Object.keys(emotions).map(key => ({ emotion: key, amount: emotions[key] })).sort((a, b) => b.amount - a.amount);
  let mainTrigger = null;
  let maxImpulseAmount = 0;
  Object.entries(triggerMap).forEach(([emo, stats]) => {
    if (stats.impulse > 0 && stats.impulse > maxImpulseAmount) {
      maxImpulseAmount = stats.impulse;
      mainTrigger = { emotion: emo, ratio: Math.round((stats.impulse / stats.total) * 100), amount: stats.impulse, total: stats.total };
    }
  });

  return {
    emotionsList,
    impulseStats: { ...types, total },
    ratios: {
      need: total > 0 ? Math.round((types.need / total) * 100) : 0,
      planned: total > 0 ? Math.round((types.planned / total) * 100) : 0,
      impulse: total > 0 ? Math.round((types.impulse / total) * 100) : 0
    },
    impulseList,
    mainTrigger
  };
};

// ✅ PREDICCIÓN CORREGIDA Y AGRUPADA CORRECTAMENTE
export const predictFuture = (allHistoryExpenses, period = 'month', customCategories = []) => {
  if (!allHistoryExpenses || allHistoryExpenses.length === 0) return null;

  // 1. Configurar Agrupación Estricta
  let groupingFn;
  let labelFn;
  let unitName;

  if (period === 'day') {
    // Agrupar por DÍA exacto
    unitName = 'Día';
    groupingFn = (date) => date.toISOString().split('T')[0]; // "2024-02-06"
    labelFn = (date) => `${date.getDate()}/${date.getMonth() + 1}`;
  } 
  else if (period === 'week') {
    // Agrupar por SEMANA (Lunes)
    unitName = 'Semana';
    groupingFn = (date) => {
      const d = new Date(date);
      const day = d.getDay() || 7; // Ajustar domingo
      if (day !== 1) d.setHours(-24 * (day - 1)); 
      return d.toISOString().split('T')[0];
    };
    labelFn = (date) => `Sem ${date.getDate()}/${date.getMonth() + 1}`;
  } 
  else {
    // Agrupar por MES (Default)
    unitName = 'Mes';
    groupingFn = (date) => `${date.getFullYear()}-${date.getMonth()}`;
    labelFn = (date) => date.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' });
  }

  // 2. Procesar Datos
  const timelineData = {};
  
  allHistoryExpenses.forEach(e => {
    const date = parseDate(e.date);
    const key = groupingFn(date);
    
    if (!timelineData[key]) {
      timelineData[key] = { amount: 0, date: date, key: key };
    }
    timelineData[key].amount += Number(e.amount);
  });

  // Ordenar cronológicamente
  const historyValues = Object.values(timelineData).sort((a, b) => a.date - b.date);
  const amounts = historyValues.map(v => v.amount);

  if (amounts.length < 1) return { 
    predictedAmount: 0, 
    scenarios: { conservative: 0, normal: 0, pessimistic: 0 }, 
    chartData: [], 
    trend: 'stable',
    periodName: unitName 
  };

  // 3. Cálculos de Predicción
  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const lastVal = amounts[amounts.length - 1];
  const maxVal = Math.max(...amounts);
  const minVal = Math.min(...amounts);

  // Escenarios ajustados a la unidad de tiempo
  const normal = Math.round((lastVal * 0.6) + (avg * 0.4));
  const conservative = Math.round((minVal + normal) / 2);
  const pessimistic = Math.round((maxVal + lastVal) / 2);

  // 4. Datos para el Gráfico
  // Mostramos hasta 6 puntos históricos para que se vea bien en Día/Semana
  const chartData = historyValues.slice(-6).map(v => ({
    name: labelFn(v.date),
    real: v.amount,
    predicted: null
  }));

  // Punto de proyección
  chartData.push({
    name: 'Próximo',
    real: null,
    predicted: normal,
    range: [conservative, pessimistic]
  });

  return {
    predictedAmount: normal,
    scenarios: { conservative, normal, pessimistic },
    chartData,
    trend: normal > avg ? 'up' : 'down',
    confidence: Math.min(90, amounts.length * 10),
    periodName: unitName,
    risks: [] 
  };
};