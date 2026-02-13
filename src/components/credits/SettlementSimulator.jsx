import React from 'react';
import { X, Check, ArrowRight, TrendingDown } from 'lucide-react';
import { useCreditStore } from '../../stores/creditStore';

const SettlementSimulator = ({ installment, onClose }) => {
  const { makePayment } = useCreditStore();
  const remaining = installment.totalAmount - (installment.paidAmount || 0);
  const monthsLeft = installment.months - installment.installmentsPaid;

  const handleFullPayment = async () => {
    await makePayment(installment.id, remaining);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-secondary-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-secondary-900 w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
                <span className="text-[10px] font-black uppercase text-secondary-400 tracking-[0.2em]">Simulador de Liquidación</span>
                <h2 className="text-2xl font-black text-secondary-900 dark:text-white mt-1">{installment.description}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-secondary-100 dark:bg-white/5 rounded-full hover:bg-secondary-200 transition-colors"><X size={20}/></button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8 relative z-10">
            {/* ESCENARIO ACTUAL */}
            <div className="p-5 rounded-3xl bg-secondary-50 dark:bg-white/5 border border-transparent">
                <h3 className="text-xs font-black uppercase text-secondary-400 mb-4 tracking-widest">Plan Actual</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-secondary-500 uppercase">Sigues pagando</p>
                        <p className="text-xl font-black text-secondary-900 dark:text-white">${installment.monthlyPayment.toLocaleString()}<span className="text-xs text-secondary-400 font-normal">/mes</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-secondary-500 uppercase">Terminas en</p>
                        <p className="text-base font-black text-secondary-900 dark:text-white">{monthsLeft.toFixed(1)} meses</p>
                    </div>
                    <div className="h-1 w-full bg-secondary-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-400 w-1/2"></div>
                    </div>
                </div>
            </div>

            {/* ESCENARIO LIQUIDACIÓN */}
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-bl-xl">Recomendado</div>
                
                <h3 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 mb-4 tracking-widest">Si liquidas HOY</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-emerald-600/70 uppercase">Pago Único</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${remaining.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-emerald-600/70 uppercase">Beneficio</p>
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <TrendingDown size={14} /> Liberas ${installment.monthlyPayment.toLocaleString()}/mes
                        </p>
                    </div>
                    <button 
                        onClick={handleFullPayment}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                    >
                        Liquidar Ahora
                    </button>
                </div>
            </div>
        </div>

        <div className="text-center">
            <p className="text-[10px] text-secondary-400 max-w-xs mx-auto">
                Al liquidar, el saldo disponible de tu tarjeta aumentará inmediatamente en <strong>${remaining.toLocaleString()}</strong>.
            </p>
        </div>

      </div>
    </div>
  );
};

export default SettlementSimulator;