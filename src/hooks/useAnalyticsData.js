import { useState, useMemo, useEffect } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { useAuthStore } from '../stores/authStore';
import { useCategoryStore } from '../stores/categoryStore';
import * as Engine from '../utils/analyticsEngine';
import { getDateRange, getPreviousPeriod, parseDate } from '../utils/dateHelpers';

export const useAnalyticsData = () => {
  const { expenses, subscribeExpenses } = useExpenseStore();
  const { customCategories, subscribeCategories } = useCategoryStore();
  const { user } = useAuthStore();
  
  const [period, setPeriod] = useState('month'); 
  const [customRange, setCustomRange] = useState({ 
    start: new Date().toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });

  useEffect(() => {
    if (user) {
      if (expenses.length === 0) subscribeExpenses(user.uid);
      if (customCategories.length === 0) subscribeCategories(user.uid);
    }
  }, [user, expenses.length, subscribeExpenses, customCategories.length, subscribeCategories]);

  const data = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return {
        hasData: false,
        totalCurrent: 0, totalPrev: 0, variation: 0,
        categories: { chartData: [], top5: [] },
        time: { weekData: [], hourData: [], trendData: [], insights: {} },
        psychology: { emotionsList: [], impulseStats: { total: 0 } },
        prediction: { amount: 0, scenarios: { normal: 0 }, chartData: [] }
      };
    }

    // ✅ CORRECCIÓN 1: Eliminar duplicados por ID
    const uniqueExpenses = expenses.reduce((acc, current) => {
      const existing = acc.find(item => item.id === current.id);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, []);

    // ✅ CORRECCIÓN 2: Validar que los gastos tengan amount válido
    const validExpenses = uniqueExpenses.filter(e => {
      const amount = Number(e.amount);
      return !isNaN(amount) && amount > 0;
    });

    const { start, end } = getDateRange(period, customRange.start, customRange.end);
    const { start: prevStart, end: prevEnd } = getPreviousPeriod(start, end);

    const currentExpenses = validExpenses.filter(e => {
      const d = parseDate(e.date);
      return d >= start && d <= end;
    });
    
    const prevExpenses = validExpenses.filter(e => {
      const d = parseDate(e.date);
      return d >= prevStart && d <= prevEnd;
    });

    const totalCurrent = Engine.calculateTotals(currentExpenses);
    const totalPrev = Engine.calculateTotals(prevExpenses);
    const variation = totalPrev === 0 ? 100 : ((totalCurrent - totalPrev) / totalPrev) * 100;

    const categories = Engine.analyzeCategories(currentExpenses, totalCurrent, customCategories);
    const time = Engine.analyzeTimePatterns(currentExpenses, period);
    const psychology = Engine.analyzePsychology(currentExpenses);
    
    // ✅ CORRECCIÓN CRÍTICA: Pasar currentExpenses para respetar el filtro de periodo
    const prediction = Engine.predictFuture(currentExpenses, period, customCategories);

    return {
      currentExpenses,
      totalCurrent,
      totalPrev,
      variation,
      categories,
      time,
      psychology,
      prediction,
      hasData: currentExpenses.length > 0
    };
  }, [expenses, period, customRange, customCategories]);

  return {
    period,
    setPeriod,
    customRange,
    setCustomRange,
    data
  };
};