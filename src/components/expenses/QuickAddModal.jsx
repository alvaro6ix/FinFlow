import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { useExpenseStore } from '../../stores/expenseStore';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';

const QuickAddModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const { addExpense } = useExpenseStore();
  const { user } = useAuthStore();
  const { currency, customCategories } = useSettingsStore();

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || !selectedCategory) {
      alert('Por favor ingresa el monto y selecciona una categoría');
      return;
    }

    setLoading(true);

    const expense = {
      amount: parseFloat(amount),
      categoryId: selectedCategory.id,
      description: description || 'Sin descripción',
      date: date,
      paymentMethod: 'cash',
      currency: currency,
    };

    const result = await addExpense(expense, user.uid);

    if (result.success) {
      // Limpiar formulario
      setAmount('');
      setDescription('');
      setSelectedCategory(null);
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    }

    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="💰 Agregar Gasto Rápido"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Monto
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-primary-600">
              {currency === 'MXN' ? '$' : currency === 'USD' ? '$' : '€'}
            </span>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="
                w-full pl-12 pr-4 py-4 text-4xl font-bold text-center
                border-2 border-primary-300 rounded-xl
                focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/20
                bg-primary-50 dark:bg-primary-900/20
                text-secondary-900 dark:text-white
              "
              autoFocus
            />
          </div>
        </div>

        {/* Category Grid */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
            Categoría
          </label>
          <div className="grid grid-cols-4 gap-3">
            {allCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200
                  flex flex-col items-center gap-2
                  ${
                    selectedCategory?.id === category.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105 shadow-md'
                      : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300 hover:scale-105'
                  }
                `}
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-xs font-medium text-center text-secondary-700 dark:text-secondary-300">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Description (Optional) */}
        <Input
          label="Descripción (opcional)"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿En qué lo gastaste?"
        />

        {/* Date */}
        <Input
          label="Fecha"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!amount || !selectedCategory}
        >
          Guardar Gasto
        </Button>
      </form>
    </Modal>
  );
};

export default QuickAddModal;