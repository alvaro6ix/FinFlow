import React from "react";
import { X, Calendar, Tag, CreditCard, HelpCircle } from "lucide-react";

/**
 * @param {boolean} isOpen - Estado de visibilidad
 * @param {function} onClose - Función para cerrar el modal
 * @param {Array} expenses - Lista de gastos a mostrar
 * @param {string} customTitle - Título dinámico
 * @param {ReactComponent} icon - Icono dinámico
 */
export default function SmallExpensesModal({ isOpen, onClose, expenses = [], customTitle, icon: HeaderIcon }) {
  if (!isOpen) return null;

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const IconToRender = HeaderIcon || HelpCircle;

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-md bg-white dark:bg-secondary-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[85vh]">
        
        {/* Cabecera DORADA (#FFD700) */}
        <div className="relative p-6 flex justify-between items-center bg-[#FFD700] overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-[#1e1b4b] shadow-sm border border-white/10">
              <IconToRender size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[#1e1b4b] leading-none tracking-tight">
                {customTitle || "Detalle de Gastos"}
              </h3>
              <p className="text-[9px] font-bold text-[#1e1b4b]/70 uppercase mt-1 tracking-widest">
                {expenses.length} registros encontrados
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="relative z-10 p-2 bg-[#1e1b4b]/10 hover:bg-[#1e1b4b]/20 rounded-full transition-colors active:scale-90"
          >
            <X size={20} className="text-[#1e1b4b]" />
          </button>
        </div>

        {/* Lista Deslizable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary-50/50 dark:bg-secondary-950/50">
          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 opacity-40">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary-500">
                Sin movimientos registrados
              </p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div 
                key={expense.id} 
                className="group bg-white dark:bg-secondary-900/80 p-4 rounded-2xl flex justify-between items-center border border-secondary-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icono Morado */}
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                    <Tag size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase text-secondary-900 dark:text-white truncate">
                      {expense.description || expense.categoryName || 'Sin descripción'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-secondary-400">
                      <CreditCard size={10} />
                      <span className="text-[8px] font-bold uppercase tracking-tighter">
                        {expense.paymentMethod || 'Efectivo'}
                      </span>
                      <span className="text-[8px] opacity-40">•</span>
                      <span className="text-[8px] font-bold uppercase tracking-tighter">
                        {new Date(expense.date).toLocaleDateString('es-MX', {day: 'numeric', month: 'short'})}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-black text-secondary-900 dark:text-white shrink-0 group-hover:text-indigo-600 transition-colors">
                  ${Number(expense.amount).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Pie de Modal con Botón Morado */}
        <div className="p-6 bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-white/5 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-[10px] font-black uppercase text-secondary-400 tracking-widest">Total del grupo</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              ${total.toLocaleString()}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            <span>Cerrar Detalle</span>
          </button>
        </div>
      </div>
    </div>
  );
}