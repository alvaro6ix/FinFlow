import React, { useState, useEffect, useRef, useMemo } from "react";
import { useUIStore } from "../../stores/uiStore";
import { useExpenseStore } from "../../stores/expenseStore";
import { useAuthStore } from "../../stores/authStore";
import { useCategoryStore } from "../../stores/categoryStore";
import { SYSTEM_CATEGORIES, EMOTIONS, PURCHASE_TYPES } from "../../constants/categories";
import { 
  X, Check, ChevronRight, Camera, MapPin, 
  Tag, Clock, Repeat, CreditCard, Wallet, Landmark, HelpCircle,
  // ✅ IMPORTACIÓN MASIVA
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera as CameraIcon, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Receipt, TrendingUp, PiggyBank, Star, Zap
} from "lucide-react";
import Button from "../common/Button";

// ✅ MAPA MAESTRO
const ICON_MAP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera: CameraIcon, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase, CreditCard, 
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle
};

const PAYMENT_METHODS = [
  { id: "efectivo", label: "Efectivo", icon: Wallet },
  { id: "tarjeta", label: "Tarjeta", icon: CreditCard },
  { id: "transferencia", label: "Transf.", icon: Landmark },
  { id: "otro", label: "Otro", icon: HelpCircle },
];

const RECURRENCE_TYPES = ["diaria", "semanal", "quincenal", "mensual", "anual"];

const toLocalDateTimeString = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    amount: "", categoryId: "", subcategoryId: "", description: "",
    paymentMethod: "efectivo", date: "", location: null,
    imageUrl: null, isRecurring: false, recurrence: "mensual",
    startDate: "", endDate: "",
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
          tags: editingExpense.tags ? (Array.isArray(editingExpense.tags) ? editingExpense.tags.join(", ") : editingExpense.tags) : "",
          isRecurring: editingExpense.isRecurring || false,
          recurrence: editingExpense.recurrence || 'mensual',
          startDate: editingExpense.startDate ? new Date(editingExpense.startDate).toISOString().split('T')[0] : '',
          endDate: editingExpense.endDate ? new Date(editingExpense.endDate).toISOString().split('T')[0] : ''
        });
      } else {
        setForm({
          amount: "", categoryId: "", subcategoryId: "", description: "",
          paymentMethod: "efectivo", date: toLocalDateTimeString(new Date()),
          location: null, imageUrl: null, isRecurring: false,
          recurrence: "mensual", startDate: new Date().toISOString().split('T')[0], endDate: "",
          emotion: "neutral", purchaseType: "need", tags: ""
        });
      }
      setStep(1);
      setTimeout(() => amountRef.current?.focus(), 150);
    }
  }, [isQuickAddModalOpen, editingExpense]);

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({ ...form, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const url = await uploadTicket(file);
    setForm({ ...form, imageUrl: url });
    setIsUploading(false);
  };

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
      date: new Date(form.date),
      startDate: form.isRecurring ? (form.startDate ? new Date(form.startDate) : new Date(form.date)) : null,
      endDate: form.isRecurring && form.endDate ? new Date(form.endDate) : null
    };

    const result = editingExpense ? await updateExpense(editingExpense.id, expenseData) : await addExpense(expenseData);
    if (result.success) closeQuickAddModal();
  };

  if (!isQuickAddModalOpen) return null;
  const selectedCategory = allCategories.find(c => c.id === form.categoryId);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center font-sans">
      <div className="w-full sm:max-w-xl bg-white dark:bg-secondary-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 z-20 bg-white dark:bg-secondary-900 p-5 border-b border-secondary-100 dark:border-secondary-800 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-[#FFD700] tracking-widest">
            {editingExpense ? 'Editar Gasto' : `Nuevo Gasto • Paso ${step} de 3`}
          </span>
          <button onClick={closeQuickAddModal} className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full active:scale-90 transition-transform">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {step === 1 && (
            <div className="animate-in fade-in space-y-8">
              <div className="text-center">
                <div className="flex justify-center items-center text-7xl font-black text-[#FFD700] tracking-tighter">
                  <span className="text-3xl mr-2 opacity-30">$</span>
                  <input ref={amountRef} type="number" inputMode="decimal" className="w-full text-center bg-transparent outline-none placeholder-amber-200/30 text-[#FFD700]" placeholder="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {allCategories.map((c) => {
                  let IconNode = <HelpCircle size={22} />;
                  if (c.isCustom) {
                    const CustomIcon = ICON_MAP[c.iconName] || HelpCircle;
                    IconNode = <CustomIcon size={22} />;
                  } else {
                    const SystemIcon = c.icon;
                    IconNode = <SystemIcon size={22} />;
                  }

                  const isSelected = form.categoryId === c.id;

                  return (
                    <button 
                      key={c.id} 
                      onClick={() => setForm({ ...form, categoryId: c.id, subcategoryId: c.subcategories?.[0]?.id || "" })} 
                      className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${isSelected ? "bg-[#FFD700] text-[#1e1b4b] shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105 font-bold" : "bg-secondary-50 dark:bg-secondary-800 text-secondary-500 hover:bg-white"}`}
                    >
                      <div style={{ color: isSelected ? '#1e1b4b' : c.color }}>{IconNode}</div>
                      <span className="text-[9px] font-black uppercase truncate w-full text-center mt-1">{c.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedCategory?.subcategories?.length > 0 && (
                <div className="space-y-3 p-4 bg-secondary-50/50 dark:bg-secondary-800/50 rounded-3xl border border-secondary-100 dark:border-secondary-700">
                  <p className="text-[10px] font-black uppercase text-secondary-400 text-center">Subcategoría</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {selectedCategory.subcategories.map(sub => (
                      <button key={sub.id} onClick={() => setForm({ ...form, subcategoryId: sub.id })} className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${form.subcategoryId === sub.id ? "bg-[#FFD700] text-[#1e1b4b] shadow-md" : "bg-white dark:bg-secondary-700 text-secondary-500 border border-secondary-200"}`}>{sub.label}</button>
                    ))}
                  </div>
                </div>
              )}
              
              <Button fullWidth variant="primary" className="py-5" disabled={!form.amount || !form.categoryId} onClick={() => setStep(2)}>CONTINUAR <ChevronRight size={18} /></Button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl">
                  <Clock className="text-[#FFD700]" size={20} />
                  <input type="datetime-local" className="bg-transparent font-black w-full outline-none text-secondary-900 dark:text-white text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button key={m.id} onClick={() => setForm({...form, paymentMethod: m.id})} className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${form.paymentMethod === m.id ? 'bg-[#FFD700] text-[#1e1b4b] shadow-lg' : 'bg-secondary-50 dark:bg-secondary-800 text-secondary-500'}`}>
                      <m.icon size={18} /><span className="text-[8px] font-black uppercase">{m.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className={`p-4 rounded-2xl border transition-all ${form.isRecurring ? 'bg-[#FFD700]/10 border-[#FFD700]/50' : 'bg-secondary-50 dark:bg-secondary-800 border-transparent'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Repeat className={form.isRecurring ? "text-[#FFD700]" : "text-secondary-400"} size={20} />
                      <span className="text-xs font-black uppercase">¿Es Gasto Recurrente?</span>
                    </div>
                    <button onClick={() => setForm(f => ({...f, isRecurring: !f.isRecurring}))} className={`w-12 h-6 rounded-full relative transition-colors ${form.isRecurring ? 'bg-[#FFD700]' : 'bg-secondary-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.isRecurring ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  {form.isRecurring && (
                    <div className="mt-4 space-y-3 animate-in fade-in">
                      <div className="grid grid-cols-3 gap-2">
                        {RECURRENCE_TYPES.map(type => (
                          <button key={type} onClick={() => setForm({...form, recurrence: type})} className={`py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${form.recurrence === type ? 'bg-[#FFD700]/20 text-[#b45309] border-[#FFD700]' : 'bg-white border-transparent'}`}>{type}</button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] font-black uppercase text-[#FFD700] ml-1">Inicio</label>
                          <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full p-2 rounded-xl text-xs font-bold bg-white border-none" />
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-secondary-400 ml-1">Fin (Opcional)</label>
                          <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full p-2 rounded-xl text-xs font-bold bg-white border-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleGetLocation} disabled={isLocating} className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${form.location ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-secondary-50 text-secondary-500'}`}><MapPin size={16} /> {isLocating ? 'Ubicando...' : form.location ? 'Ubicado' : 'GPS'}</button>
                  <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-black text-[10px] uppercase transition-all ${form.imageUrl ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'bg-secondary-50 text-secondary-500'}`}><CameraIcon size={16} /> {isUploading ? 'Subiendo...' : form.imageUrl ? 'Listo' : 'Ticket'}</button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl">
                  <Tag className="text-[#FFD700]" size={20} />
                  <input type="text" placeholder="Tags (separados por coma)" className="bg-transparent font-bold w-full outline-none text-xs" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1 py-4 font-black" onClick={() => setStep(1)}>ATRÁS</Button>
                <Button variant="primary" className="flex-1 py-4 font-black" onClick={() => setStep(3)}>PSICOLOGÍA</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right space-y-8">
              <div className="space-y-4">
                <p className="text-center text-[10px] font-black uppercase text-secondary-400 tracking-widest">¿Por qué compraste esto?</p>
                <div className="grid grid-cols-3 gap-2">
                  {PURCHASE_TYPES.map(type => (
                    <button key={type.id} onClick={() => setForm({ ...form, purchaseType: type.id })} className={`py-4 rounded-2xl transition-all border-2 font-black text-[9px] uppercase ${form.purchaseType === type.id ? "border-[#FFD700] bg-[#FFD700]/10 text-[#b45309]" : "border-transparent bg-secondary-50 dark:bg-secondary-800 text-secondary-400"}`}>{type.label}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-center text-[10px] font-black uppercase text-secondary-400 tracking-widest">¿Cómo te sentías al pagar?</p>
                <div className="flex justify-between px-2">
                  {EMOTIONS.map(emo => {
                    const EmoIcon = emo.icon;
                    return (
                      <button key={emo.id} onClick={() => setForm({ ...form, emotion: emo.id })} className={`flex flex-col items-center gap-2 transition-all ${form.emotion === emo.id ? "scale-125 opacity-100" : "opacity-30 grayscale hover:opacity-100"}`}>
                        <EmoIcon size={32} style={{ color: emo.color }} />
                        <span className="text-[8px] font-black uppercase mt-1">{emo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <textarea placeholder="Descripción opcional o notas..." className="w-full p-4 rounded-2xl bg-secondary-100 dark:bg-secondary-800 font-bold text-xs h-24 border-none focus:ring-2 focus:ring-[#FFD700] shadow-inner" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="flex gap-3">
                 <Button variant="secondary" className="flex-1 py-5 font-black" onClick={() => setStep(2)}>ATRÁS</Button>
                 <Button variant="primary" className="flex-[2] py-5 shadow-2xl" onClick={handleSave} loading={isSaving || isUploading}><Check className="mr-2" /> {editingExpense ? 'ACTUALIZAR GASTO' : 'CONFIRMAR GASTO'}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;