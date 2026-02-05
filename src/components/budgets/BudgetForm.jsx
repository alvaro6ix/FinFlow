import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { SYSTEM_CATEGORIES } from '../../constants/categories';
import { useCategoryStore } from '../../stores/categoryStore';
import { useAuthStore } from '../../stores/authStore';
import { HelpCircle } from 'lucide-react';

const BudgetForm = ({ onSubmit, onCancel, editBudget = null }) => {
  const { customCategories } = useCategoryStore();
  const { user } = useAuthStore();
  const allCategories = [...SYSTEM_CATEGORIES, ...customCategories];

  const [formData, setFormData] = useState({
    categoryId: editBudget?.categoryId || '',
    amount: editBudget?.amount || '',
    period: editBudget?.period || 'monthly',
    alertThreshold: editBudget?.alertThreshold || 80,
    startDate: editBudget?.startDate || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = allCategories.find(c => c.id === formData.categoryId);
    
    // ✅ CORRECCIÓN DE ICONO: Pasamos el icono como valor, no como objeto
    onSubmit({
      ...formData,
      userId: user.uid,
      amount: parseFloat(formData.amount),
      categoryLabel: cat?.label || 'Categoría',
      categoryIcon: cat?.icon // Guardamos la referencia para el renderizado
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase text-secondary-400 tracking-widest text-center block">
          Selecciona Categoría
        </label>
        {/* Selector Responsive: 3 columnas en móvil, 4 en desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto p-1 custom-scrollbar">
          {allCategories.map((cat) => {
            const Icon = cat.icon || HelpCircle;
            const isSelected = formData.categoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all active:scale-90 ${
                  isSelected ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' : 'border-secondary-100 dark:border-secondary-800'
                }`}
              >
                <span className="text-xl">
                  {typeof Icon === 'string' ? Icon : <Icon size={20} />}
                </span>
                <span className="text-[8px] font-black uppercase truncate w-full text-center text-secondary-900 dark:text-white">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Monto Límite"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
        />
        <div className="flex flex-col">
          <label className="text-[10px] font-black uppercase text-secondary-400 mb-2 ml-1">Periodo</label>
          <select 
            className="p-3.5 bg-secondary-100 dark:bg-secondary-800 rounded-xl text-xs font-bold dark:text-white outline-none"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
          >
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
            <option value="yearly">Anual</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" variant="primary" className="flex-1 bg-indigo-600" disabled={!formData.categoryId || !formData.amount}>
          {editBudget ? 'Actualizar' : 'Crear'} Límite
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;