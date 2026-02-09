import React, { useState } from 'react';
import { useBudgetStore } from '../../stores/budgetStore';
import { useAuthStore } from '../../stores/authStore';
import { 
  Plus, Trash2, BrainCircuit, Sparkles, Briefcase, TrendingUp, 
  Edit2, DollarSign, X 
} from 'lucide-react';

const IncomeManager = () => {
  const { user } = useAuthStore();
  const { 
    incomeSources, 
    addIncome, 
    updateIncome, 
    deleteIncome, 
    calculateTotalIncome 
  } = useBudgetStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'fixed',
    frequency: 'monthly'
  });

  const totalIncome = calculateTotalIncome();

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      type: 'fixed',
      frequency: 'monthly'
    });
    setEditingIncome(null);
    setShowForm(false);
  };

  const handleEdit = (income) => {
    setFormData({
      name: income.name,
      amount: income.amount.toString(),
      type: income.type,
      frequency: income.frequency || 'monthly'
    });
    setEditingIncome(income);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;
    
    const incomeData = {
      userId: user.uid,
      name: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      frequency: formData.frequency
    };

    if (editingIncome) {
      await updateIncome(editingIncome.id, incomeData);
    } else {
      await addIncome(incomeData);
    }
    
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este ingreso?')) {
      await deleteIncome(id);
    }
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      weekly: 'Semanal',
      biweekly: 'Quincenal',
      monthly: 'Mensual',
      yearly: 'Anual'
    };
    return labels[frequency] || 'Mensual';
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl group mb-8 transition-all">
      {/* Fondo amarillo */}
      <div className="absolute inset-0 bg-[#FFD700] opacity-95 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
      
      <div className="relative z-10 p-8">
        <BrainCircuit 
          className="absolute -right-6 -top-6 text-[#1e1b4b] opacity-10 rotate-12" 
          size={180} 
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#1e1b4b]/10 backdrop-blur-sm">
              <Sparkles size={16} className="text-[#1e1b4b]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1e1b4b]/70">
              Gestor de Ingresos
            </span>
          </div>
          <button 
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="bg-[#1e1b4b] text-[#FFD700] p-2 rounded-lg hover:scale-110 transition-transform shadow-lg z-20"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>

        {/* Total Display */}
        <div className="mb-6">
          <p className="text-xs font-bold text-[#1e1b4b]/60 uppercase tracking-widest mb-1">
            Ingreso Mensual Total
          </p>
          <h3 className="text-4xl sm:text-5xl font-black text-[#1e1b4b] tracking-tighter">
            ${totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </h3>
        </div>

        {/* Formulario */}
        {showForm && (
          <form 
            onSubmit={handleSubmit} 
            className="bg-[#1e1b4b]/10 backdrop-blur-md p-4 rounded-2xl mb-4 border border-[#1e1b4b]/10 animate-in slide-in-from-top-2"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="relative">
                  <DollarSign 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1e1b4b]/50" 
                    size={16} 
                  />
                  <input 
                    type="text" 
                    placeholder="Nombre (ej: Sueldo, Venta)" 
                    className="w-full pl-10 bg-white/50 border-none rounded-xl p-3 text-[#1e1b4b] placeholder-[#1e1b4b]/50 text-xs font-bold focus:bg-white outline-none focus:ring-2 focus:ring-[#1e1b4b]/20"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    autoFocus
                    required
                  />
                </div>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Monto" 
                  className="bg-white/50 border-none rounded-xl p-3 text-[#1e1b4b] placeholder-[#1e1b4b]/50 text-xs font-bold focus:bg-white outline-none focus:ring-2 focus:ring-[#1e1b4b]/20"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] font-black uppercase text-[#1e1b4b]/60 ml-1 mb-1 block">
                    Tipo
                  </label>
                  <select 
                    className="w-full bg-white/50 border-none rounded-xl p-3 text-[#1e1b4b] text-xs font-bold focus:bg-white outline-none appearance-none focus:ring-2 focus:ring-[#1e1b4b]/20"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="fixed">Fijo (Sueldo)</option>
                    <option value="variable">Variable (Extra)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] font-black uppercase text-[#1e1b4b]/60 ml-1 mb-1 block">
                    Frecuencia
                  </label>
                  <select 
                    className="w-full bg-white/50 border-none rounded-xl p-3 text-[#1e1b4b] text-xs font-bold focus:bg-white outline-none appearance-none focus:ring-2 focus:ring-[#1e1b4b]/20"
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quincenal</option>
                    <option value="monthly">Mensual</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1e1b4b] text-white hover:bg-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg mt-3 transition-colors"
            >
              {editingIncome ? 'Actualizar Ingreso' : 'Guardar Ingreso'}
            </button>
          </form>
        )}

        {/* Lista */}
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
          {incomeSources.length === 0 && !showForm && (
            <div className="text-center py-8 opacity-60">
              <p className="text-xs font-bold text-[#1e1b4b]">
                No hay ingresos registrados
              </p>
              <p className="text-[10px] text-[#1e1b4b]/70 mt-1">
                Agrega tu primer ingreso para comenzar
              </p>
            </div>
          )}

          {incomeSources.map((inc) => (
            <div 
              key={inc.id} 
              className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/20 group hover:bg-white/60 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-1.5 rounded-lg ${
                  inc.type === 'fixed' 
                    ? 'bg-emerald-500/20 text-emerald-700' 
                    : 'bg-orange-500/20 text-orange-700'
                }`}>
                  {inc.type === 'fixed' ? <Briefcase size={14} /> : <TrendingUp size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-[#1e1b4b] truncate">
                    {inc.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[8px] font-bold opacity-60 uppercase tracking-wider">
                      {inc.type === 'fixed' ? 'Fijo' : 'Variable'}
                    </span>
                    <span className="text-[8px] font-bold opacity-40">•</span>
                    <span className="text-[8px] font-bold opacity-60 uppercase tracking-wider">
                      {getFrequencyLabel(inc.frequency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-[#1e1b4b] text-sm whitespace-nowrap">
                  ${Number(inc.amount).toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(inc)}
                    className="p-1.5 text-blue-600/70 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(inc.id)}
                    className="p-1.5 text-red-600/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        {incomeSources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#1e1b4b]/10">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#1e1b4b]/60">
              <span className="uppercase tracking-wider">
                Total de {incomeSources.length} fuente{incomeSources.length !== 1 ? 's' : ''}
              </span>
              <span className="uppercase tracking-wider">
                {incomeSources.filter(i => i.type === 'fixed').length} fijo{incomeSources.filter(i => i.type === 'fixed').length !== 1 ? 's' : ''} • {incomeSources.filter(i => i.type === 'variable').length} variable{incomeSources.filter(i => i.type === 'variable').length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeManager;