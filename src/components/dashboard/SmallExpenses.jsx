import React, { useState } from "react";
import Card from "../common/Card";
import { Bug, ArrowUpRight } from "lucide-react";
import SmallExpensesModal from "./SmallExpensesModal";

const SmallExpenses = ({ expenses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const smallOnes = expenses.filter(e => {
      const amt = Number(e.amount);
      return amt > 0 && amt < 50;
  });
  
  const totalHormiga = smallOnes.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="h-full w-full cursor-pointer group"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl h-full transition-all duration-300 group-hover:scale-[1.02] active:scale-95 border border-white/10">
          
          {/* Fondo LIQUID GOLD (Dorado) */}
          <div className="absolute inset-0 bg-[#FFD700] opacity-90 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />

          {/* Decoración Insecto Gigante */}
          <Bug className="absolute -bottom-6 -right-6 text-[#1e1b4b] opacity-10 rotate-12 transition-transform group-hover:rotate-0 duration-700" size={120} />

          <div className="relative z-10 p-6 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-[#1e1b4b]/10 backdrop-blur-md rounded-xl text-[#1e1b4b]">
                <Bug size={20} />
              </div>
              <ArrowUpRight size={18} className="text-[#1e1b4b] opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div>
              <p className="text-[9px] font-black uppercase text-[#1e1b4b]/60 tracking-[0.2em] mb-1">Fugas Detectadas</p>
              <p className="text-3xl font-black text-[#1e1b4b] tracking-tighter">
                ${totalHormiga.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-4 inline-flex items-center self-start gap-2 bg-[#1e1b4b]/10 backdrop-blur-md px-3 py-1.5 rounded-lg">
                <span className="text-[9px] font-black text-[#1e1b4b] uppercase">
                    {smallOnes.length} movimientos
                </span>
            </div>
          </div>
        </div>
      </div>

      <SmallExpensesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        expenses={smallOnes}
        customTitle="Gastos Hormiga"
        icon={Bug}
      />
    </>
  );
};

export default SmallExpenses;