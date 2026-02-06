import React, { useState, useMemo } from 'react';
import { useExpenseStore } from '../../stores/expenseStore';
import { useAuthStore } from '../../stores/authStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { SYSTEM_CATEGORIES } from '../../constants/categories';
import { 
  Check, Calendar, CreditCard, MapPin, Tag, Smile, Frown, Meh, Star, AlertTriangle, Target, Zap, Brain, HelpCircle,
  // ✅ ICONOS IDÉNTICOS AL GESTOR
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank
} from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

// ✅ MAPA DE ICONOS SINCRONIZADO
const ICON_MAP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase, CreditCard, 
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle
};

const EMOTIONS = [
  { id: 'happy', icon: Smile, label: 'Feliz', color: 'text-emerald-500' },
  { id: 'sad', icon: Frown, label: 'Triste', color: 'text-blue-500' },
  { id: 'stressed', icon: AlertTriangle, label: 'Estresado', color: 'text-red-500' },
  { id: 'neutral', icon: Meh, label: 'Neutral', color: 'text-gray-400' },
  { id: 'excited', icon: Star, label: 'Emocionado', color: 'text-amber-500' },
];

const PURCHASE_TYPES = [
  { id: 'need', label: 'Necesidad', icon: Target },
  { id: 'impulse', label: 'Impulso', icon: Zap },
  { id: 'planned', label: 'Planificado', icon: Brain },
];

const ExpenseForm = ({ onSuccess }) => {
  const { addExpense, isSaving } = useExpenseStore();
  const { user } = useAuthStore();
  const { customCategories } = useCategoryStore();
  
  const allCategories = useMemo(() => {
    const customWithFlag = customCategories.map(c => ({ ...c, isCustom: true }));
    return [...SYSTEM_CATEGORIES, ...customWithFlag];
  }, [customCategories]);

  const [form, setForm] = useState({
    amount: '', categoryId: '', description: '',
    date: new Date().toISOString().slice(0, 16),
    paymentMethod: 'efectivo', emotion: 'neutral', purchaseType: 'need', isRecurring: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving || !form.amount || !form.categoryId) return;

    const category = allCategories.find(c => c.id === form.categoryId);
    
    const result = await addExpense({
      ...form,
      amount: parseFloat(form.amount),
      categoryName: category?.label || 'General',
      userId: user.uid,
      date: new Date(form.date)
    });

    if (result.success && onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="text-center py-6 bg-secondary-50/50 dark:bg-secondary-800/50 rounded-[2.5rem] border border-secondary-100 dark:border-secondary-700">
        <span className="text-[10px] font-black uppercase text-[#FFD700] tracking-widest">Monto del Gasto</span>
        <div className="flex justify-center items-center text-5xl font-black text-[#FFD700] mt-2">
          <span className="text-2xl mr-1 opacity-50">$</span>
          <input
            type="number"
            required
            value={form.amount}
            onChange={(e) => setForm({...form, amount: e.target.value})}
            className="w-40 bg-transparent border-none focus:ring-0 p-0 text-center placeholder-amber-200/30 text-[#FFD700]"
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-secondary-500 ml-2">Categoría</label>
          <div className="grid grid-cols-4 gap-2">
            {allCategories.map(cat => {
              let IconNode = <HelpCircle size={20} />;
              
              if (cat.isCustom) {
                 const IconComp = ICON_MAP[cat.iconName] || HelpCircle;
                 IconNode = <IconComp size={20} />;
              } else {
                 const SysIcon = cat.icon;
                 IconNode = <SysIcon size={20} />;
              }

              const isSelected = form.categoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({...form, categoryId: cat.id})}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${isSelected ? 'bg-[#FFD700] text-[#1e1b4b] shadow-lg scale-105' : 'bg-secondary-50 dark:bg-secondary-800 text-secondary-400 hover:bg-white'}`}
                >
                  <div style={{ color: isSelected ? '#1e1b4b' : cat.color }}>{IconNode}</div>
                  <span className="text-[8px] font-black uppercase mt-1 truncate w-full text-center">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-secondary-500 ml-2">Método de Pago</label>
          <div className="flex gap-2">
            {['efectivo', 'tarjeta', 'transferencia'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setForm({...form, paymentMethod: m})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${form.paymentMethod === m ? 'bg-[#FFD700] text-[#1e1b4b] shadow-lg' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-500'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-secondary-50/50 dark:bg-secondary-800/30 rounded-3xl space-y-4 border border-secondary-100 dark:border-secondary-700">
        <div className="flex items-center gap-2 text-[#FFD700]">
          <Smile size={20} />
          <h3 className="font-black uppercase text-xs tracking-widest">Análisis de Intención</h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {EMOTIONS.map(emo => (
            <button key={emo.id} type="button" onClick={() => setForm({...form, emotion: emo.id})} className={`flex flex-col items-center p-2 rounded-xl transition-all ${form.emotion === emo.id ? 'bg-white dark:bg-secondary-800 shadow-md scale-110' : 'opacity-40 grayscale'}`}>
              <emo.icon size={24} className={emo.color} />
              <span className="text-[8px] font-bold mt-1 uppercase text-secondary-500">{emo.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {PURCHASE_TYPES.map(type => (
            <button key={type.id} type="button" onClick={() => setForm({...form, purchaseType: type.id})} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all border-2 ${form.purchaseType === type.id ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#b45309]' : 'border-transparent bg-white/50 dark:bg-secondary-800 text-secondary-500'}`}>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <Input label="Descripción / Nota" placeholder="¿En qué gastaste?" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
      <Button type="submit" variant="primary" fullWidth loading={isSaving} className="py-5 shadow-xl">Guardar Registro Completo</Button>
    </form>
  );
};

export default ExpenseForm;