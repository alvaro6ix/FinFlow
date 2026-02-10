import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, Calendar, DollarSign, Tag, Clock, FolderOpen, Target } from 'lucide-react';
import { 
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, Star, Zap, HelpCircle, CreditCard
} from 'lucide-react';

// ✅ MAPA MAESTRO DE ICONOS (Igual que en ExpenseForm)
const ICON_MAP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase, CreditCard, 
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle, Tag
};

const BudgetForm = ({ onSubmit, onCancel, initialData = null, allCategories = [] }) => {
  const [formData, setFormData] = useState({
    categoryId: initialData?.categoryId || '',
    subcategoryId: initialData?.subcategoryId || '',
    amount: initialData?.amount || '',
    period: initialData?.period || 'monthly',
    alertThreshold: initialData?.alertThreshold || 80,
    startDate: initialData?.startDate 
      ? new Date(initialData.startDate.seconds * 1000 || initialData.startDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate 
      ? new Date(initialData.endDate.seconds * 1000 || initialData.endDate).toISOString().split('T')[0] 
      : ''
  });

  // 1. Filtrar Categorías Padre (Las que NO tienen parentId o son del sistema)
  const parentCategories = useMemo(() => {
    return allCategories.filter(c => !c.parentId);
  }, [allCategories]);

  // 2. Obtener Subcategorías (Híbrido: Sistema + Custom)
  const subcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    
    const parent = allCategories.find(c => c.id === formData.categoryId);
    
    // Caso A: Categoría de Sistema (Array interno)
    if (parent?.subcategories && Array.isArray(parent.subcategories)) {
      return parent.subcategories;
    }
    
    // Caso B: Categoría Personalizada (Búsqueda por parentId)
    return allCategories.filter(c => c.parentId === formData.categoryId);
  }, [allCategories, formData.categoryId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) return;

    const cat = allCategories.find(c => c.id === formData.categoryId);
    const subcat = subcategories.find(s => s.id === formData.subcategoryId);
    
    // Etiqueta: "Comida › Tacos"
    const label = subcat ? `${cat?.label} › ${subcat.label}` : cat?.label || 'Categoría';

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      categoryLabel: label,
      categoryColor: cat?.color || '#6366f1',
      categoryIconName: cat?.iconName || null,
      startDate: new Date(formData.startDate + 'T00:00:00'),
      endDate: formData.endDate ? new Date(formData.endDate + 'T23:59:59') : null
    });
  };

  // ✅ Renderizado Blindado de Iconos
  const renderIcon = (cat) => {
    // 1. Componente directo
    if (cat.icon && typeof cat.icon !== 'string') {
      const Icon = cat.icon;
      return <Icon size={20} />;
    }
    // 2. Nombre de string (mapa)
    if (cat.iconName && ICON_MAP[cat.iconName]) {
      const Icon = ICON_MAP[cat.iconName];
      return <Icon size={20} />;
    }
    return <Tag size={20} />;
  };

  // Estilos Liquid Glass Oscuro (Texto blanco forzado en dark mode)
  const inputClass = "w-full pl-10 p-4 bg-white/50 dark:bg-black/40 border border-secondary-200 dark:border-white/10 rounded-xl font-bold text-secondary-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FFD700] transition-all placeholder-secondary-400 backdrop-blur-md";
  const labelClass = "text-[10px] font-black uppercase text-secondary-400 mb-2 ml-1 block tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-2 pb-4 border-b border-secondary-100 dark:border-white/10">
        <div className="p-2 bg-[#FFD700]/20 rounded-xl text-[#b45309] dark:text-[#FFD700]">
          <Target size={20} />
        </div>
        <h3 className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-tight">
          {initialData ? 'Editar Límite' : 'Configurar Límite'}
        </h3>
      </div>

      {/* 1. SELECCIÓN DE CATEGORÍA PADRE */}
      <div>
        <label className={labelClass}>Categoría Principal</label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
          {parentCategories.map((cat) => {
            const isSelected = formData.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, categoryId: cat.id, subcategoryId: '' })}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border-2 ${
                  isSelected 
                    ? 'border-[#FFD700] bg-[#FFD700]/10 scale-105 shadow-lg shadow-[#FFD700]/20' 
                    : 'border-transparent bg-secondary-50 dark:bg-white/5 hover:bg-secondary-100 dark:hover:bg-white/10'
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 text-lg shadow-sm transition-colors ${
                    isSelected ? 'bg-[#FFD700] text-[#1e1b4b]' : 'bg-white dark:bg-secondary-800 text-secondary-500 dark:text-secondary-300'
                  }`}
                  style={{ color: !isSelected ? cat.color : undefined }}
                >
                  {renderIcon(cat)}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tight truncate w-full text-center ${
                  isSelected ? 'text-[#1e1b4b] dark:text-[#FFD700]' : 'text-secondary-500 dark:text-secondary-400'
                }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUBCATEGORÍA (Ahora sí aparece) */}
      {subcategories.length > 0 && (
        <div className="space-y-1 animate-in slide-in-from-top-2">
          <label className={labelClass}>Subcategoría (Específica)</label>
          <div className="relative">
            <FolderOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 z-10" size={18} />
            <select 
              className={`${inputClass} appearance-none cursor-pointer`}
              value={formData.subcategoryId}
              onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
            >
              <option value="" className="text-gray-500">-- General (Toda la categoría) --</option>
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id} className="text-secondary-900 font-bold">
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 3. MONTO */}
      <div className="space-y-1">
        <label className={labelClass}>Límite de Gasto</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 z-10" size={18} />
          <input 
            type="number" 
            className={inputClass}
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
      </div>

      {/* 4. PERIODO Y FECHAS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelClass}>Periodo</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 z-10" size={18} />
            <select 
              className={`${inputClass} appearance-none`}
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            >
              <option value="daily" className="text-black">Diario</option>
              <option value="weekly" className="text-black">Semanal</option>
              <option value="monthly" className="text-black">Mensual</option>
              <option value="yearly" className="text-black">Anual</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Fecha Inicio</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 z-10" size={18} />
            <input 
              type="date"
              className={`${inputClass} dark:[color-scheme:dark]`} // Forzar icono calendario oscuro/claro
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>Fecha Fin (Opcional)</label>
        <div className="relative">
          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 z-10" size={18} />
          <input 
            type="date"
            className={`${inputClass} dark:[color-scheme:dark]`}
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      {/* 5. ALERTA */}
      <div className="p-5 bg-orange-50 dark:bg-orange-500/10 rounded-2xl border border-orange-100 dark:border-orange-500/20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <AlertTriangle size={16} />
            <span className="text-xs font-black uppercase tracking-wider">Alerta al {formData.alertThreshold}%</span>
          </div>
          <span className="text-xs font-bold text-secondary-900 dark:text-white bg-white dark:bg-black/20 px-2 py-1 rounded-lg">
            {formData.alertThreshold}%
          </span>
        </div>
        <input 
          type="range" min="50" max="100" step="5" 
          value={formData.alertThreshold}
          onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
          className="w-full h-2 bg-orange-200 dark:bg-orange-900/50 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-secondary-500 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-white/10 transition-colors">Cancelar</button>
        <button type="submit" className="flex-1 bg-[#FFD700] hover:bg-[#e6c200] text-[#1e1b4b] py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 transition-all active:scale-95">
          {initialData ? 'Actualizar' : 'Crear Límite'}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;