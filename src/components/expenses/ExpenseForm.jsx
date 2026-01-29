import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { DEFAULT_CATEGORIES, PAYMENT_METHODS } from '../../constants/categories';

const ExpenseForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    categoryId: initialData?.categoryId || '',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    paymentMethod: initialData?.paymentMethod || 'cash',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Monto"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={(e) => handleChange('amount', e.target.value)}
        placeholder="0.00"
        required
      />

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

      <Input
        label="Descripción"
        type="text"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        placeholder="¿En qué lo gastaste?"
      />

      <Input
        label="Fecha"
        type="date"
        value={formData.date}
        onChange={(e) => handleChange('date', e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          Método de pago
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => handleChange('paymentMethod', method.id)}
              className={`
                p-3 rounded-lg border-2 transition-all flex items-center gap-2
                ${formData.paymentMethod === method.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-200 dark:border-secondary-700'
                }
              `}
            >
              <span className="text-xl">{method.icon}</span>
              <span className="text-sm">{method.name}</span>
            </button>
          ))}
        </div>
      </div>

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
          disabled={!formData.amount || !formData.categoryId}
        >
          {initialData ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;