import React, { useState } from 'react';
import { AlertTriangle, Calendar, DollarSign, Tag, Clock } from 'lucide-react';

import { 
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, Star, Zap, HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle, Tag
};

const BudgetForm = ({ onSubmit, onCancel, initialData = null, allCategories = [] }) => {
  const [formData, setFormData] = useState({
    categoryId: initialData?.categoryId || '',
    amount: initialData?.amount || '',
    period: initialData?.period || 'monthly',
    alertThreshold: initialData?.alertThreshold || 80,
    startDate: initialData?.startDate 
      ? new Date(initialData.startDate.seconds * 1000 || initialData.startDate).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) return;

    const cat = allCategories.find(c => c.id === formData.categoryId);
    
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      categoryLabel: cat?.label || 'Categoría',
      categoryColor: cat?.color || '#6366f1',
      categoryIconName: cat?.iconName || (cat?.isCustom ? 'HelpCircle' : null),
      startDate: new Date(formData.startDate + 'T00:00:00')
    });
  };

  const renderIcon = (cat) => {
    if (!cat.isCustom && cat.icon) {
      const IconComponent = cat.icon;
      return <IconComponent size={24} />;
    }
    
    if (cat.isCustom && cat.iconName) {
      const IconComponent = ICON_MAP[cat.iconName] || HelpCircle;
      return <IconComponent size={24} />;
    }
    
    return <Tag size={24} />;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* CATEGORÍAS */}
      <div>
        <label className="text-[10px] font-black uppercase text-secondary-400 dark:text-secondary-500 mb-3 ml-1 block tracking-widest">
          Selecciona Categoría
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-64 overflow-y-auto custom-scrollbar p-1">
          {allCategories.map((cat) => {
            const isSelected = formData.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border-2 ${
                  isSelected 
                    ? 'border-[#FFD700] bg-[#FFD700]/10 scale-105 shadow-lg' 
                    : 'border-transparent bg-secondary-50 dark:bg-secondary-800 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 shadow-sm transition-all ${
                    isSelected ? 'bg-[#FFD700] text-[#1e1b4b]' : 'bg-white dark:bg-secondary-700'
                  }`}
                  style={{ 
                    color: !isSelected ? cat.color : undefined 
                  }}
                >
                  {renderIcon(cat)}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tight truncate w-full text-center ${
                  isSelected ? 'text-[#1e1b4b] dark:text-[#FFD700]' : 'text-secondary-500 dark:text-secondary-400'
                }`}>
                  {cat.label}
                </span>
                {cat.isCustom && (
                  <span className="text-[7px] text-secondary-400 dark:text-secondary-500 mt-0.5">Personal</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MONTO */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-secondary-400 dark:text-secondary-500 ml-1">
          Límite de Gasto
        </label>
        <div className="relative">
          <DollarSign 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500" 
            size={18} 
          />
          <input 
            type="number" 
            step="0.01"
            min="0"
            className="w-full pl-10 p-4 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl font-black text-secondary-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FFD700] transition-all placeholder-secondary-400 dark:placeholder-secondary-600"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
      </div>

      {/* PERIODO Y FECHA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-secondary-400 dark:text-secondary-500 ml-1">
            Periodo
          </label>
          <div className="relative">
            <Calendar 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500 pointer-events-none" 
              size={18} 
            />
            <select 
              className="w-full pl-10 p-4 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl font-bold text-secondary-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FFD700] appearance-none cursor-pointer"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-secondary-400 dark:text-secondary-500 ml-1">
            Fecha de Inicio
          </label>
          <div className="relative">
            <Clock 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500 pointer-events-none" 
              size={18} 
            />
            <input 
              type="date"
              className="w-full pl-10 p-4 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl font-bold text-secondary-900 dark:text-white outline-none focus:ring-2 focus:ring-[#FFD700] cursor-pointer"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* ALERTA */}
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <AlertTriangle size={16} />
            <span className="text-xs font-black uppercase">
              Notificar al {formData.alertThreshold}%
            </span>
          </div>
          <span className="text-xs font-bold text-secondary-500 dark:text-secondary-400">
            {formData.alertThreshold}%
          </span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="100" 
          step="5"
          value={formData.alertThreshold}
          onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
          className="w-full h-2 bg-orange-200 dark:bg-orange-900/50 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <p className="text-[10px] text-orange-600/70 dark:text-orange-400/70 mt-2 font-medium">
          Recibirás una alerta cuando alcances este porcentaje
        </p>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3 pt-2">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-secondary-500 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={!formData.categoryId || !formData.amount}
          className="flex-1 bg-[#FFD700] hover:bg-[#e6c200] disabled:bg-secondary-300 dark:disabled:bg-secondary-700 disabled:cursor-not-allowed text-[#1e1b4b] py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
        >
          {initialData ? 'Actualizar' : 'Crear Límite'}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;