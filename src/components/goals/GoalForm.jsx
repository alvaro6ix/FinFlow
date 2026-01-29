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

    // REQUERIMIENTO: Asegurar tipos numéricos para cálculos de salud financiera
    const submissionData = {
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount || 0),
      // Si hay fecha, la guardamos como objeto Date para Firebase
      deadline: formData.deadline ? new Date(formData.deadline) : null,
      updatedAt: new Date()
    };

    await onSubmit(submissionData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="¿Cuál es tu objetivo?"
        type="text"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Ej: Viaje a Japón, Fondo de Emergencia..."
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monto Objetivo"
          type="number"
          step="0.01"
          value={formData.targetAmount}
          onChange={(e) => handleChange('targetAmount', e.target.value)}
          placeholder="0.00"
          required
        />
        <Input
          label="Ahorro Inicial"
          type="number"
          step="0.01"
          value={formData.currentAmount}
          onChange={(e) => handleChange('currentAmount', e.target.value)}
          placeholder="0.00"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Fecha Límite (Opcional)"
          type="date"
          value={formData.deadline}
          min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
          onChange={(e) => handleChange('deadline', e.target.value)}
        />
        <Input
          label="URL Imagen Motivacional"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs font-black text-secondary-400 uppercase tracking-widest mb-3">
          Prioridad de la Meta
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'low', label: 'Baja', color: 'bg-blue-500' },
            { id: 'medium', label: 'Media', color: 'bg-amber-500' },
            { id: 'high', label: 'Alta', color: 'bg-red-500' }
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleChange('priority', p.id)}
              className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center active:scale-95 ${
                formData.priority === p.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                  : 'border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-900'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${p.color} mb-1 shadow-sm`}></div>
              <div className="text-[10px] font-black uppercase text-secondary-600 dark:text-secondary-400">{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth
          disabled={!formData.name || !formData.targetAmount}
        >
          {initialData ? 'Actualizar Meta' : 'Empezar a Ahorrar'}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;