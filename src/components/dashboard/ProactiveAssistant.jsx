import React from "react";
import { Sparkles, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProactiveAssistant = ({ spent, budget }) => {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  
  const getGreeting = () => {
    if (hour < 12) return "¡Buen día!";
    if (hour < 18) return "¡Buena tarde!";
    return "¡Buena noche!";
  };

  const percent = budget > 0 ? (spent / budget) * 100 : 0;
  
  const getAdvice = () => {
    if (spent === 0) return "Aún no tienes gastos registrados este mes. Es un excelente inicio para ahorrar.";
    if (percent > 90) return "Atención: has agotado casi todo tu presupuesto. Evita gastos hormiga hoy.";
    return "Tu ritmo de gasto es saludable. Tienes margen para tus metas.";
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group cursor-default">
      {/* Fondo Glass Amarillo */}
      <div className="absolute inset-0 bg-[#FFD700] opacity-90 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
      
      <div className="relative z-10 p-8 sm:p-10">
        <BrainCircuit 
          className="absolute -right-6 -top-6 text-[#1e1b4b] opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-700" 
          size={180} 
        />
        
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-[#1e1b4b]/10 backdrop-blur-sm">
            <Sparkles size={16} className="text-[#1e1b4b]" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1e1b4b]/70">
            Asistente IA
          </span>
        </div>

        <h3 className="text-3xl font-black uppercase tracking-tighter mb-3 text-[#1e1b4b]">
          {getGreeting()}
        </h3>
        
        <p className="text-sm sm:text-base font-bold leading-relaxed mb-8 max-w-[90%] text-[#1e1b4b]/80">
          "{getAdvice()}"
        </p>

        <button 
          onClick={() => navigate('/analytics')} 
          className="px-6 py-3 bg-[#1e1b4b] text-[#FFD700] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all hover:bg-black"
        >
          Ver Análisis Profundo
        </button>
      </div>
    </div>
  );
};

export default ProactiveAssistant;