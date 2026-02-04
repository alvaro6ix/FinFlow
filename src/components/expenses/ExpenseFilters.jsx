import React, { useMemo } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { useCategoryStore } from "../../stores/categoryStore"; // ✅ Importar store
import { 
  Wallet, CreditCard, Landmark, HelpCircle, DollarSign,
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Star, Zap, Music, Camera, Wrench 
} from "lucide-react";

// Biblioteca de iconos para categorías personalizadas
const ICON_MAP = {
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Star, Zap, Music, Camera, Wrench, HelpCircle
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
  { id: "amount-desc", label: "Monto ↓" },
  { id: "amount-asc", label: "Monto ↑" },
  { id: "category", label: "Categoría" },
];

export default function ExpenseFilters({ filters, onChange }) {
  const { customCategories, hiddenSystemIds } = useCategoryStore();

  // ✅ UNIFICACIÓN DE CATEGORÍAS PARA EL FILTRO
  const allAvailableCategories = useMemo(() => {
    // 1. Filtrar las de sistema que no estén ocultas
    const visibleSystem = SYSTEM_CATEGORIES.filter(cat => !hiddenSystemIds.includes(cat.id));
    
    // 2. Mapear las personalizadas
    const formattedCustom = customCategories.map(cat => ({
      ...cat,
      isCustom: true
    }));

    return [...visibleSystem, ...formattedCustom];
  }, [customCategories, hiddenSystemIds]);

  const toggleCategory = (id) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter(c => c !== id)
      : [...filters.categories, id];

    onChange({ ...filters, categories: next });
  };

  const changeRange = (r) => {
    onChange({ ...filters, range: r });
  };

  const changePaymentMethod = (method) => {
    onChange({ ...filters, paymentMethod: method });
  };

  const changeSortBy = (sortBy) => {
    onChange({ ...filters, sortBy });
  };

  const handleMinAmountChange = (value) => {
    onChange({ ...filters, minAmount: value });
  };

  const handleMaxAmountChange = (value) => {
    onChange({ ...filters, maxAmount: value });
  };

  const clearFilters = () => {
    onChange({
      categories: [],
      range: "month",
      search: filters.search,
      paymentMethod: "all",
      minAmount: "",
      maxAmount: "",
      sortBy: "date-desc"
    });
  };

  return (
    <Card>
      <div className="space-y-5">
        {/* PERIODO */}
        <div>
          <p className="text-[9px] font-black uppercase mb-2 text-secondary-500 tracking-widest">Periodo</p>
          <div className="flex gap-2 flex-wrap">
            {["today", "week", "month", "year"].map(r => (
              <button
                key={r}
                onClick={() => changeRange(r)}
                className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                  filters.range === r ? "bg-indigo-600 text-white shadow-lg" : "bg-secondary-100 dark:bg-secondary-800 text-secondary-500"
                }`}
              >
                {r === 'today' ? 'Hoy' : r === 'week' ? 'Semana' : r === 'month' ? 'Mes' : r === 'year' ? 'Año' : r}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORÍAS UNIFICADAS */}
        <div>
          <p className="text-[9px] font-black uppercase mb-2 text-secondary-500 tracking-widest">Categorías</p>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
            {allAvailableCategories.map(cat => {
              const isActive = filters.categories.includes(cat.id);
              
              // Lógica de icono idéntica al modal para evitar errores
              let IconNode = null;
              if (cat.isCustom) {
                const CustomIcon = ICON_MAP[cat.iconName] || HelpCircle;
                IconNode = <CustomIcon size={16} />;
              } else {
                const SystemIcon = cat.icon;
                IconNode = <SystemIcon size={16} />;
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-2 rounded-xl text-[7px] font-black uppercase flex flex-col items-center gap-1 transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-secondary-50 dark:bg-secondary-800 text-secondary-400"
                  }`}
                >
                  <div style={{ color: isActive ? 'white' : cat.color }}>
                    {IconNode}
                  </div>
                  <span className="truncate w-full text-center leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MÉTODO DE PAGO */}
        <div>
          <p className="text-[9px] font-black uppercase mb-2 text-secondary-500 tracking-widest">Método de Pago</p>
          <div className="grid grid-cols-5 gap-2">
            {PAYMENT_METHODS.map(method => {
              const Icon = method.icon;
              const isActive = filters.paymentMethod === method.id;
              
              return (
                <button
                  key={method.id}
                  onClick={() => changePaymentMethod(method.id)}
                  className={`p-2 rounded-xl text-[7px] font-black uppercase flex flex-col items-center gap-1 transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-secondary-50 dark:bg-secondary-800 text-secondary-400"
                  }`}
                >
                  <Icon size={14} />
                  <span className="truncate w-full text-center leading-tight">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RANGO DE MONTO */}
        <div>
          <p className="text-[9px] font-black uppercase mb-2 text-secondary-500 tracking-widest">Rango de Monto</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 text-xs">$</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => handleMinAmountChange(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-secondary-50 dark:bg-secondary-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-secondary-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 text-xs">$</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => handleMaxAmountChange(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-secondary-50 dark:bg-secondary-800 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-secondary-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* ORDENAR POR */}
        <div>
          <p className="text-[9px] font-black uppercase mb-2 text-secondary-500 tracking-widest">Ordenar Por</p>
          <div className="grid grid-cols-3 gap-2">
            {SORT_OPTIONS.map(option => {
              const isActive = filters.sortBy === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => changeSortBy(option.id)}
                  className={`px-2 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
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
          variant="ghost" 
          fullWidth 
          onClick={clearFilters}
          className="text-[9px] font-black uppercase mt-2"
        >
          Limpiar filtros
        </Button>
      </div>
    </Card>
  );
}