import React from 'react';
import { 
  Trash2, Image, MapPin, Eye, 
  // ✅ IMPORTACIÓN MASIVA DE ICONOS
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle, Star, Zap, CreditCard
} from "lucide-react";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { useCategoryStore } from "../../stores/categoryStore";

// ✅ MAPA MAESTRO DE ICONOS
const ICON_MAP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase, CreditCard, 
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle
};

export default function ExpenseCard({ expense, onDelete, onOpen }) {
  const { customCategories } = useCategoryStore();

  // 1. Resolver Categoría (Sistema o Personalizada)
  let category = SYSTEM_CATEGORIES.find(c => c.id === expense.categoryId);
  let isCustom = false;

  if (!category) {
    category = customCategories.find(c => c.id === expense.categoryId);
    isCustom = true;
  }

  // 2. Resolver Icono y Color
  let IconComponent = HelpCircle;
  let categoryColor = '#FFD700'; // Default Gold

  if (category) {
    categoryColor = category.color || '#FFD700';
    if (isCustom) {
      IconComponent = ICON_MAP[category.iconName] || HelpCircle;
    } else {
      IconComponent = category.icon;
    }
  }

  return (
    <div 
      className="relative overflow-hidden group bg-white/70 dark:bg-secondary-900/60 backdrop-blur-xl rounded-[2rem] p-5 shadow-lg border border-white/40 dark:border-white/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Brillo superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
      
      {/* Indicador de Color Lateral */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: categoryColor }} />

      <div className="flex justify-between items-start gap-4 pl-2">
        
        {/* INFO PRINCIPAL */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
              {category?.label || "Gasto"}
            </span>
            {expense.purchaseType && (
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase border ${
                expense.purchaseType === 'need' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 
                expense.purchaseType === 'impulse' ? 'border-red-200 text-red-600 bg-red-50' : 
                'border-blue-200 text-blue-600 bg-blue-50'
              }`}>
                {expense.purchaseType}
              </span>
            )}
          </div>

          <h3 className="font-black text-sm text-secondary-900 dark:text-white truncate leading-tight mb-2">
            {expense.description || category?.label}
          </h3>

          <div className="flex items-center gap-2 text-xs text-secondary-500">
            <div 
              className="p-1.5 rounded-lg" 
              style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
            >
              <IconComponent size={14} />
            </div>
            <span className="text-[10px] font-bold text-secondary-400">
              {new Date(expense.date).toLocaleDateString("es-MX", { day: 'numeric', month: 'short' })}
            </span>
          </div>

          {/* EXTRAS (Iconos pequeños) */}
          <div className="flex gap-2 mt-3 opacity-60">
            {expense.imageUrl && <Image size={12} className="text-[#FFD700]" />}
            {expense.location && <MapPin size={12} className="text-emerald-500" />}
          </div>
        </div>

        {/* PRECIO Y ACCIONES */}
        <div className="text-right flex flex-col justify-between h-full gap-2">
          <p className="text-lg font-black text-secondary-900 dark:text-white tracking-tight">
            ${Number(expense.amount).toLocaleString()}
          </p>

          <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
            {onOpen && (
              <button 
                onClick={() => onOpen(expense)}
                className="p-2 bg-[#FFD700] text-[#1e1b4b] rounded-xl shadow-lg hover:scale-110 transition-transform"
              >
                <Eye size={14} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(expense.id)}
                className="p-2 bg-white dark:bg-secondary-800 text-red-500 border border-red-100 rounded-xl shadow-sm hover:bg-red-50 hover:scale-110 transition-transform"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}