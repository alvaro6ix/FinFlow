import React, { useMemo } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { getImpulseAnalysis, predictNextMonthExpense } from '../utils/calculations';
import { exportToCSV } from '../utils/exportData';
import Card from '../components/common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Analytics = () => {
  const { expenses } = useExpenseStore();
  
  const impulseData = useMemo(() => getImpulseAnalysis(expenses), [expenses]);
  const prediction = useMemo(() => predictNextMonthExpense(expenses), [expenses]);

  const emotionColors = {
    happy: '#f59e0b', stressed: '#ef4444', sad: '#3b82f6', neutral: '#10b981', excited: '#8b5cf6'
  };

  const chartData = Object.entries(impulseData.emotions).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Análisis Avanzado</h1>
        <button 
          onClick={() => exportToCSV(expenses)}
          className="bg-secondary-900 text-white px-4 py-2 rounded-xl text-sm font-bold"
        >
          📥 Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Predicción Próximo Mes">
          <p className="text-4xl font-bold text-primary-600">${prediction.toFixed(2)}</p>
          <p className="text-sm text-secondary-500 mt-2">Basado en tus patrones de gasto históricos.</p>
        </Card>

        <Card title="Impacto Emocional">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={emotionColors[entry.name] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm font-medium">Principal disparador: <span className="capitalize font-bold">{impulseData.mainTrigger || 'N/A'}</span></p>
          </div>
        </Card>
      </div>

      <Card title="Gastos Impulsivos vs Planificados">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-secondary-600">Total en impulsos</span>
            <span className="font-bold text-danger-600">${impulseData.totalImpulse.toFixed(2)}</span>
          </div>
          <div className="w-full bg-secondary-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-danger-500 h-full" 
              style={{ width: `${(impulseData.totalImpulse / prediction * 100) || 0}%` }}
            />
          </div>
          <p className="text-xs text-secondary-500 italic">"Los gastos realizados bajo estrés representan el mayor riesgo para tu ahorro."</p>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;