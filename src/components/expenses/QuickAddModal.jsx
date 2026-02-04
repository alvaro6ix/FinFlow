import React, { useState, useEffect, useRef, useMemo } from "react";
import { useUIStore } from "../../stores/uiStore";
import { useExpenseStore } from "../../stores/expenseStore";
import { useAuthStore } from "../../stores/authStore";
import { useCategoryStore } from "../../stores/categoryStore";
import { SYSTEM_CATEGORIES, EMOTIONS, PURCHASE_TYPES } from "../../constants/categories";
import { 
  X, Check, Loader2, ChevronRight, Camera, MapPin, 
  RefreshCw, Tag, Clock, Repeat, CreditCard, Wallet, Landmark, HelpCircle,
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Star, Zap, Music, Wrench, Camera as CameraIcon
} from "lucide-react";
import Button from "../common/Button";

// Mapeo para recuperación segura de iconos
const ICON_MAP = {
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Star, Zap, Music, Camera: CameraIcon, Wrench, HelpCircle
};

const PAYMENT_METHODS = [
  { id: "efectivo", label: "Efectivo", icon: Wallet },
  { id: "tarjeta", label: "Tarjeta", icon: CreditCard },
  { id: "transferencia", label: "Transf.", icon: Landmark },
  { id: "otro", label: "Otro", icon: HelpCircle },
];

const RECURRENCE_TYPES = ["diaria", "semanal", "quincenal", "mensual", "anual"];

const toLocalDateTimeString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const QuickAddModal = () => {
  const { isQuickAddModalOpen, closeQuickAddModal, editingExpense } = useUIStore();
  const { addExpense, updateExpense, uploadTicket, isSaving } = useExpenseStore();
  const { customCategories, hiddenSystemIds } = useCategoryStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const amountRef = useRef(null);

  const [form, setForm] = useState({
    amount: "", categoryId: "", subcategoryId: "", description: "",
    paymentMethod: "efectivo", date: "", location: null,
    imageUrl: null, isRecurring: false, recurrence: "mensual",
    emotion: "neutral", purchaseType: "need", tags: ""
  });

  const allCategories = useMemo(() => {
    const visibleSystem = SYSTEM_CATEGORIES.filter(cat => !hiddenSystemIds.includes(cat.id));
    const formattedCustom = customCategories.map(cat => ({ ...cat, isCustom: true }));
    return [...visibleSystem, ...formattedCustom];
  }, [customCategories, hiddenSystemIds]);

  useEffect(() => {
    if (isQuickAddModalOpen) {
      if (editingExpense) {
        setForm({
          ...editingExpense,
          amount: editingExpense.amount.toString(),
          date: toLocalDateTimeString(editingExpense.date),
          tags: editingExpense.tags ? editingExpense.tags.join(", ") : ""
        });
      } else {
        setForm({
          amount: "", categoryId: "", subcategoryId: "", description: "",
          paymentMethod: "efectivo", date: toLocalDateTimeString(new Date()),
          location: null, imageUrl: null, isRecurring: false,
          recurrence: "mensual", emotion: "neutral", purchaseType: "need", tags: ""
        });
      }
      setStep(1);
      setTimeout(() => amountRef.current?.focus(), 150);
    }
  }, [isQuickAddModalOpen, editingExpense]);

  const handleSave = async () => {
    if (!form.amount || !form.categoryId || isSaving || isUploading) return;
    const category = allCategories.find(c => c.id === form.categoryId);
    const subcategory = category?.subcategories?.find(s => s.id === form.subcategoryId);
    
    const expenseData = {
      ...form,
      amount: Number(form.amount),
      categoryName: category?.label || "General",
      subcategoryName: subcategory?.label || "",
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      userId: user.uid,
      date: new Date(form.date)
    };

    const result = editingExpense ? await updateExpense(editingExpense.id, expenseData) : await addExpense(expenseData);
    if (result.success) closeQuickAddModal();
  };

  if (!isQuickAddModalOpen) return null;
  const selectedCategory = allCategories.find(c => c.id === form.categoryId);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center font-sans">
      <div className="w-full sm:max-w-xl bg-white dark:bg-secondary-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 z-20 bg-white dark:bg-secondary-900 p-5 border-b flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{editingExpense ? 'Modo Edición' : `Paso ${step} de 3`}</span>
          <button onClick={closeQuickAddModal} className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-8">
          {step === 1 && (
            <div className="animate-in fade-in space-y-6">
              <div className="text-center">
                <div className="flex justify-center items-center text-7xl font-black text-amber-500 tracking-tighter">
                  <span className="text-3xl mr-2 opacity-30">$</span>
                  <input ref={amountRef} type="number" inputMode="decimal" className="w-full text-center bg-transparent outline-none placeholder-amber-200" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {allCategories.map((c) => {
                  let IconNode = null;
                  if (c.isCustom) {
                    const CustomIcon = ICON_MAP[c.iconName] || HelpCircle;
                    IconNode = <CustomIcon size={22} />;
                  } else {
                    const SystemIcon = c.icon;
                    IconNode = <SystemIcon size={22} />;
                  }

                  return (
                    <button 
                      key={c.id} 
                      onClick={() => setForm({ ...form, categoryId: c.id, subcategoryId: c.subcategories?.[0]?.id || "" })} 
                      className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${form.categoryId === c.id ? "bg-indigo-600 text-white shadow-xl scale-105" : "bg-secondary-50 dark:bg-secondary-800 text-secondary-500"}`}
                    >
                      <div style={{ color: form.categoryId === c.id ? 'white' : c.color }}>{IconNode}</div>
                      <span className="text-[9px] font-black uppercase truncate w-full text-center mt-1">{c.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedCategory?.subcategories?.length > 0 && (
                <div className="space-y-3 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl border border-indigo-100">
                  <p className="text-[10px] font-black uppercase text-indigo-600 text-center">Subcategoría</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedCategory.subcategories.map(sub => (
                      <button key={sub.id} onClick={() => setForm({ ...form, subcategoryId: sub.id })} className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${form.subcategoryId === sub.id ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-secondary-700 text-secondary-500 border border-secondary-200"}`}>{sub.label}</button>
                    ))}
                  </div>
                </div>
              )}
              <Button fullWidth variant="primary" className="py-5 bg-indigo-600 text-white font-black" disabled={!form.amount || !form.categoryId} onClick={() => setStep(2)}>CONTINUAR <ChevronRight size={18} /></Button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl">
                  <Clock className="text-indigo-500" size={20} />
                  <input type="datetime-local" className="bg-transparent font-black w-full outline-none text-secondary-900 dark:text-white text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setForm({...form, paymentMethod: m.id})} className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${form.paymentMethod === m.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-secondary-50 dark:bg-secondary-800 text-secondary-500'}`}>
                      <m.icon size={18} /><span className="text-[8px] font-black uppercase">{m.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl">
                  <Repeat className={form.isRecurring ? "text-indigo-600 animate-spin-slow" : "text-secondary-400"} size={20} />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-xs font-black uppercase">¿Recurrente?</span>
                    <button onClick={() => setForm(f => ({...f, isRecurring: !f.isRecurring}))} className={`w-12 h-6 rounded-full relative transition-colors ${form.isRecurring ? 'bg-indigo-600' : 'bg-secondary-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.isRecurring ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
                {form.isRecurring && (
                  <div className="grid grid-cols-3 gap-2 px-2 animate-in zoom-in-95">
                    {RECURRENCE_TYPES.map(type => (
                      <button key={type} onClick={() => setForm({...form, recurrence: type})} className={`py-2 rounded-xl text-[9px] font-black uppercase border-2 transition-all ${form.recurrence === type ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-transparent bg-secondary-100 text-secondary-400'}`}>{type}</button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl">
                  <Tag className="text-indigo-500" size={20} />
                  <input type="text" placeholder="Tags (separados por coma)" className="bg-transparent font-bold w-full outline-none text-xs" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1 py-4 font-black" onClick={() => setStep(1)}>ATRÁS</Button>
                <Button variant="primary" className="flex-1 py-4 bg-indigo-600 font-black" onClick={() => setStep(3)}>CONTINUAR</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right space-y-8">
              <div className="space-y-4">
                <p className="text-center text-[10px] font-black uppercase text-secondary-400 tracking-widest">¿Cómo te sentías?</p>
                <div className="flex justify-between px-2">
                  {EMOTIONS.map(emo => {
                    const EmoIcon = emo.icon;
                    return (
                      <button key={emo.id} onClick={() => setForm({ ...form, emotion: emo.id })} className={`flex flex-col items-center gap-2 transition-all ${form.emotion === emo.id ? "scale-125 opacity-100" : "opacity-30 grayscale hover:opacity-100"}`}>
                        <EmoIcon size={32} style={{ color: emo.color }} /><span className="text-[8px] font-black uppercase mt-1">{emo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <textarea placeholder="Descripción / Nota..." className="w-full p-4 rounded-2xl bg-secondary-100 dark:bg-secondary-800 font-bold text-xs h-24 border-none focus:ring-2 focus:ring-indigo-500" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-3">
                 <Button variant="secondary" className="flex-1 py-5 font-black" onClick={() => setStep(2)}>ATRÁS</Button>
                 <Button variant="primary" className="flex-[2] py-5 bg-indigo-600 text-white font-black shadow-2xl" onClick={handleSave} loading={isSaving}>
                    <Check className="mr-2" /> {editingExpense ? 'ACTUALIZAR' : 'GUARDAR'}
                 </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;