import React, { useMemo } from 'react';
import { useExpenseStore } from '../stores/expenseStore';
import { SYSTEM_CATEGORIES, EMOTIONS } from '../constants/categories';
import Layout from '../components/layout/Layout';
import CategoryChart from '../components/analytics/CategoryChart';
import TrendChart from '../components/analytics/TrendChart';
import Card from '../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, startOfWeek, eachDayOfInterval, endOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const Analytics = () => {
  const { expenses } = useExpenseStore();

  const analysis = useMemo(() => {
    // 1. Datos para CategoryChart
    const catMap = {};
    expenses.forEach(e => {
      catMap[e.categoryId] = (catMap[e.categoryId] || 0) + e.amount;
    });
    const categoryData = SYSTEM_CATEGORIES.map(c => ({
      name: c.label,
      value: catMap[c.id] || 0,
      color: c.color
    })).filter(c => c.value > 0);

    const totalSpent = categoryData.reduce((sum, c) => sum + c.value, 0);

    // 2. Datos para TrendChart (Días de la semana)
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    const trendData = eachDayOfInterval({ start, end }).map(day => ({
      label: format(day, 'EEE', { locale: es }).toUpperCase(),
      amount: expenses
        .filter(e => isSameDay(new Date(e.date), day))
        .reduce((sum, e) => sum + e.amount, 0)
    }));

    // 3. Impacto Emocional (Requerimiento 7.8)
    const emoData = EMOTIONS.map(emo => ({
      name: emo.label,
      amount: expenses
        .filter(e => e.emotion === emo.id)
        .reduce((sum, e) => sum + e.amount, 0),
      color: emo.impact === 'impulse' ? '#ef4444' : '#10b981'
    })).filter(e => e.amount > 0);

    // 4. Detective Financiero (Requerimiento 13.3)
    const impulseTotal = expenses.filter(e => e.isImpulse).reduce((sum, e) => sum + e.amount, 0);
    const plannedTotal = expenses.filter(e => !e.isImpulse).reduce((sum, e) => sum + e.amount, 0);
    const impulseRatio = (impulseTotal / (totalSpent || 1)) * 100;

    return { categoryData, totalSpent, trendData, emoData, impulseTotal, plannedTotal, impulseRatio };
  }, [expenses]);

  return (
    <div className="space-y-8 pb-32">
      <header className="px-2">
        <h1 className="text-3xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter">Análisis <span className="text-primary-600">Pro</span></h1>
        <p className="text-secondary-500 text-sm font-medium italic">Revelando tus patrones de comportamiento.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={analysis.categoryData} total={analysis.totalSpent} />
        <TrendChart data={analysis.trendData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Análisis Psicológico */}
        <Card title="Impacto Emocional ($)">
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysis.emoData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                  {analysis.emoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Impulso vs Planificado */}
        <Card title="Fuerza de Voluntad">
          <div className="flex flex-col justify-center h-full space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-4xl font-black text-danger-500 tracking-tighter">${analysis.impulseTotal.toFixed(0)}</p>
                <p className="text-[10px] font-black text-secondary-400 uppercase">Impulso</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black text-success-500 tracking-tighter">${analysis.plannedTotal.toFixed(0)}</p>
                <p className="text-[10px] font-black text-secondary-400 uppercase">Planificado</p>
              </div>
            </div>
            <div className="h-4 w-full bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden flex shadow-inner">
               <div className="bg-danger-500 h-full transition-all duration-1000" style={{ width: `${analysis.impulseRatio}%` }} />
            </div>
            <p className="text-center text-xs font-bold text-secondary-500 italic">
              El {analysis.impulseRatio.toFixed(1)}% de tus gastos son por impulso.
            </p>
          </div>
        </Card>
      </div>

      {/* Detective Financiero (Requerimiento 13.3) */}
      <Card className="bg-gradient-to-br from-secondary-900 to-secondary-800 text-white border-none shadow-2xl">
        <div className="flex items-start gap-6">
          <div className="text-5xl">🕵️‍♂️</div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Detective Financiero</h3>
            <p className="text-secondary-300 text-sm leading-relaxed">
              {analysis.impulseRatio > 40 
                ? "Hemos detectado que tus emociones (especialmente el estrés) están disparando compras no planificadas. Sugerencia: Aplica la regla de las 24 horas en la categoría de Compras."
                : "¡Excelente control! Tus patrones muestran que la mayoría de tus salidas de dinero están alineadas con tus objetivos a largo plazo."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;