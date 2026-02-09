import React from 'react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Smile, Frown, Meh, AlertTriangle, Star, Target, Zap, Brain, AlertCircle, HelpCircle } from 'lucide-react';

const EMOTION_CONFIG = {
  happy: { label: 'Feliz', icon: Smile, color: '#10b981' },
  sad: { label: 'Triste', icon: Frown, color: '#3b82f6' },
  stressed: { label: 'Estresado', icon: AlertTriangle, color: '#ef4444' },
  neutral: { label: 'Normal', icon: Meh, color: '#94a3b8' },
  excited: { label: 'Emocionado', icon: Star, color: '#f59e0b' }
};

const PsychologyAnalysis = ({ data }) => {
  const { emotionsList, ratios, impulseStats, impulseList, mainTrigger } = data;

  const radarData = emotionsList.map(e => ({
    subject: EMOTION_CONFIG[e.emotion]?.label || e.emotion,
    A: e.amount,
    fullMark: Math.max(...emotionsList.map(i => i.amount), 100)
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. PERFIL DE DECISIÓN */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="text-indigo-500" size={18} />
          <h3 className="font-black text-secondary-900 dark:text-white text-sm uppercase tracking-widest">
            Perfil de Decisión
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {/* Necesidad */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-center hover:scale-105 transition-transform">
            <Target className="text-emerald-500 mx-auto mb-1" size={20} />
            <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Necesidad</p>
            <p className="text-xl font-black text-secondary-900 dark:text-white">{ratios.need}%</p>
            <p className="text-[9px] text-secondary-500 font-medium">${impulseStats.need.toLocaleString()}</p>
          </div>

          {/* Planificado */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-center hover:scale-105 transition-transform">
            <Brain className="text-indigo-500 mx-auto mb-1" size={20} />
            <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Planeado</p>
            <p className="text-xl font-black text-secondary-900 dark:text-white">{ratios.planned}%</p>
            <p className="text-[9px] text-secondary-500 font-medium">${impulseStats.planned.toLocaleString()}</p>
          </div>

          {/* Impulso */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-2xl border border-amber-100 dark:border-amber-800 text-center hover:scale-105 transition-transform">
            <Zap className="text-amber-500 mx-auto mb-1" size={20} />
            <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">Impulso</p>
            <p className="text-xl font-black text-secondary-900 dark:text-white">{ratios.impulse}%</p>
            <p className="text-[9px] text-secondary-500 font-medium">${impulseStats.impulse.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 2. TRIGGER EMOCIONAL (Estilo ProactiveAssistant: Amarillo #FFD700) */}
      {mainTrigger && (
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group cursor-default">
          {/* Fondo Glass Amarillo Exacto al ProactiveAssistant */}
          <div className="absolute inset-0 bg-[#FFD700] opacity-90 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
          
          <div className="relative z-10 p-8">
            {/* Icono de fondo decorativo */}
            <AlertCircle 
              className="absolute -right-6 -top-6 text-[#1e1b4b] opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-700" 
              size={180} 
            />
            
            {/* Header Tarjeta */}
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-[#1e1b4b]/10 backdrop-blur-sm">
                <AlertCircle size={16} className="text-[#1e1b4b]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1e1b4b]/70">
                Patrón Detectado
              </span>
            </div>

            <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 text-[#1e1b4b]">
              {EMOTION_CONFIG[mainTrigger.emotion]?.label || mainTrigger.emotion}
            </h3>
            
            <p className="text-sm font-bold leading-relaxed mb-1 max-w-[90%] text-[#1e1b4b]/80">
              Es tu mayor disparador de gastos impulsivos.
            </p>
            
            <div className="mt-4 p-4 bg-[#1e1b4b]/5 rounded-xl border border-[#1e1b4b]/10 backdrop-blur-sm">
              <p className="text-xs text-[#1e1b4b] font-medium">
                Has gastado <strong className="font-black text-lg">${mainTrigger.amount.toLocaleString()}</strong> en impulsos bajo este estado emocional.
              </p>
              <p className="text-[10px] text-[#1e1b4b]/60 mt-1 uppercase font-bold tracking-wider">
                Representa el {mainTrigger.ratio}% de tu gasto en esta emoción
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAPA EMOCIONAL (Radar + Lista) */}
      <div className="bg-white dark:bg-secondary-900 p-6 rounded-[2.5rem] shadow-sm border border-secondary-100 dark:border-secondary-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-secondary-900 dark:text-white text-sm uppercase tracking-widest">
            Mapa Emocional
          </h3>
          <HelpCircle size={16} className="text-secondary-400" />
        </div>
        
        {radarData.length > 0 ? (
          <>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                  <Radar
                    name="Gastos"
                    dataKey="A"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="#8b5cf6"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Lista Detallada */}
            <div className="mt-6 space-y-3 border-t border-secondary-100 dark:border-secondary-800 pt-6">
              {emotionsList.map((item) => {
                const Config = EMOTION_CONFIG[item.emotion] || EMOTION_CONFIG.neutral;
                const Icon = Config.icon;
                return (
                  <div key={item.emotion} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-white dark:bg-secondary-700 shadow-sm">
                        <Icon size={16} style={{ color: Config.color }} />
                      </div>
                      <span className="text-sm font-bold text-secondary-700 dark:text-secondary-300">
                        {Config.label}
                      </span>
                    </div>
                    <span className="font-black text-secondary-900 dark:text-white">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="h-32 flex items-center justify-center text-xs text-secondary-400">
            Sin datos emocionales aún.
          </div>
        )}
      </div>

      {/* 4. REVISIÓN DE IMPULSOS */}
      {impulseList.length > 0 && (
        <div className="bg-white dark:bg-secondary-900 p-6 rounded-[2.5rem] shadow-sm border border-secondary-100 dark:border-secondary-800">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-amber-500" />
            <h3 className="font-black text-secondary-900 dark:text-white text-sm uppercase tracking-widest">
              ¿Realmente lo necesitabas?
            </h3>
          </div>
          
          <div className="space-y-3">
            {impulseList.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-secondary-800 flex items-center justify-center text-lg shadow-sm">
                    🛒
                  </div>
                  <div>
                    <p className="text-xs font-bold text-secondary-900 dark:text-white line-clamp-1">
                      {item.description || item.categoryName || "Gasto sin nombre"}
                    </p>
                    <p className="text-[9px] text-secondary-500 font-bold uppercase">
                      {new Date(item.date?.seconds * 1000 || item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-black text-red-500">
                  -${Number(item.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologyAnalysis;