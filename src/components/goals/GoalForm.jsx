import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const GoalForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    targetAmount: initialData?.targetAmount || '',
    currentAmount: initialData?.currentAmount || 0,
    deadline: initialData?.deadline || '',
    imageUrl: initialData?.imageUrl || '',
    priority: initialData?.priority || 'medium',
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
        label="Nombre de la meta"
        type="text"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Ej: Viaje a Europa, Auto nuevo, Fondo de emergencia"
        required
      />

      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe tu meta..."
          rows={3}
          className="w-full rounded-lg border border-secondary-300 dark:border-secondary-600 px-3 py-2 text-secondary-900 dark:text-white bg-white dark:bg-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monto objetivo"
          type="number"
          step="0.01"
          value={formData.targetAmount}
          onChange={(e) => handleChange('targetAmount', e.target.value)}
          placeholder="0.00"
          required
        />

        <Input
          label="Monto actual"
          type="number"
          step="0.01"
          value={formData.currentAmount}
          onChange={(e) => handleChange('currentAmount', e.target.value)}
          placeholder="0.00"
        />
      </div>

      <Input
        label="Fecha límite (opcional)"
        type="date"
        value={formData.deadline}
        onChange={(e) => handleChange('deadline', e.target.value)}
      />

      <Input
        label="URL de imagen (opcional)"
        type="url"
        value={formData.imageUrl}
        onChange={(e) => handleChange('imageUrl', e.target.value)}
        placeholder="https://ejemplo.com/imagen.jpg"
        helperText="Agrega una imagen motivacional para tu meta"
      />

      <div>
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
          Prioridad
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['low', 'medium', 'high'].map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => handleChange('priority', priority)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${formData.priority === priority
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-200 dark:border-secondary-700'
                }
              `}
            >
              {priority === 'low' && '🔵 Baja'}
              {priority === 'medium' && '🟡 Media'}
              {priority === 'high' && '🔴 Alta'}
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
          disabled={!formData.name || !formData.targetAmount}
        >
          {initialData ? 'Actualizar Meta' : 'Crear Meta'}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;