import React, { useState } from 'react';
import { useExpenseStore } from '../../stores/expenseStore';
import { useAuthStore } from '../../stores/authStore';
import { SYSTEM_CATEGORIES } from '../../constants/categories';
import { Check, Calendar, CreditCard, MapPin, Tag, SmilePlus } from 'lucide-react';
import Button from '../common/Button';

const EMOTIONS = [
  { id: 'happy', icon: '😊', label: 'Feliz' },
  { id: 'sad', icon: '😢', label: 'Triste' },
  { id: 'stressed', icon: '😫', label: 'Estresado' },
  { id: 'neutral', icon: '😐', label: 'Neutral' },
  { id: 'excited', icon: '🤩', label: 'Emocionado' },
];

const PURCHASE_TYPES = [
  { id: 'need', label: 'Necesidad', color: 'bg-green-100 text-green-700' },
  { id: 'impulse', label: 'Impulso', color: 'bg-red-100 text-red-700' },
  { id: 'planned', label: 'Planificado', color: 'bg-blue-100 text-blue-700' },
];

const ExpenseForm = ({ onSuccess }) => {
  const { addExpense, isSaving } = useExpenseStore();
  const { user } = useAuthStore();
  
  const [form, setForm] = useState({
    amount: '',
    categoryId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'efectivo',
    emotion: 'neutral',
    purchaseType: 'need',
    isRecurring: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    const category = SYSTEM_CATEGORIES.find(c => c.id === form.categoryId);
    const result = await addExpense({
      ...form,
      amount: parseFloat(form.amount),
      categoryName: category?.label,
      userId: user.uid,
      date: new Date(form.date)
    });

    if (result.success) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Monto Principal */}
      <div className="text-center py-6 bg-secondary-50 dark:bg-secondary-800 rounded-[2.5rem]">
        <span className="text-[10px] font-black uppercase text-secondary-400 tracking-widest">Monto del Gasto</span>
        <div className="flex justify-center items-center text-5xl font-black text-amber-500 mt-2">
          <span className="text-2xl mr-1 opacity-50">$</span>
          <input
            type="number"
            required
            value={form.amount}
            onChange={(e) => setForm({...form, amount: e.target.value})}
            className="w-40 bg-transparent border-none focus:ring-0 p-0 text-center"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categoría */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-secondary-500 ml-2">Categoría</label>
          <select 
            required
            className="w-full p-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl border-none font-bold"
            value={form.categoryId}
            onChange={(e) => setForm({...form, categoryId: e.target.value})}
          >
            <option value="">Seleccionar...</option>
            {SYSTEM_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </div>

        {/* Método de Pago */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-secondary-500 ml-2">Método de Pago</label>
          <div className="flex gap-2">
            {['efectivo', 'tarjeta', 'transferencia'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setForm({...form, paymentMethod: m})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                  form.paymentMethod === m ? 'bg-indigo-600 text-white shadow-lg' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-500'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis Psicológico */}
      <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <SmilePlus size={20} />
          <h3 className="font-black uppercase text-xs tracking-widest">Análisis de Intención</h3>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {EMOTIONS.map(emo => (
            <button
              key={emo.id}
              type="button"
              onClick={() => setForm({...form, emotion: emo.id})}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                form.emotion === emo.id ? 'bg-white dark:bg-secondary-800 shadow-md scale-110' : 'opacity-40 grayscale'
              }`}
            >
              <span className="text-2xl">{emo.icon}</span>
              <span className="text-[8px] font-bold mt-1 uppercase">{emo.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {PURCHASE_TYPES.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setForm({...form, purchaseType: type.id})}
              className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${
                form.purchaseType === type.id ? 'bg-indigo-600 text-white' : 'bg-white/50 dark:bg-secondary-800 text-secondary-500'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Descripción / Nota"
        placeholder="¿En qué gastaste?"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value})}
      />

      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        loading={isSaving}
        className="py-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-500/30"
      >
        Guardar Registro Completo
      </Button>
    </form>
  );
};

export default ExpenseForm;