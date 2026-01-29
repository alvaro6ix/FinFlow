import React, { useEffect, useMemo } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import Card from '../components/common/Card';
import { DEFAULT_CATEGORIES } from '../constants/categories';


const Dashboard = () => {
  const { expenses, loadExpenses } = useExpenseStore();
  const { user } = useAuthStore();
  const { currency } = useSettingsStore();

  useEffect(() => {
    if (user) {
      loadExpenses(user.uid);
    }
  }, [user]);

  // Calcular datos del mes actual
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= firstDay && expDate <= lastDay;
    });

    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const daysInMonth = lastDay.getDate();
    const currentDay = now.getDate();
    const daysRemaining = daysInMonth - currentDay;
    const projection = (total / currentDay) * daysInMonth;

    return {
      total,
      count: monthExpenses.length,
      daysRemaining,
      projection,
      expenses: monthExpenses,
    };
  }, [expenses]);

  // Calcular mes anterior para comparación
  const previousMonthData = useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);

    const monthExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= firstDay && expDate <= lastDay;
    });

    return monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  // Calcular score de salud financiera (simplificado)
  const healthScore = useMemo(() => {
    // Aquí puedes agregar lógica más compleja
    // Por ahora, basado en comparación con mes anterior
    const comparison = previousMonthData > 0 
      ? ((previousMonthData - currentMonthData.total) / previousMonthData) * 100
      : 50;
    
    const score = Math.max(0, Math.min(100, 70 + comparison));
    return Math.round(score);
  }, [currentMonthData, previousMonthData]);

  // Top categorías del mes
  const topCategories = useMemo(() => {
    const categoryTotals = {};

    currentMonthData.expenses.forEach((exp) => {
      if (!categoryTotals[exp.categoryId]) {
        categoryTotals[exp.categoryId] = 0;
      }
      categoryTotals[exp.categoryId] += exp.amount;
    });

    return Object.entries(categoryTotals)
      .map(([id, total]) => {
        const category = DEFAULT_CATEGORIES.find((cat) => cat.id === id);
        return {
          id,
          name: category?.name || 'Otro',
          icon: category?.icon || '💰',
          total,
          percentage: (total / currentMonthData.total) * 100,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [currentMonthData]);

  // Gastos hormiga (< $50)
  const smallExpenses = useMemo(() => {
    return currentMonthData.expenses
      .filter((exp) => exp.amount < 50)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [currentMonthData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getHealthColor = (score) => {
    if (score >= 70) return 'text-success-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getHealthBgColor = (score) => {
    if (score >= 70) return 'bg-success-500';
    if (score >= 40) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Tu resumen financiero del mes
        </p>
      </div>

      {/* Health Score */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary-200 dark:text-secondary-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(healthScore / 100) * 351.86} 351.86`}
                className={getHealthBgColor(healthScore)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getHealthColor(healthScore)}`}>
                  {healthScore}
                </div>
                <div className="text-xs text-secondary-500">Score</div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
              Salud Financiera
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400">
              {healthScore >= 70 && '¡Excelente! Tu salud financiera es muy buena 🎉'}
              {healthScore >= 40 && healthScore < 70 && 'Vas bien, pero puedes mejorar 💪'}
              {healthScore < 40 && 'Necesitas ajustar tus gastos ⚠️'}
            </p>
          </div>
        </div>
      </Card>

      {/* Resumen del Mes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
              Total Gastado
            </p>
            <p className="text-3xl font-bold text-primary-600">
              {formatCurrency(currentMonthData.total)}
            </p>
            <p className="text-xs text-secondary-500 mt-2">
              {currentMonthData.count} gastos registrados
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
              Proyección Mes
            </p>
            <p className="text-3xl font-bold text-info-600">
              {formatCurrency(currentMonthData.projection)}
            </p>
            <p className="text-xs text-secondary-500 mt-2">
              Quedan {currentMonthData.daysRemaining} días
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
              vs Mes Anterior
            </p>
            <p
              className={`text-3xl font-bold ${
                currentMonthData.total < previousMonthData
                  ? 'text-success-600'
                  : 'text-danger-600'
              }`}
            >
              {currentMonthData.total < previousMonthData ? '↓' : '↑'}{' '}
              {Math.abs(
                ((currentMonthData.total - previousMonthData) / previousMonthData) * 100
              ).toFixed(1)}
              %
            </p>
            <p className="text-xs text-secondary-500 mt-2">
              {formatCurrency(Math.abs(currentMonthData.total - previousMonthData))}
            </p>
          </div>
        </Card>
      </div>

      {/* Top 5 Categorías */}
      <Card title="Top 5 Categorías del Mes">
        <div className="space-y-4">
          {topCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium text-secondary-900 dark:text-white">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-secondary-900 dark:text-white">
                    {formatCurrency(category.total)}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {category.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Gastos Hormiga */}
      {smallExpenses > 0 && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="text-4xl">🐜</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-secondary-900 dark:text-white">
                Gastos Hormiga
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Pequeños gastos que suman
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-warning-600">
                {formatCurrency(smallExpenses)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Insights Automáticos */}
      <Card title="💡 Insights">
        <div className="space-y-3">
          {currentMonthData.total > previousMonthData && (
            <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
              <p className="text-sm text-warning-800 dark:text-warning-200">
                Gastaste {((currentMonthData.total - previousMonthData) / previousMonthData * 100).toFixed(1)}% más que el mes pasado
              </p>
            </div>
          )}

          {currentMonthData.total < previousMonthData && (
            <div className="p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
              <p className="text-sm text-success-800 dark:text-success-200">
                ¡Lograste ahorrar {formatCurrency(previousMonthData - currentMonthData.total)} este mes! 🎉
              </p>
            </div>
          )}

          <div className="p-4 bg-info-50 dark:bg-info-900/20 rounded-lg border border-info-200 dark:border-info-800">
            <p className="text-sm text-info-800 dark:text-info-200">
              A este ritmo, gastarás {formatCurrency(currentMonthData.projection)} este mes
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;