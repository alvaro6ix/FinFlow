import { SYSTEM_CATEGORIES } from "../constants/categories";
import { parseDate } from "./dateHelpers";

// ✅ FIX ZONA HORARIA (USA FECHA LOCAL, NO UTC)
const getLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- HELPERS BÁSICOS ---
export const calculateTotals = (expenses) => {
  return expenses.reduce((acc, curr) => {
    const amount = Number(curr.amount);
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);
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
  const processedIds = new Set();

  expenses.forEach(e => {
    if (e.id && processedIds.has(e.id)) return;
    if (e.id) processedIds.add(e.id);

    const date = parseDate(e.date);
    const amount = Number(e.amount);
    if (isNaN(amount) || amount <= 0) return;

    dayAmounts[date.getDay()] += amount;
    hourMap[date.getHours()] += amount;

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

// ✅ PREDICCIÓN COMPLETA (SOLO FIX FECHAS)
export const predictFuture = (currentPeriodExpenses, period = 'month', customCategories = []) => {

  let groupingFn;
  let labelFn;
  let unitName;
  let nextLabel;

  if (period === 'day') {
    unitName = 'Día';
    nextLabel = 'Próxima Hora';
    groupingFn = (date) => `${getLocalDateKey(date)}-H${date.getHours()}`;
    labelFn = (date) => `${date.getHours()}:00`;
  } 
  else if (period === 'week') {
    unitName = 'Semana';
    nextLabel = 'Próximo';
    const daysNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    groupingFn = (date) => getLocalDateKey(date);
    labelFn = (date) => daysNames[date.getDay()];
  }
  else if (period === 'month') {
    unitName = 'Mes';
    nextLabel = 'Próximo';
    groupingFn = (date) => {
      const weekNumber = Math.ceil(date.getDate() / 7);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-W${weekNumber}`;
    };
    labelFn = (date) => `Sem ${Math.ceil(date.getDate() / 7)}`;
  }
  else if (period === 'year') {
    unitName = 'Año';
    nextLabel = 'Próximo';
    groupingFn = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    labelFn = (date) => ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][date.getMonth()];
  }
  else {
    unitName = 'Periodo';
    nextLabel = 'Próximo';
    groupingFn = (date) => getLocalDateKey(date);
    labelFn = (date) => `${date.getDate()}/${date.getMonth() + 1}`;
  }

  const timelineData = {};
  const processedIds = new Set();

  currentPeriodExpenses.forEach((e, index) => {
    const date = parseDate(e.date);
    const key = groupingFn(date);

    const uniqueKey = e.id || `temp-${index}-${e.date}-${e.amount}`;
    if (processedIds.has(uniqueKey)) return;
    processedIds.add(uniqueKey);

    if (!timelineData[key]) {
      timelineData[key] = { amount: 0, date: date, key: key };
    }

    timelineData[key].amount += Number(e.amount);
  });

  const historyValues = Object.values(timelineData).sort((a, b) => a.date - b.date);
  const amounts = historyValues.map(v => v.amount);

  if (amounts.length < 1) {
    return { 
      predictedAmount: 0, 
      scenarios: { conservative: 0, normal: 0, pessimistic: 0 }, 
      chartData: [], 
      trend: 'stable',
      confidence: 0,
      periodName: unitName 
    };
  }

  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const lastVal = amounts[amounts.length - 1] || avg;
  const maxVal = Math.max(...amounts);
  const minVal = Math.min(...amounts);

  const normal = Math.round((lastVal * 0.6) + (avg * 0.4));
  const conservative = Math.round((minVal + normal) / 2);
  const pessimistic = Math.round((maxVal + lastVal) / 2);

  const chartData = historyValues.map(v => ({
    name: labelFn(v.date),
    real: v.amount,
    predicted: null
  }));

  chartData.push({
    name: nextLabel,
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
