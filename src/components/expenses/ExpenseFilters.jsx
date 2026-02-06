import React, { useMemo } from "react";
import Button from "../common/Button";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { useCategoryStore } from "../../stores/categoryStore";
import { 
  Wallet, CreditCard, Landmark, HelpCircle, DollarSign, Search, Filter, X,
  // ✅ IMPORTACIÓN MASIVA (Sincronizada)
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Receipt, TrendingUp, PiggyBank, Star, Zap
} from "lucide-react";

// ✅ MAPA MAESTRO DE ICONOS
const ICON_MAP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase, CreditCard, 
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle
};

const PAYMENT_METHODS = [
  { id: "all", label: "Todos", icon: DollarSign },
  { id: "efectivo", label: "Efectivo", icon: Wallet },
  { id: "tarjeta", label: "Tarjeta", icon: CreditCard },
  { id: "transferencia", label: "Transfer", icon: Landmark },
  { id: "otro", label: "Otro", icon: HelpCircle },
];

const SORT_OPTIONS = [
  { id: "date-desc", label: "Fecha ↓" },
  { id: "date-asc", label: "Fecha ↑" },
  { id: "amount-desc", label: "Mayor $" },
  { id: "amount-asc", label: "Menor $" },
];

const ExpenseFilters = ({ filters, onChange, onClose }) => {
  const { customCategories } = useCategoryStore();

  // Fusión de categorías para el filtro
  const allCategories = useMemo(() => {
    // Marcamos las custom para saber cómo renderizar su icono
    const formattedCustom = customCategories.map(c => ({ ...c, isCustom: true }));
    return [...SYSTEM_CATEGORIES, ...formattedCustom];
  }, [customCategories]);

  const toggleCategory = (catId) => {
    const newCats = filters.categories.includes(catId)
      ? filters.categories.filter((c) => c !== catId)
      : [...filters.categories, catId];
    onChange({ ...filters, categories: newCats });
  };

  const changePaymentMethod = (method) => {
    onChange({ ...filters, paymentMethod: method });
  };

  const changeSortBy = (sortId) => {
    onChange({ ...filters, sortBy: sortId });
  };

  const clearFilters = () => {
    onChange({
      categories: [],
      range: filters.range, // Mantener rango fecha
      search: "",
      paymentMethod: "all",
      minAmount: "",
      maxAmount: "",
      sortBy: "date-desc",
    });
  };

  return (
    <div className="bg-white/90 dark:bg-secondary-900/90 backdrop-blur-xl border-b border-secondary-200 dark:border-secondary-800 p-4 shadow-lg animate-in slide-in-from-top-2 z-40 relative">
      
      {/* Header Filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#FFD700]">
          <Filter size={18} />
          <span className="font-black uppercase text-xs tracking-widest">Filtros Avanzados</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-full">
          <X size={18} className="text-secondary-400" />
        </button>
      </div>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
        
        {/* BUSCADOR */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={14} />
          <input
            type="text"
            placeholder="Buscar concepto..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-4 py-3 rounded-2xl bg-secondary-50 dark:bg-secondary-800 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFD700] text-secondary-900 dark:text-white border border-transparent focus:border-[#FFD700]"
          />
        </div>

        {/* CATEGORÍAS */}
        <div>
          <p className="text-[9px] font-black uppercase mb-3 text-secondary-500 tracking-widest">Categorías</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {allCategories.map((cat) => {
              const isActive = filters.categories.includes(cat.id);
              
              // Lógica de Icono
              let IconNode = <HelpCircle size={16} />;
              if (cat.isCustom) {
                 const IconComp = ICON_MAP[cat.iconName] || HelpCircle;
                 IconNode = <IconComp size={16} />;
              } else {
                 const SysIcon = cat.icon;
                 IconNode = <SysIcon size={16} />;
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 border-2
                    ${isActive 
                      ? "bg-[#FFD700]/10 border-[#FFD700] text-[#b45309]" 
                      : "bg-secondary-50 dark:bg-secondary-800 border-transparent text-secondary-400 hover:bg-secondary-100"
                    }
                  `}
                >
                  <div style={{ color: isActive ? '#b45309' : cat.color }}>{IconNode}</div>
                  <span className="text-[7px] font-black uppercase mt-1 truncate w-full text-center">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MÉTODO DE PAGO */}
        <div>
          <p className="text-[9px] font-black uppercase mb-3 text-secondary-500 tracking-widest">Método de Pago</p>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {PAYMENT_METHODS.map((method) => {
              const isActive = filters.paymentMethod === method.id;
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => changePaymentMethod(method.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase whitespace-nowrap transition-all border
                    ${isActive 
                      ? "bg-[#FFD700] text-[#1e1b4b] border-[#FFD700] shadow-md" 
                      : "bg-secondary-50 dark:bg-secondary-800 border-transparent text-secondary-500"
                    }
                  `}
                >
                  <Icon size={12} />
                  {method.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RANGO DE PRECIO */}
        <div>
          <p className="text-[9px] font-black uppercase mb-3 text-secondary-500 tracking-widest">Rango de Monto</p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 font-bold">$</span>
              <input
                type="number"
                placeholder="Mín"
                value={filters.minAmount}
                onChange={(e) => onChange({ ...filters, minAmount: e.target.value })}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-secondary-50 dark:bg-secondary-800 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFD700] text-secondary-900 dark:text-white"
              />
            </div>
            <span className="text-secondary-400 font-bold">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 font-bold">$</span>
              <input
                type="number"
                placeholder="Máx"
                value={filters.maxAmount}
                onChange={(e) => onChange({ ...filters, maxAmount: e.target.value })}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-secondary-50 dark:bg-secondary-800 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFD700] text-secondary-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* ORDENAR POR */}
        <div>
          <p className="text-[9px] font-black uppercase mb-3 text-secondary-500 tracking-widest">Ordenar Por</p>
          <div className="grid grid-cols-4 gap-2">
            {SORT_OPTIONS.map(option => {
              const isActive = filters.sortBy === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => changeSortBy(option.id)}
                  className={`px-2 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${
                    isActive
                      ? "bg-[#FFD700] text-[#1e1b4b] shadow-md"
                      : "bg-secondary-50 dark:bg-secondary-800 text-secondary-400"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTÓN LIMPIAR */}
        <Button 
          variant="outline" 
          fullWidth 
          onClick={clearFilters}
          className="border-dashed border-secondary-300 text-secondary-500 hover:border-[#FFD700] hover:text-[#b45309]"
        >
          Limpiar Filtros
        </Button>
      </div>
    </div>
  );
};

export default ExpenseFilters;