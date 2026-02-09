import React from 'react';

export const HourlyHeatmap = ({ data, peakHour }) => {
  // Dividimos en bloques de 6 horas para mejor lectura (Madrugada, Mañana, Tarde, Noche)
  const blocks = [
    { label: 'Madrugada (0-5)', hours: data.slice(0, 6) },
    { label: 'Mañana (6-11)', hours: data.slice(6, 12) },
    { label: 'Tarde (12-17)', hours: data.slice(12, 18) },
    { label: 'Noche (18-23)', hours: data.slice(18, 24) },
  ];

  return (
    <div className="w-full space-y-4">
      {blocks.map((block, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-secondary-400 uppercase tracking-widest ml-1">
            {block.label}
          </span>
          <div className="grid grid-cols-6 gap-2">
            {block.hours.map((item) => (
              <div key={item.hour} className="group relative flex flex-col items-center">
                {/* Celda del Heatmap */}
                <div 
                  className={`w-full h-8 sm:h-10 rounded-lg transition-all duration-300 relative
                    ${item.hour === peakHour ? 'ring-2 ring-[#FFD700] ring-offset-1 dark:ring-offset-secondary-900 scale-105 z-10' : 'hover:scale-105'}
                  `}
                  style={{ 
                    backgroundColor: item.amount > 0 ? '#6366f1' : '#e2e8f0', // Indigo activo / Gris inactivo
                    opacity: item.amount > 0 ? Math.max(0.3, item.intensity) : 0.3, // Opacidad según gasto
                  }}
                >
                  {/* Tooltip FLOTANTE (Solo aparece al hover) */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1e1b4b] text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-xl z-20 transition-opacity">
                    {item.label} • ${item.amount.toLocaleString()}
                    {/* Flechita del tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1e1b4b]"></div>
                  </div>
                </div>
                
                {/* Etiqueta de hora simple */}
                <span className={`text-[8px] font-bold mt-1 ${item.hour === peakHour ? 'text-[#FFD700]' : 'text-secondary-300'}`}>
                  {item.hour}h
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Leyenda Simple */}
      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-[8px] text-secondary-400 font-bold uppercase">Menos</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded bg-[#6366f1] opacity-30"></div>
          <div className="w-3 h-3 rounded bg-[#6366f1] opacity-60"></div>
          <div className="w-3 h-3 rounded bg-[#6366f1] opacity-100"></div>
        </div>
        <span className="text-[8px] text-secondary-400 font-bold uppercase">Más</span>
      </div>
    </div>
  );
};