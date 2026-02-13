import React, { useState } from 'react';
import { Target, TrendingDown, ArrowRight } from 'lucide-react';

const PaymentOptimizer = ({ installments }) => {
  const [extraMoney, setExtraMoney] = useState('');
  const [strategy, setStrategy] = useState(null); // 'snowball', 'avalanche'

  // Calcular totales
  const totalMonthlyCommitment = installments.reduce((acc, i) => acc + i.monthlyPayment, 0);
  
  const calculateStrategy = (mode) => {
    if (!extraMoney) return;
    
    // Clonar y ordenar
    let sorted = [...installments].filter(i => (i.totalAmount - (i.paidAmount || 0)) > 0);
    
    if (mode === 'snowball') {
        // Bola de Nieve: Ordenar por saldo restante (Menor a mayor)
        sorted.sort((a, b) => {
            const remA = a.totalAmount - (a.paidAmount || 0);
            const remB = b.totalAmount - (b.paidAmount || 0);
            return remA - remB;
        });
    } else {
        // Avalancha: En teoría por interés, aquí usamos monto total (Mayor a menor) para simular impacto
        sorted.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    setStrategy({ mode, target: sorted[0] });
  };

  return (
    <div className="bg-white dark:bg-secondary-900 rounded-[2.5rem] p-6 shadow-xl border border-secondary-100 dark:border-white/5 relative overflow-hidden mb-8">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-white/5 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Target size={20} />
            </div>
            <div>
                <h3 className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-tight">Optimizador de Pagos</h3>
                <p className="text-[10px] text-secondary-500 font-bold">¿Tienes dinero extra? Te decimos dónde usarlo.</p>
            </div>
        </div>

        <div className="flex gap-3 mb-4">
            <div className="relative flex-1 group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 font-black">$</span>
                <input 
                    type="number" 
                    placeholder="Monto Extra (Ej: 2000)" 
                    className="w-full pl-8 pr-4 py-3 bg-secondary-50 dark:bg-black/20 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-secondary-900 dark:text-white"
                    value={extraMoney}
                    onChange={(e) => setExtraMoney(e.target.value)}
                />
            </div>
            <button 
                onClick={() => calculateStrategy('snowball')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/30"
            >
                Calcular
            </button>
        </div>

        {strategy && strategy.target && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">
                        Estrategia: {strategy.mode === 'snowball' ? 'Bola de Nieve ❄️' : 'Avalancha 🌋'}
                    </span>
                </div>
                <p className="text-sm font-bold text-secondary-700 dark:text-indigo-200 mb-3">
                    Usa esos <span className="text-indigo-600 dark:text-white font-black">${Number(extraMoney).toLocaleString()}</span> para liquidar:
                </p>
                
                <div className="flex items-center gap-3 bg-white dark:bg-secondary-900 p-3 rounded-xl shadow-sm">
                    <div className="flex-1">
                        <span className="block text-xs font-black text-secondary-900 dark:text-white">{strategy.target.description}</span>
                        <span className="text-[10px] text-secondary-500">Deuda actual: ${(strategy.target.totalAmount - (strategy.target.paidAmount||0)).toLocaleString()}</span>
                    </div>
                    <ArrowRight className="text-indigo-500" size={18} />
                </div>

                <p className="text-[10px] text-secondary-500 mt-3 leading-relaxed">
                    <strong>Por qué:</strong> Al atacar esta deuda primero, eliminarás un pago mensual de <span className="text-secondary-900 dark:text-white font-bold">${strategy.target.monthlyPayment.toLocaleString()}</span> rápidamente, liberando flujo para la siguiente.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default PaymentOptimizer;