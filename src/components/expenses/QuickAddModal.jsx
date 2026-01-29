import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useExpenseStore } from '../../stores/expenseStore';
import { useAuthStore } from '../../stores/authStore';
import { SYSTEM_CATEGORIES, EMOTIONS } from '../../constants/categories';

const QuickAddModal = () => {
  const { isQuickAddModalOpen, closeQuickAddModal } = useUIStore();
  const { addExpense } = useExpenseStore();
  const { user } = useAuthStore();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [emotion, setEmotion] = useState('neutral');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isQuickAddModalOpen) {
      setAmount('');
      setCategory(null);
      setDescription('');
      setEmotion('neutral');
      setStep(1);
    }
  }, [isQuickAddModalOpen]);

  const handleSubmit = async () => {
    if (!amount || !category || !user) return;

    const expenseData = {
      amount: parseFloat(amount),
      categoryId: category.id,
      categoryName: category.label,
      description: description || `Gasto en ${category.label}`,
      emotion: emotion,
      date: new Date(),
      userId: user.uid,
      type: 'expense',
      // Lógica psicológica: Gastos bajo estas emociones se consideran impulsivos
      isImpulse: ['sad', 'stressed', 'excited'].includes(emotion)
    };

    const result = await addExpense(expenseData);
    if (result.success) closeQuickAddModal();
    else alert("Error: " + result.error);
  };

  if (!isQuickAddModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-secondary-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-secondary-100 dark:border-secondary-800 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">Nuevo Gasto</h2>
          <button onClick={closeQuickAddModal} className="text-secondary-400 text-3xl">×</button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <span className="text-sm text-secondary-500 block mb-2 font-medium">1. ¿Cuánto gastaste?</span>
              <div className="flex justify-center items-center text-5xl font-bold text-primary-600">
                <span className="mr-2">$</span>
                <input
                  type="number"
                  autoFocus
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-1/2 bg-transparent border-none focus:ring-0 text-center outline-none"
                  placeholder="0.00"
                />
              </div>
              <button
                disabled={!amount || parseFloat(amount) <= 0}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg"
              >
                Siguiente
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <span className="text-sm text-secondary-500 block font-medium">2. Selecciona la Categoría</span>
              <div className="grid grid-cols-4 gap-2">
                {SYSTEM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                      category?.id === cat.id ? 'border-primary-500 bg-primary-50' : 'border-transparent bg-secondary-50'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-[10px] mt-1 truncate w-full text-center">{cat.label}</span>
                  </button>
                ))}
              </div>
              <button
                disabled={!category}
                onClick={() => setStep(3)}
                className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold"
              >
                Siguiente
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <span className="text-sm text-secondary-500 block font-medium text-center">3. ¿Cómo te sentías al comprar?</span>
              <div className="flex justify-around bg-secondary-50 p-4 rounded-2xl">
                {EMOTIONS.map((emo) => (
                  <button
                    key={emo.id}
                    onClick={() => setEmotion(emo.id)}
                    className={`text-3xl p-2 rounded-xl transition-all ${
                      emotion === emo.id ? 'bg-white shadow-md scale-125' : 'opacity-40 grayscale hover:opacity-100'
                    }`}
                  >
                    {emo.icon}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="flex-1 py-4 bg-secondary-100 rounded-2xl font-bold">Atrás</button>
                <button
                  onClick={handleSubmit}
                  className="flex-[2] py-4 bg-primary-500 text-white rounded-2xl font-bold shadow-lg"
                >
                  Confirmar Gasto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;