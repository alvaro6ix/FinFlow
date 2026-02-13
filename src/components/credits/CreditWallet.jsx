import React from 'react';
import { Plus, Settings, AlertCircle, Calendar } from 'lucide-react';
import { getCardStatus } from '../../utils/creditCalculations';

const CreditWallet = ({ cards, onAddCard, onEditCard }) => {
  return (
    <div className="w-full overflow-x-auto pb-10 pt-4 px-2 snap-x custom-scrollbar">
      <div className="flex gap-5">
        {/* BOTÓN AGREGAR */}
        <button 
          onClick={onAddCard}
          className="flex-shrink-0 w-80 h-48 rounded-[2.5rem] border-2 border-dashed border-secondary-300 dark:border-white/10 flex flex-col items-center justify-center gap-3 text-secondary-400 hover:bg-secondary-50 dark:hover:bg-white/5 hover:border-secondary-400 dark:hover:border-white/20 transition-all snap-center group"
        >
          <div className="w-14 h-14 rounded-full bg-secondary-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Plus size={28} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Nueva Tarjeta</span>
        </button>

        {/* LISTA DE TARJETAS */}
        {cards.map((card) => {
            const usagePercent = Math.min(100, ((card.currentBalance || 0) / card.limit) * 100);
            const { status, color, message } = getCardStatus(card); // ✅ SEMÁFORO
            
            return (
              <div 
                key={card.id}
                className="relative flex-shrink-0 w-80 h-48 rounded-[2.5rem] p-7 flex flex-col justify-between overflow-hidden snap-center shadow-2xl transition-transform hover:-translate-y-2 cursor-pointer group"
                style={{ 
                  background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                }}
              >
                {/* Efectos Glass */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header Tarjeta */}
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-white/70 tracking-[0.2em]">Crédito</span>
                        {/* ✅ BADGE INTELIGENTE */}
                        <div className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/10 flex items-center gap-1">
                            <Calendar size={10} className="text-white" />
                            <span className="text-[9px] font-bold text-white">{message}</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight leading-none truncate max-w-[180px]">{card.name}</h3>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEditCard(card); }}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
                  >
                    <Settings size={18} />
                  </button>
                </div>

                {/* Info Saldo */}
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider mb-0.5">Límite</p>
                      <p className="text-sm font-black text-white">${Number(card.limit).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-white/80 uppercase tracking-wider mb-0.5">Disponible</p>
                      <p className="text-xl font-black text-white">${(Number(card.limit) - (card.currentBalance || 0)).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Barra de uso */}
                  <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${usagePercent > 90 ? 'bg-red-400' : 'bg-white'}`}
                      style={{ width: `${usagePercent}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default CreditWallet;