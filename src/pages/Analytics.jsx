import React, { useState } from 'react';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { 
  Calendar, TrendingUp, TrendingDown, Brain, LineChart, Target, ArrowRight, Clock
} from 'lucide-react';
import { TrendChart } from '../components/analytics/charts/TrendChart';
import { WeekBarChart } from '../components/analytics/charts/WeekBarChart';
import { HourlyHeatmap } from '../components/analytics/charts/HourlyHeatmap';
import CategoryChart from '../components/analytics/CategoryChart';
import PredictionChart from '../components/analytics/PredictionChart';
import PsychologyAnalysis from '../components/analytics/PsychologyAnalysis';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Analytics = () => {
  const { period, setPeriod, customRange, setCustomRange, data } = useAnalyticsData();
  const [activeTab, setActiveTab] = useState('general');

  if (!data) return <LoadingSpinner />;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* HEADER Y TABS */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-secondary-900 dark:text-white italic uppercase tracking-tighter">
            Análisis
          </h2>
          {/* Tabs Selector */}
          <div className="flex bg-secondary-100 dark:bg-secondary-800 p-1 rounded-xl self-start sm:self-auto">
            {[
              { id: 'general', icon: LineChart },
              { id: 'psychology', icon: Brain },
              { id: 'prediction', icon: Target }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2 sm:px-4 rounded-lg transition-all flex items-center gap-2 ${activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-secondary-400 hover:text-secondary-600'}`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline text-xs font-bold uppercase">{tab.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Periodo */}
        <div className="flex flex-col gap-2">
          <div className="flex bg-white dark:bg-secondary-900 p-1 rounded-2xl shadow-sm overflow-x-auto no-scrollbar touch-pan-x">
            {['day', 'week', 'month', 'year', 'custom'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 min-w-[70px] px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap
                  ${period === p 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800'}`}
              >
                {p === 'day' ? 'Día' : p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : p === 'year' ? 'Año' : 'Rango'}
              </button>
            ))}
          </div>
          
          {/* Selector Fechas Personalizado */}
          {period === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-2 animate-in slide-in-from-top-2">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
                className="flex-1 bg-white dark:bg-secondary-900 p-3 rounded-xl text-xs font-bold border border-secondary-200 dark:border-secondary-700 outline-none focus:border-indigo-500"
              />
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                className="flex-1 bg-white dark:bg-secondary-900 p-3 rounded-xl text-xs font-bold border border-secondary-200 dark:border-secondary-700 outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>
      </div>

      {!data.hasData ? (
        <div className="flex flex-col items-center justify-center h-64 opacity-50 bg-white/50 dark:bg-secondary-900/50 rounded-[2rem] border-2 border-dashed border-secondary-200 dark:border-secondary-800">
          <Calendar size={48} className="text-secondary-300 mb-2"/>
          <p className="text-xs font-bold uppercase tracking-widest text-secondary-400">Sin datos en este periodo</p>
        </div>
      ) : (
        <>
          {/* === VISTA GENERAL === */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-secondary-900 p-5 rounded-[2rem] shadow-sm border border-secondary-100 dark:border-secondary-800">
                  <p className="text-[10px] font-black uppercase text-secondary-400 mb-1">Gasto Total</p>
                  <h3 className="text-3xl font-black text-secondary-900 dark:text-white tracking-tight">
                    ${data.totalCurrent.toLocaleString()}
                  </h3>
                  <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${
                    data.variation > 0 ? 'text-red-500' : 'text-emerald-500'
                  }`}>
                    {data.variation > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{Math.abs(data.variation).toFixed(1)}% vs anterior</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-secondary-900 p-5 rounded-[2rem] shadow-sm border border-secondary-100 dark:border-secondary-800">
                  <p className="text-[10px] font-black uppercase text-secondary-400 mb-1">Mayor Gasto</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-secondary-900 dark:text-white truncate max-w-[70%]">
                      {data.categories.top5[0]?.name || '-'}
                    </h3>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: data.categories.top5[0]?.color || '#eee' }}>
                      <Target size={14} className="text-white mix-blend-overlay" />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-indigo-500 mt-1">
                    ${data.categories.top5[0]?.amount.toLocaleString() || 0}
                  </p>
                </div>
              </div>

              {/* Tendencias */}
              <div className="bg-white dark:bg-secondary-900 p-6 rounded-[2.5rem] shadow-sm border border-secondary-100 dark:border-secondary-800 overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="font-black text-secondary-900 dark:text-white text-sm uppercase tracking-widest">
                    Tendencia
                  </h3>
                </div>
                <div className="-ml-2"> 
                  <TrendChart data={data.time.trendData} />
                </div>
              </div>

              {/* Patrones de Tiempo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-secondary-900 p-6 rounded-[2.5rem] shadow-sm border border-secondary-100 dark:border-secondary-800">
                  <h3 className="font-black text-secondary-900 dark:text-white text-sm uppercase tracking-widest mb-4">
                    Días Pico
                  </h3>
                  <WeekBarChart data={data.time.weekData} peakDay={data.time.peakDay} />
                  <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-xl text-center">
                    <p className="text-xs text-secondary-500">
                      Gastas más los <span className="text-indigo-600 font-black uppercase">{data.time.peakDay}</span>.
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-secondary-900 p-6 rounded-[2.5rem] shadow-sm border border-secondary-100 dark:border-secondary-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-secondary-400" />
                    <h3 className="font-black text-secondary-900 dark:text-white text-sm uppercase tracking-widest">
                      Horario de Consumo
                    </h3>
                  </div>
                  <HourlyHeatmap data={data.time.hourData} peakHour={data.time.peakHour} />
                </div>
              </div>

              {/* Desglose Detallado */}
              <div className="bg-white dark:bg-secondary-900 p-6 rounded-[2.5rem] shadow-sm border border-secondary-100 dark:border-secondary-800">
                <h3 className="font-black text-secondary-900 dark:text-white text-sm uppercase tracking-widest mb-6">
                  Desglose Detallado
                </h3>
                
                {data.categories.chartData.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex items-center justify-center">
                      <CategoryChart data={data.categories.chartData} />
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                      {data.categories.chartData.map((cat, idx) => (
                        <div key={idx} className="group flex items-center justify-between p-3 bg-secondary-50/50 dark:bg-secondary-800/30 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-2xl transition-all">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: cat.color }} />
                            <span className="text-xs font-bold text-secondary-700 dark:text-secondary-300 truncate">
                              {cat.name}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="block text-xs font-black text-secondary-900 dark:text-white">
                              ${cat.amount.toLocaleString()}
                            </span>
                            <span className="text-[9px] font-bold text-secondary-400">
                              {Math.round(cat.percentage)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === VISTA PSICOLOGÍA === */}
          {activeTab === 'psychology' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <PsychologyAnalysis data={data.psychology} />
            </div>
          )}

          {/* === VISTA PREDICCIÓN (IA) === */}
          {activeTab === 'prediction' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              {/* ✅ CORRECCIÓN AQUÍ: Pasamos el objeto completo 'predictionData' */}
              <PredictionChart predictionData={data.prediction} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;