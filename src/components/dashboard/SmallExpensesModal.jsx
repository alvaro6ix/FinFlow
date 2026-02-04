import React from "react";
import { X, Calendar, Tag, CreditCard, HelpCircle } from "lucide-react";

/**
 * @param {boolean} isOpen - Estado de visibilidad
 * @param {function} onClose - Función para cerrar el modal
 * @param {Array} expenses - Lista de gastos a mostrar
 * @param {string} customTitle - Título dinámico (Hoy, Mes, Recurrentes, etc.)
 * @param {ReactComponent} icon - Icono dinámico enviado desde StatCards
 */
export default function SmallExpensesModal({ isOpen, onClose, expenses = [], customTitle, icon: HeaderIcon }) {
  if (!isOpen) return null;

  // Cálculo del total acumulado de los gastos mostrados
  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  
  // Si no se recibe un icono específico, usamos HelpCircle por defecto
  const IconToRender = HeaderIcon || HelpCircle;

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-secondary-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Cabecera del Modal - Color Amarillo Sólido */}
        <div className="p-6 flex justify-between items-center" style={{ backgroundColor: '#f59e0b' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/30 rounded-xl text-[#1e1b4b]">
              <IconToRender size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[#1e1b4b] leading-none">
                {customTitle || "Detalle de Gastos"}
              </h3>
              <p className="text-[10px] font-bold text-[#1e1b4b]/70 uppercase mt-1">Registros reales encontrados</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-[#1e1b4b]/10 hover:bg-[#1e1b4b]/20 rounded-full transition-colors active:scale-90"
          >
            <X size={20} className="text-[#1e1b4b]" />
          </button>
        </div>

        {/* Lista Deslizable de Gastos */}
        <div className="p-4 max-h-[50vh] overflow-y-auto space-y-3 bg-secondary-50 dark:bg-secondary-950">
          {expenses.length === 0 ? (
            <div className="py-12 text-center opacity-30 uppercase font-black text-[10px] tracking-widest text-secondary-500">
              Sin movimientos registrados
            </div>
          ) : (
            expenses.map((expense) => (
              <div 
                key={expense.id} 
                className="bg-white dark:bg-secondary-900 p-4 rounded-2xl flex justify-between items-center border border-secondary-100 dark:border-secondary-800 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-secondary-50 dark:bg-secondary-800 text-indigo-500 rounded-lg shrink-0">
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
                    </div>
                  </div>
                </div>
                <p className="text-sm font-black text-secondary-900 dark:text-white shrink-0">
                  ${Number(expense.amount).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Pie de Modal con Total y Botón de Acción Morado */}
        <div className="p-6 bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-800">
          <div className="flex justify-between items-center mb-4 text-[#1e1b4b] dark:text-white px-1">
            <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Total del grupo:</span>
            <span className="text-2xl font-black" style={{ color: '#6366f1' }}>
              ${total.toLocaleString()}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-full py-4 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg active:scale-[0.98] transition-all hover:brightness-110"
            style={{ backgroundColor: '#6366f1' }}
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}