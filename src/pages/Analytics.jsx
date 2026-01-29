import React, { useMemo } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { SYSTEM_CATEGORIES, EMOTIONS } from '../constants/categories';
import Card from '../components/common/Card';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';

const Analytics = () => {
  const { expenses } = useExpenseStore();

  const data = useMemo(() => {
    // 1. Análisis por Categoría (Requerimiento 7.2)
    const catMap = {};
    expenses.forEach(e => {
      catMap[e.categoryName] = (catMap[e.categoryName] || 0) + e.amount;
    });
    const categoryData = Object.keys(catMap).map(name => ({
      name,
      value: catMap[name],
      color: SYSTEM_CATEGORIES.find(c => c.label === name)?.color || '#94a3b8'
    }));

    // 2. Análisis Psicológico: Gastos por Emoción (Requerimiento 7.8)
    const emoMap = {};
    expenses.forEach(e => {
      const emoLabel = EMOTIONS.find(emo => emo.id === e.emotion)?.label || 'Neutral';
      emoMap[emoLabel] = (emoMap[emoLabel] || 0) + e.amount;
    });
    const emotionData = Object.keys(emoMap).map(name => ({ name, amount: emoMap[name] }));

    // 3. Análisis de Impulso vs Planificado (Requerimiento 7.8)
    const impulseTotal = expenses.filter(e => e.isImpulse).reduce((sum, e) => sum + e.amount, 0);
    const plannedTotal = expenses.filter(e => !e.isImpulse).reduce((sum, e) => sum + e.amount, 0);

    return { categoryData, emotionData, impulseTotal, plannedTotal };
  }, [expenses]);

  return (
    <div className="space-y-8 pb-24">
      <header>
        <h1 className="text-2xl font-bold dark:text-white">Análisis Financiero</h1>
        <p className="text-secondary-500 text-sm">Entiende tus patrones de consumo</p>
      </header>

      {/* Gráfico de Pastel: Distribución por Categoría */}
      <Card>
        <h3 className="text-sm font-bold mb-4 dark:text-white">Distribución por Categoría</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.categoryData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Análisis Psicológico: Gastos por Emoción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-bold mb-4 dark:text-white">Impacto Emocional ($)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.emotionData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="amount" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Impulso vs Planificado */}
        <Card className="flex flex-col justify-center text-center">
          <h3 className="text-sm font-bold mb-6 dark:text-white">Impulso vs Planificado</h3>
          <div className="space-y-6">
            <div>
              <p className="text-3xl font-bold text-danger-500">${data.impulseTotal.toFixed(2)}</p>
              <p className="text-xs text-secondary-500 uppercase tracking-widest">Gastos por Impulso</p>
            </div>
            <div className="h-2 w-full bg-secondary-100 rounded-full overflow-hidden flex">
               <div 
                className="bg-danger-500 h-full" 
                style={{ width: `${(data.impulseTotal / (data.impulseTotal + data.plannedTotal || 1)) * 100}%` }}
               />
            </div>
            <div>
              <p className="text-3xl font-bold text-success-500">${data.plannedTotal.toFixed(2)}</p>
              <p className="text-xs text-secondary-500 uppercase tracking-widest">Gastos Planificados</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detective Financiero (Requerimiento 13.3) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold dark:text-white px-1">Detective Financiero</h3>
        <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-100">
          <div className="flex gap-4">
            <span className="text-2xl">🕵️‍♂️</span>
            <p className="text-sm text-primary-900 dark:text-primary-100">
              {data.impulseTotal > data.plannedTotal 
                ? "Tus emociones están tomando el control. El 50% de tus gastos este mes fueron impulsivos."
                : "¡Gran disciplina! La mayoría de tus gastos fueron planificados."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;