import React from 'react';
import { 
  X, MapPin, Image as ImageIcon, ExternalLink, Tag, Calendar, 
  // ✅ IMPORTACIÓN MASIVA
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle, Star, Zap, CreditCard,
  CornerDownRight
} from "lucide-react";
import Button from "../common/Button";
import { SYSTEM_CATEGORIES, EMOTIONS } from "../../constants/categories";
import { useCategoryStore } from "../../stores/categoryStore";

// ✅ MAPA MAESTRO DE ICONOS
const ICON_MAP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase, CreditCard, 
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle
};

const PAYMENT_ICONS = {
  efectivo: Wallet,
  tarjeta: CreditCard,
  transferencia: Landmark,
  otro: HelpCircle
};

export default function ExpenseDetails({ expense, onClose }) {
  const { customCategories } = useCategoryStore();

  if (!expense) return null;

  // 1. Resolver Categoría
  let category = SYSTEM_CATEGORIES.find(c => c.id === expense.categoryId);
  let isCustom = false;

  if (!category) {
    category = customCategories.find(c => c.id === expense.categoryId);
    isCustom = true;
  }

  // 2. Resolver Icono y Color
  let CategoryIcon = HelpCircle;
  let categoryColor = '#FFD700';

  if (category) {
    categoryColor = category.color || '#FFD700';
    if (isCustom) {
      CategoryIcon = ICON_MAP[category.iconName] || HelpCircle;
    } else {
      CategoryIcon = category.icon;
    }
  }

  const emotionData = EMOTIONS.find(e => e.id === expense.emotion);
  const EmotionIcon = emotionData?.icon || HelpCircle;
  const PaymentIcon = PAYMENT_ICONS[expense.paymentMethod] || HelpCircle;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      
      {/* TARJETA DE CRISTAL (Liquid Glass) */}
      <div className="w-full max-w-md bg-white/95 dark:bg-secondary-900/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        
        {/* Header con Color de Categoría */}
        <div 
          className="h-32 w-full absolute top-0 left-0 opacity-15 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${categoryColor} 0%, transparent 100%)` }}
        />

        <div className="relative p-6 space-y-6">
          
          {/* Barra Superior */}
          <div className="flex justify-between items-start">
            <div 
              className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg text-[#1e1b4b]"
              style={{ backgroundColor: categoryColor }}
            >
              <CategoryIcon size={32} strokeWidth={2} />
            </div>
            <button onClick={onClose} className="p-2 bg-white/50 dark:bg-black/20 hover:bg-white rounded-full transition-colors">
              <X size={20} className="text-secondary-500" />
            </button>
          </div>

          {/* INFORMACIÓN PRINCIPAL */}
          <div className="space-y-2">
            
            {/* Categoría y Subcategoría (Badges) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#FFD700]/10 text-[#b45309] border border-[#FFD700]/30 text-[10px] font-black uppercase tracking-wider">
                {category?.label || 'Sin Categoría'}
              </span>
              
              {expense.subcategoryName && (
                <>
                  <span className="text-secondary-300 dark:text-secondary-700">/</span>
                  <span className="px-3 py-1 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-secondary-500 border border-secondary-200 dark:border-secondary-700 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <CornerDownRight size={10} />
                    {expense.subcategoryName}
                  </span>
                </>
              )}
            </div>

            {/* Descripción */}
            <h2 className="text-2xl font-black text-secondary-900 dark:text-white leading-tight">
              {expense.description || "Gasto sin descripción"}
            </h2>
            
            {/* Monto */}
            <p className="text-4xl font-black text-[#FFD700] tracking-tighter">
              ${Number(expense.amount).toLocaleString()}
            </p>
          </div>

          {/* Detalles Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-secondary-50/50 dark:bg-secondary-800/50 rounded-2xl flex items-center gap-3 border border-white/10">
              <div className="p-2 bg-white dark:bg-secondary-900 rounded-xl text-secondary-400">
                <Calendar size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-secondary-400 tracking-wider">Fecha</span>
                <span className="text-xs font-bold">{new Date(expense.date).toLocaleDateString('es-MX')}</span>
              </div>
            </div>

            <div className="p-3 bg-secondary-50/50 dark:bg-secondary-800/50 rounded-2xl flex items-center gap-3 border border-white/10">
              <div className="p-2 bg-white dark:bg-secondary-900 rounded-xl text-secondary-400">
                <PaymentIcon size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-secondary-400 tracking-wider">Pago</span>
                <span className="text-xs font-bold capitalize">{expense.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Tags e Info Extra */}
          <div className="space-y-3">
            {expense.tags && expense.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {expense.tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-[10px] font-black uppercase tracking-wide text-secondary-500">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {expense.emotion && (
              <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                <EmotionIcon size={18} className="text-indigo-500" />
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">
                  Me sentí {EMOTIONS.find(e => e.id === expense.emotion)?.label}
                </span>
              </div>
            )}
          </div>

          {/* Ticket Imagen */}
          {expense.imageUrl && (
            <div className="mt-4 group relative overflow-hidden rounded-[2rem] border-2 border-white/20 shadow-lg cursor-pointer" onClick={() => window.open(expense.imageUrl, '_blank')}>
              <img src={expense.imageUrl} alt="Ticket" className="w-full h-40 object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon size={16} /> Ver Ticket
                </span>
              </div>
            </div>
          )}

          {/* Ubicación */}
          {expense.location && (
            <a 
              href={`https://www.google.com/maps?q=${expense.location.lat},${expense.location.lng}`} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Ver ubicación en Maps</span>
              </div>
              <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          )}

          <Button variant="primary" fullWidth className="py-4 shadow-xl" onClick={onClose}>
            Cerrar Detalles
          </Button>
        </div>
      </div>
    </div>
  );
}