import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useExpenseStore } from '../../stores/expenseStore';
import { useAuthStore } from '../../stores/authStore';
import { SYSTEM_CATEGORIES, EMOTIONS, PURCHASE_TYPES } from '../../constants/categories';
import { X, ChevronLeft, Check, Loader2 } from 'lucide-react';

const QuickAddModal = () => {
  const { isQuickAddModalOpen, closeQuickAddModal } = useUIStore();
  const { addExpense, isSaving } = useExpenseStore();
  const { user } = useAuthStore();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [emotion, setEmotion] = useState('neutral');
  const [purchaseType, setPurchaseType] = useState('need');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isQuickAddModalOpen) {
      setAmount('');
      setCategory(null);
      setEmotion('neutral');
      setPurchaseType('need');
      setStep(1);
    }
  }, [isQuickAddModalOpen]);

  const handleSubmit = async () => {
    if (!amount || !category || !user || isSaving) return;

    const selectedEmotion = EMOTIONS.find(e => e.id === emotion);
    
    const expenseData = {
      amount: parseFloat(amount),
      categoryId: category.id,
      categoryName: category.label,
      categoryColor: category.color,
      emotion: emotion,
      purchaseType: purchaseType,
      date: new Date(),
      userId: user.uid,
      type: 'expense',
      // Lógica unificada de impulso
      isImpulse: selectedEmotion?.impact === 'impulse' || purchaseType === 'impulse'
    };

    const result = await addExpense(expenseData);
    if (result.success) closeQuickAddModal();
  };

  if (!isQuickAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-secondary-900 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Header con indicador de pasos */}
        <div className="p-5 border-b border-secondary-100 dark:border-secondary-800 flex justify-between items-center bg-secondary-50/50 dark:bg-secondary-800/20">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors">
                <ChevronLeft size={24} />
              </button>
            )}
            <h2 className="text-lg font-black dark:text-white uppercase tracking-tight">Registro Rápido</h2>
          </div>
          <button onClick={closeQuickAddModal} className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full transition-colors text-secondary-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-200">
              <div className="text-center">
                <label className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-4 block">Monto Total</label>
                <div className="flex justify-center items-center text-6xl font-black text-primary-600">
                  <span className="text-3xl mr-2 opacity-50">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    autoFocus
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-center outline-none placeholder:text-secondary-100"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <button
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
              >
                Siguiente
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-200">
              <label className="text-xs font-bold text-secondary-400 uppercase tracking-widest text-center block">¿Qué categoría es?</label>
              <div className="grid grid-cols-4 gap-3">
                {SYSTEM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all active:scale-90 ${
                      category?.id === cat.id 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-transparent bg-secondary-50 dark:bg-secondary-800/50'
                    }`}
                  >
                    <span className="text-3xl mb-1">{cat.icon}</span>
                    <span className="text-[10px] font-bold dark:text-secondary-300 truncate w-full text-center">{cat.label}</span>
                  </button>
                ))}
              </div>
              <button
                disabled={!category}
                onClick={() => setStep(3)}
                className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-all"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-200">
              <div className="space-y-4">
                <label className="text-xs font-bold text-secondary-400 uppercase tracking-widest text-center block">Análisis Psicológico</label>
                <div className="flex justify-around bg-secondary-50 dark:bg-secondary-800/50 p-5 rounded-3xl">
                  {EMOTIONS.map((emo) => (
                    <button
                      key={emo.id}
                      onClick={() => setEmotion(emo.id)}
                      className={`text-4xl p-2 rounded-2xl transition-all duration-200 ${
                        emotion === emo.id ? 'bg-white dark:bg-secondary-700 shadow-xl scale-125' : 'opacity-30 grayscale hover:opacity-100'
                      }`}
                    >
                      {emo.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PURCHASE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setPurchaseType(type.id)}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                      purchaseType === type.id 
                        ? 'bg-secondary-800 dark:bg-white text-white dark:text-secondary-900 shadow-lg' 
                        : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-500'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all flex justify-center items-center gap-3"
              >
                {isSaving ? (
                  <><Loader2 className="animate-spin" size={24} /> Guardando...</>
                ) : (
                  <><Check size={24} /> Confirmar Gasto</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;