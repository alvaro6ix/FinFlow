import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Calendar, Trash2, Zap } from 'lucide-react';
import { useCreditStore } from '../../stores/creditStore';
import PaymentModal from './PaymentModal'; // ✅ IMPORTAR

const InstallmentList = ({ cards, installments }) => {
  const { deleteInstallment } = useCreditStore();
  const [expandedCard, setExpandedCard] = useState(null);
  const [paymentItem, setPaymentItem] = useState(null); // ✅ ESTADO PARA MODAL

  const toggleCard = (cardId) => setExpandedCard(expandedCard === cardId ? null : cardId);

  const handleDelete = async (id) => {
    if(window.confirm("¿Eliminar esta compra? Se liberará el saldo de tu tarjeta.")) {
        await deleteInstallment(id);
    }
  };

  if (cards.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-secondary-900 dark:text-white px-2">Desglose por Tarjeta</h3>
      
      {cards.map(card => {
        const cardItems = installments.filter(i => i.cardId === card.id);
        const totalDebt = cardItems.reduce((acc, item) => acc + (item.totalAmount - (item.paidAmount || 0)), 0);
        const monthlyCommitment = cardItems.reduce((acc, item) => acc + item.monthlyPayment, 0);
        const isExpanded = expandedCard === card.id;

        return (
          <div key={card.id} className="bg-white dark:bg-secondary-900 rounded-[2rem] border border-secondary-100 dark:border-white/5 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
            
            {/* Header Tarjeta */}
            <button onClick={() => toggleCard(card.id)} className="w-full flex items-center justify-between p-5 text-left">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md" style={{ background: card.color }}>
                        <span className="font-black text-xs">{cardItems.length}</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-secondary-900 dark:text-white">{card.name}</h4>
                        <p className="text-[10px] text-secondary-500 font-bold uppercase tracking-wider">
                            Pago mensual: <span className="text-secondary-900 dark:text-white">${monthlyCommitment.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <span className="block text-[9px] font-black text-secondary-400 uppercase">Deuda Total</span>
                        <span className="text-sm font-black text-secondary-900 dark:text-white">${totalDebt.toLocaleString()}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-secondary-400"/> : <ChevronDown size={20} className="text-secondary-400"/>}
                </div>
            </button>

            {/* Items */}
            {isExpanded && (
                <div className="bg-secondary-50/50 dark:bg-black/20 p-4 space-y-3 animate-in slide-in-from-top-2 border-t border-secondary-100 dark:border-white/5">
                    {cardItems.length === 0 ? <p className="text-center text-xs text-secondary-400 py-4">Sin compras registradas.</p> : 
                        cardItems.map(item => {
                            const progress = Math.min(100, (item.installmentsPaid / item.months) * 100);
                            const remaining = item.totalAmount - (item.paidAmount || 0);
                            const isPaidOff = remaining <= 0;

                            return (
                                <div key={item.id} className={`p-4 rounded-2xl border relative overflow-hidden transition-all ${isPaidOff ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-500/20 opacity-60' : 'bg-white dark:bg-secondary-800 border-secondary-100 dark:border-white/5'}`}>
                                    {/* Barra de progreso de fondo */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-secondary-100 dark:bg-white/10 w-full">
                                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                                    </div>

                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isPaidOff ? 'bg-emerald-100 text-emerald-600' : 'bg-secondary-100 dark:bg-white/5 text-secondary-400'}`}>
                                                <Package size={14} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-secondary-900 dark:text-white block">{item.description}</span>
                                                <span className="text-[10px] text-secondary-400 font-bold uppercase">
                                                    {item.installmentsPaid.toFixed(1)} / {item.months} pagos
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                            {!isPaidOff && (
                                                <button 
                                                    onClick={() => setPaymentItem(item)} // ✅ ABRIR MODAL
                                                    className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 transition-colors"
                                                    title="Registrar Pago"
                                                >
                                                    <Zap size={14} fill="currentColor" />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-bold text-secondary-500 relative z-10 mt-2">
                                        <span className="bg-secondary-100 dark:bg-white/10 px-2 py-0.5 rounded-md">${item.monthlyPayment.toLocaleString()}/mes</span>
                                        <span className={`uppercase tracking-widest ${isPaidOff ? 'text-emerald-600 font-black' : 'text-secondary-400'}`}>
                                            {isPaidOff ? '¡PAGADO!' : `Resta: $${remaining.toLocaleString()}`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            )}
          </div>
        );
      })}

      {/* ✅ MODAL DE PAGO */}
      {paymentItem && (
        <PaymentModal installment={paymentItem} onClose={() => setPaymentItem(null)} />
      )}
    </div>
  );
};

export default InstallmentList;