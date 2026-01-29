import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { SYSTEM_CATEGORIES } from '../../constants/categories';

const BudgetForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    categoryId: initialData?.categoryId || '',
    amount: initialData?.amount || '',
    period: initialData?.period || 'monthly',
    alertThreshold: initialData?.alertThreshold || 80,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Inyectamos la metadata de la categoría para evitar Lookups pesados en el Dashboard
    const category = SYSTEM_CATEGORIES.find(c => c.id === formData.categoryId);
    
    await onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      categoryLabel: category?.label,
      categoryIcon: category?.icon,
      categoryColor: category?.color
    });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-black text-secondary-400 uppercase tracking-widest mb-3">
          Categoría del Presupuesto
        </label>
        <div className="grid grid-cols-4 gap-2">
          {SYSTEM_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleChange('categoryId', category.id)}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center active:scale-90 ${
                formData.categoryId === category.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                  : 'border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-900'
              }`}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-[8px] font-black uppercase text-center truncate w-full">{category.label}</div>
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Monto Máximo Permitido"
        type="number"
        value={formData.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
        placeholder="0.00"
        required
      />

      <div className="bg-secondary-50 dark:bg-secondary-800/50 p-6 rounded-3xl">
        <label className="block text-xs font-black text-secondary-400 uppercase mb-4 text-center">
          Alerta de Proximidad: {formData.alertThreshold}%
        </label>
        <input
          type="range"
          min="50"
          max="100"
          step="5"
          value={formData.alertThreshold}
          onChange={(e) => handleChange('alertThreshold', parseInt(e.target.value))}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-[10px] font-bold text-secondary-400 mt-2">
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} fullWidth>Cancelar</Button>
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading} 
          fullWidth 
          disabled={!formData.categoryId || !formData.amount}
        >
          {initialData ? 'Actualizar' : 'Crear Límite'}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;