import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Sparkles, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, BrainCircuit } from 'lucide-react';

const PredictionChart = ({ predictionData }) => {
  const [selectedScenario, setSelectedScenario] = useState('normal'); 

  useEffect(() => {
    setSelectedScenario('normal');
  }, [predictionData]);

  if (!predictionData || !predictionData.scenarios) return null;

  const { scenarios, confidence, chartData, trend, periodName } = predictionData;
  const currentAmount = scenarios[selectedScenario];
  
  // Datos reactivos al escenario
  const activeChartData = chartData.map(item => {
    if (item.name === 'Próximo') {
      return { ...item, predicted: scenarios[selectedScenario] };
    }
    return item;
  });

  const getScenarioText = () => {
    if (selectedScenario === 'conservative') return "Ahorro Máximo: Si reduces gastos no esenciales.";
    if (selectedScenario === 'pessimistic') return "Alto Gasto: Si mantienes picos de consumo elevados.";
    return `Probable: Basado en tu comportamiento reciente por ${periodName.toLowerCase()}.`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. TARJETA PRINCIPAL (GOLDEN) */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#FFD700] text-[#1e1b4b] shadow-xl shadow-yellow-500/20 p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        <BrainCircuit className="absolute -right-6 -top-6 text-[#1e1b4b] opacity-10 rotate-12" size={180} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#1e1b4b]/10 rounded-xl backdrop-blur-sm">
                <Sparkles size={18} className="text-[#1e1b4b]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                IA Predictiva
              </span>
            </div>
            <span className="text-[10px] font-bold bg-[#1e1b4b]/10 px-3 py-1 rounded-full">
              {confidence}% Confianza
            </span>
          </div>

          <h3 className="text-sm font-bold opacity-80 mb-1">Estimación para el próximo {periodName}</h3>
          
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-5xl font-black tracking-tighter">
              ${currentAmount.toLocaleString()}
            </span>
            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
              trend === 'up' ? 'bg-red-500/10 text-red-800' : 'bg-green-600/10 text-green-900'
            }`}>
              {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend === 'up' ? 'Alza' : 'Baja'}
            </div>
          </div>

          <div className="p-4 bg-[#1e1b4b]/5 rounded-2xl border border-[#1e1b4b]/5">
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              "{getScenarioText()}"
            </p>
          </div>
        </div>
      </div>

      {/* 2. ESCENARIOS INTERACTIVOS */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setSelectedScenario('conservative')}
          className={`p-3 rounded-3xl border transition-all text-center group ${
            selectedScenario === 'conservative' 
              ? 'bg-emerald-100 border-emerald-300 ring-2 ring-emerald-500 scale-105' 
              : 'bg-white dark:bg-secondary-900 border-secondary-200 dark:border-secondary-800'
          }`}
        >
          <ShieldCheck size={20} className="mx-auto mb-2 text-emerald-500" />
          <p className="text-[9px] font-black uppercase text-secondary-400 mb-1">Ahorro</p>
          <p className="text-xs font-black text-emerald-700">${scenarios.conservative.toLocaleString()}</p>
        </button>

        <button 
          onClick={() => setSelectedScenario('normal')}
          className={`p-3 rounded-3xl border transition-all text-center group ${
            selectedScenario === 'normal' 
              ? 'bg-indigo-100 border-indigo-300 ring-2 ring-indigo-500 scale-105' 
              : 'bg-white dark:bg-secondary-900 border-secondary-200 dark:border-secondary-800'
          }`}
        >
          <Sparkles size={20} className="mx-auto mb-2 text-indigo-500" />
          <p className="text-[9px] font-black uppercase text-secondary-400 mb-1">Probable</p>
          <p className="text-xs font-black text-indigo-700">${scenarios.normal.toLocaleString()}</p>
        </button>

        <button 
          onClick={() => setSelectedScenario('pessimistic')}
          className={`p-3 rounded-3xl border transition-all text-center group ${
            selectedScenario === 'pessimistic' 
              ? 'bg-rose-100 border-rose-300 ring-2 ring-rose-500 scale-105' 
              : 'bg-white dark:bg-secondary-900 border-secondary-200 dark:border-secondary-800'
          }`}
        >
          <AlertTriangle size={20} className="mx-auto mb-2 text-rose-500" />
          <p className="text-[9px] font-black uppercase text-secondary-400 mb-1">Alto</p>
          <p className="text-xs font-black text-rose-700">${scenarios.pessimistic.toLocaleString()}</p>
        </button>
      </div>

      {/* 3. GRÁFICO VISUAL */}
      <div className="bg-white dark:bg-secondary-900 p-6 rounded-[2.5rem] shadow-sm border border-secondary-100 dark:border-secondary-800">
        <h3 className="font-black text-secondary-900 dark:text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
          <TrendingUp size={16} />
          Proyección Visual ({periodName})
        </h3>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 'bold' }} 
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94A3B8' }} 
                tickFormatter={(val) => `$${val}`} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e1b4b', color: 'white' }}
                itemStyle={{ color: '#FFD700' }}
                formatter={(value, name) => [
                  `$${value.toLocaleString()}`, 
                  name === 'real' ? 'Gasto Real' : 'Proyección'
                ]}
              />
              
              <Area type="monotone" dataKey="real" stroke="#4f46e5" strokeWidth={3} fill="url(#colorReal)" />
              
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#FFD700" 
                strokeDasharray="5 5" 
                strokeWidth={3} 
                fill="url(#colorPred)" 
                animationDuration={1000}
                dot={{ r: 4, fill: '#FFD700', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart;