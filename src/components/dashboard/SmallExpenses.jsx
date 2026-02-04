import React, { useState } from "react";
import Card from "../common/Card";
import { Bug, ArrowUpRight } from "lucide-react"; // Importamos el icono Bug
import SmallExpensesModal from "./SmallExpensesModal";

const SmallExpenses = ({ expenses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filtrar gastos menores a 50
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
        <Card 
          className="p-6 bg-[#f59e0b] border-none shadow-lg rounded-[2.5rem] relative overflow-hidden h-full transition-all duration-300 group-hover:scale-[1.02] group-active:scale-95"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/30 rounded-xl text-[#1e1b4b]">
                <Bug size={18} />
              </div>
              <ArrowUpRight size={18} className="text-[#1e1b4b] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <p className="text-[10px] font-black uppercase text-[#1e1b4b] tracking-widest mb-1">Gasto Hormiga</p>
            <p className="text-4xl font-black text-[#1e1b4b] tracking-tighter">
              ${totalHormiga.toLocaleString()}
            </p>
            
            <div className="mt-4 flex items-center gap-2">
                <span className="text-[8px] font-black bg-[#1e1b4b]/10 text-[#1e1b4b] px-2 py-1 rounded-lg uppercase">
                    {smallOnes.length} movimientos
                </span>
                <p className="text-[8px] font-bold text-[#1e1b4b]/60 uppercase">Ver detalle</p>
            </div>
          </div>
          
          <Bug className="absolute -bottom-6 -right-6 text-white/10 rotate-12" size={120} />
        </Card>
      </div>

      {/* MODAL: Aquí pasamos el icono Bug para que no salga el "?" */}
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