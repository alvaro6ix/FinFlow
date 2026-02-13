import React, { useState } from 'react';
import { X, Check, Zap, DollarSign, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { useCreditStore } from '../../stores/creditStore';

const PaymentModal = ({ installment, onClose }) => {
  const { makePayment } = useCreditStore();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(installment.monthlyPayment || 0);
  const [mode, setMode] = useState('monthly'); // 'monthly', 'custom', 'full'

  const remaining = installment.totalAmount - (installment.paidAmount || 0);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'monthly') setAmount(installment.monthlyPayment);
    if (newMode === 'full') setAmount(remaining);
    if (newMode === 'custom') setAmount('');
  };

  const handleSubmit = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    await makePayment(installment.id, parseFloat(amount));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-secondary-900 w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl border border-white/20">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <DollarSign size={20} />
            </div>
            <div>
                <h2 className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-tight">Registrar Pago</h2>
                <p className="text-[10px] font-bold text-secondary-400">{installment.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-white/5"><X size={20} /></button>
        </div>

        {/* Opciones Rápidas */}
        <div className="grid grid-cols-3 gap-2 mb-6">
            <button 
                onClick={() => handleModeChange('monthly')}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${mode === 'monthly' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-transparent bg-secondary-50 dark:bg-white/5 text-secondary-400'}`}
            >
                <Calendar size={18} className="mb-1" />
                <span className="text-[9px] font-black uppercase">Mensualidad</span>
            </button>
            <button 
                onClick={() => handleModeChange('full')}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${mode === 'full' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-transparent bg-secondary-50 dark:bg-white/5 text-secondary-400'}`}
            >
                <Zap size={18} className="mb-1" />
                <span className="text-[9px] font-black uppercase">Liquidar</span>
            </button>
            <button 
                onClick={() => handleModeChange('custom')}
                className={`py-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${mode === 'custom' ? 'border-[#FFD700] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' : 'border-transparent bg-secondary-50 dark:bg-white/5 text-secondary-400'}`}
            >
                <DollarSign size={18} className="mb-1" />
                <span className="text-[9px] font-black uppercase">Otro</span>
            </button>
        </div>

        {/* Input de Monto */}
        <div className="relative group mb-6">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-secondary-300">$</span>
            <input 
                type="number" 
                placeholder="0.00" 
                className="w-full pl-12 pr-6 py-6 bg-secondary-50 dark:bg-secondary-800 rounded-[2rem] font-black text-3xl outline-none text-center focus:ring-2 focus:ring-emerald-500 text-secondary-900 dark:text-white transition-all" 
                value={amount} 
                onChange={e => {
                    setAmount(e.target.value);
                    setMode('custom');
                }}
                autoFocus 
            />
            <p className="text-center text-xs font-bold text-secondary-400 mt-2">
                Restante actual: ${remaining.toLocaleString()}
            </p>
        </div>

        <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1 py-4">CANCELAR</Button>
            <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"><Check size={18} className="mr-2"/> PAGAR</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;