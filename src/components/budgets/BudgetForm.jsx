import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { DEFAULT_CATEGORIES } from '../../constants/categories';

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
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          Categoría *
        </label>
        <div className="grid grid-cols-4 gap-2">
          {DEFAULT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleChange('categoryId', category.id)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${formData.categoryId === category.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-200 dark:border-secondary-700'
                }
              `}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-xs">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <Input
        label="Monto del presupuesto"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
        placeholder="0.00"
        required
      />

      {/* Period */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          Período
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleChange('period', 'monthly')}
            className={`
              p-3 rounded-lg border-2 transition-all
              ${formData.period === 'monthly'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-secondary-200 dark:border-secondary-700'
              }
            `}
          >
            📅 Mensual
          </button>
          <button
            type="button"
            onClick={() => handleChange('period', 'yearly')}
            className={`
              p-3 rounded-lg border-2 transition-all
              ${formData.period === 'yearly'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-secondary-200 dark:border-secondary-700'
              }
            `}
          >
            📆 Anual
          </button>
        </div>
      </div>

      {/* Alert Threshold */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          Alerta al alcanzar: {formData.alertThreshold}%
        </label>
        <input
          type="range"
          min="50"
          max="100"
          step="5"
          value={formData.alertThreshold}
          onChange={(e) => handleChange('alertThreshold', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-secondary-500 mt-1">
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          fullWidth
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth
          disabled={!formData.categoryId || !formData.amount}
        >
          {initialData ? 'Actualizar' : 'Crear Presupuesto'}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;