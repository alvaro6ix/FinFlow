import React from "react";
import Card from "../common/Card";
import { Sparkles, ArrowRight, BrainCircuit } from "lucide-react";
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
    if (percent > 90) return "Cuidado, has agotado casi todo tu presupuesto. Evita gastos innecesarios hoy.";
    return "Tu ritmo de gasto es saludable. Tienes margen para tus metas financieras.";
  };

  return (
    <Card 
      className="p-0 overflow-hidden border-none shadow-xl rounded-[2.5rem]"
      style={{ backgroundColor: '#f59e0b' }} // AMARILLO SÓLIDO
    >
      <div className="p-8 relative">
        <BrainCircuit 
          className="absolute -right-4 -top-4 text-[#1e1b4b]" 
          style={{ opacity: 0.05 }} 
          size={140} 
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(30, 27, 75, 0.1)' }}>
              <Sparkles size={18} style={{ color: '#1e1b4b' }} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1e1b4b]">
              Asistente Inteligente
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase tracking-tighter mb-3 text-[#1e1b4b]">
            {getGreeting()}, Álvaro
          </h3>
          
          <p className="text-[14px] font-bold leading-relaxed mb-8 max-w-[85%] text-[#1e1b4b]/80">
            "{getAdvice()}"
          </p>

          {/* ✅ Ruta corregida a /analytics para coincidir con App.jsx */}
          <button 
            onClick={() => navigate('/analytics')} 
            className="flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase hover:scale-105 active:scale-95 transition-all shadow-lg text-white"
            style={{ 
                backgroundColor: '#6366f1', // MORADO SÓLIDO
            }}
          >
            Ver análisis profundo
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProactiveAssistant;