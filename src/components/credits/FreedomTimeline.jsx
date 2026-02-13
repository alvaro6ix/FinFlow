import React from 'react';
import { Flag, Calendar, ArrowRight } from 'lucide-react';
import { addMonths, format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

const FreedomTimeline = ({ installments }) => {
  if (installments.length === 0) return null;

  // Calcular la fecha final más lejana
  let maxDate = new Date();
  
  installments.forEach(item => {
    const monthsLeft = item.months - (item.installmentsPaid || 0);
    // Fecha de "libertad" estimada para este item
    const purchaseDate = item.purchaseDate ? new Date(item.purchaseDate) : new Date();
    // Sumamos los meses totales a la fecha de compra, o los restantes a hoy (aprox)
    const freedomDate = addMonths(new Date(), monthsLeft);
    
    if (freedomDate > maxDate) maxDate = freedomDate;
  });

  const formattedDate = format(maxDate, 'MMMM yyyy', { locale: es });
  const monthName = format(maxDate, 'MMMM', { locale: es });
  const year = format(maxDate, 'yyyy', { locale: es });

  return (
    <div className="mt-6 p-6 rounded-[2rem] bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2 opacity-80">
                    <Flag size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Meta de Libertad</span>
                </div>
                <h3 className="text-lg md:text-2xl font-bold leading-tight">
                    Si no adquieres más deuda,<br/> serás libre en <span className="text-[#FFD700] underline decoration-2 underline-offset-4 capitalize">{formattedDate}</span>.
                </h3>
            </div>
            
            <div className="hidden md:flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-xs font-bold opacity-70 uppercase mb-1">Año</span>
                <span className="text-3xl font-black">{year}</span>
                <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full mt-1">{monthName}</span>
            </div>
        </div>
    </div>
  );
};

export default FreedomTimeline;