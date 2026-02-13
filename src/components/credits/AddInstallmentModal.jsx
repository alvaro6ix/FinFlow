import React, { useState } from 'react';
import { X, Check, ShoppingBag, Calendar, CreditCard, History } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuthStore } from '../../stores/authStore';
import { useCreditStore } from '../../stores/creditStore';

const INSTALLMENT_OPTIONS = [1, 3, 6, 9, 12, 18, 24];

const AddInstallmentModal = ({ onClose, preSelectedCardId = null }) => {
  const { user } = useAuthStore();
  const { cards, addInstallment } = useCreditStore();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    description: '',
    totalAmount: '',
    months: 1,
    installmentsPaid: 0, // ✅ Nuevo campo
    cardId: preSelectedCardId || (cards[0]?.id || ''),
    purchaseDate: new Date().toISOString().slice(0, 10)
  });

  const handleSubmit = async () => {
    if (!form.description || !form.totalAmount || !form.cardId) return;
    setLoading(true);
    
    await addInstallment({
        ...form,
        totalAmount: parseFloat(form.totalAmount),
        months: parseInt(form.months),
        installmentsPaid: parseInt(form.installmentsPaid) || 0,
        nextPaymentDate: form.purchaseDate 
    }, user.uid);
    
    setLoading(false);
    onClose();
  };

  // Cálculos en vivo para mostrarle al usuario
  const monthlyPayment = form.totalAmount && form.months ? (parseFloat(form.totalAmount) / parseInt(form.months)) : 0;
  const remainingDebt = form.totalAmount ? (parseFloat(form.totalAmount) - (monthlyPayment * (parseInt(form.installmentsPaid) || 0))) : 0;

  // Validación: No puedes poner que ya pagaste 12/12 meses (si no, no sería deuda)
  const handleInstallmentsPaidChange = (e) => {
    let val = parseInt(e.target.value) || 0;
    if (val < 0) val = 0;
    if (val >= form.months) val = form.months - 1; 
    setForm({...form, installmentsPaid: val});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-secondary-900 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center text-secondary-900 shadow-md">
                <ShoppingBag size={20} />
            </div>
            <h2 className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-tight">Nueva Compra</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-white/5 transition-colors text-secondary-500"><X size={20} /></button>
        </div>

        <div className="space-y-6">
            {/* Selección de Tarjeta */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-secondary-400 ml-2 tracking-widest">Tarjeta de Cargo</label>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {cards.map(card => (
                        <button
                            key={card.id}
                            onClick={() => setForm({...form, cardId: card.id})}
                            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all whitespace-nowrap ${
                                form.cardId === card.id 
                                ? 'bg-secondary-900 dark:bg-white text-white dark:text-secondary-900 border-transparent shadow-lg scale-105' 
                                : 'bg-secondary-50 dark:bg-white/5 text-secondary-500 border-transparent hover:border-secondary-200 dark:hover:border-white/10'
                            }`}
                        >
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ background: card.color }} />
                            <span className="text-xs font-bold">{card.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Monto y Concepto */}
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-secondary-400">$</span>
                <input type="number" placeholder="0.00" className="w-full pl-10 pr-4 py-5 bg-secondary-50 dark:bg-secondary-800 rounded-2xl font-black text-2xl outline-none focus:ring-2 focus:ring-[#FFD700] text-secondary-900 dark:text-white transition-all shadow-inner" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: e.target.value})} autoFocus />
            </div>
            
            <Input label="¿Qué compraste?" placeholder="Ej: Celular Honor, TV LG..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />

            {/* Selector de Meses */}
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-secondary-400 ml-2 tracking-widest flex items-center gap-1">
                    <Calendar size={12} /> Plazo (Meses)
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {INSTALLMENT_OPTIONS.map(m => (
                        <button
                            key={m}
                            onClick={() => setForm({...form, months: m, installmentsPaid: 0})} // Reseteamos si cambia el plazo
                            className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                                form.months === m 
                                ? 'bg-[#FFD700] text-secondary-900 shadow-md transform scale-105' 
                                : 'bg-secondary-50 dark:bg-white/5 text-secondary-400 hover:bg-secondary-100 dark:hover:bg-white/10'
                            }`}
                        >
                            {m}x
                        </button>
                    ))}
                </div>
            </div>

            {/* 🌟 LA MAGIA: PAGOS YA REALIZADOS */}
            {form.months > 1 && (
              <div className="p-5 rounded-[2rem] bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-500/20 space-y-4 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                  <History size={16} />
                  <label className="text-xs font-black uppercase tracking-widest">Deuda en curso</label>
                </div>
                
                <p className="text-[10px] text-secondary-500 dark:text-secondary-400 leading-relaxed font-bold">
                  Si esta compra ya la hiciste antes, indica cuántos meses <span className="text-emerald-500">ya pagaste</span>. Así no afectaremos tu límite con la cantidad completa.
                </p>

                <div className="flex items-center gap-4 bg-white dark:bg-secondary-900 p-2 rounded-2xl border border-white/40 dark:border-white/5 shadow-sm">
                  <input 
                    type="number" 
                    min="0" 
                    max={form.months - 1} 
                    className="w-16 py-2 bg-secondary-50 dark:bg-secondary-800 rounded-xl text-center font-black outline-none text-secondary-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    value={form.installmentsPaid} 
                    onChange={handleInstallmentsPaidChange} 
                  />
                  <span className="text-xs font-bold text-secondary-500">de {form.months} meses pagados</span>
                </div>

                {form.totalAmount && (
                    <div className="pt-3 mt-3 border-t border-indigo-200/50 dark:border-indigo-500/20 flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-black uppercase text-secondary-400 tracking-widest">Pago Mensual</p>
                          <p className="text-sm font-black text-secondary-900 dark:text-white">${monthlyPayment.toLocaleString('en-US', {maximumFractionDigits: 2})}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase text-secondary-400 tracking-widest">Restante a tarjeta</p>
                          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">${remainingDebt.toLocaleString('en-US', {maximumFractionDigits: 2})}</p>
                        </div>
                    </div>
                )}
              </div>
            )}
        </div>

        <div className="flex gap-3 mt-8">
            <Button variant="secondary" onClick={onClose} className="flex-1 py-4">CANCELAR</Button>
            <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-[2] py-4 shadow-xl"><Check size={18} className="mr-2"/> CONFIRMAR</Button>
        </div>
      </div>
    </div>
  );
};

export default AddInstallmentModal;