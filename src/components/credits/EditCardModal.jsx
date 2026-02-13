import React, { useState } from 'react';
import { X, Check, CreditCard, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useCreditStore } from '../../stores/creditStore';

const COLORS = [
  '#1e1b4b', '#b91c1c', '#0f766e', '#7c3aed', '#c2410c', '#be185d', '#15803d', '#000000', '#FFD700',
];

const EditCardModal = ({ card, onClose }) => {
  const { updateCard, deleteCard } = useCreditStore();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [form, setForm] = useState({
    name: card.name,
    limit: card.limit,
    cutOffDay: card.cutOffDay,
    paymentDay: card.paymentDay,
    color: card.color
  });

  const handleSubmit = async () => {
    if (!form.name || !form.limit) return;
    setLoading(true);
    await updateCard(card.id, {
        ...form,
        limit: parseFloat(form.limit),
        cutOffDay: parseInt(form.cutOffDay),
        paymentDay: parseInt(form.paymentDay)
    });
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteCard(card.id);
    setLoading(false);
    onClose();
  };

  if (showDeleteConfirm) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-secondary-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-red-500/20 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-black text-secondary-900 dark:text-white mb-2">¿Eliminar Tarjeta?</h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">
                    Esta acción no se puede deshacer. Se perderá el historial de esta tarjeta.
                </p>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="flex-1">CANCELAR</Button>
                    <button 
                        onClick={handleDelete}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? '...' : <><Trash2 size={18} /> ELIMINAR</>}
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-secondary-900 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">Editar Tarjeta</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-white/5 transition-colors text-secondary-500"><X size={20} /></button>
        </div>

        {/* Preview en tiempo real */}
        <div 
            className="w-full h-32 rounded-[2rem] mb-6 p-5 flex flex-col justify-between shadow-xl transition-colors duration-500 relative overflow-hidden"
            style={{ background: form.color }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
                <span className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Vista Previa</span>
                <CreditCard className="text-white/80" size={20} />
            </div>
            <div className="relative z-10">
                <h3 className="text-white text-xl font-black tracking-tight truncate">{form.name}</h3>
                <p className="text-white/90 text-xs font-bold opacity-80">${Number(form.limit).toLocaleString()}</p>
            </div>
        </div>

        <div className="space-y-4">
            <Input label="Alias" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            
            <div className="relative group">
                <label className="text-[10px] font-black uppercase text-secondary-400 ml-2 mb-1 block tracking-widest">Límite</label>
                <span className="absolute left-4 top-[38px] text-lg font-black text-secondary-400">$</span>
                <input type="number" className="w-full pl-8 pr-4 py-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#FFD700] text-secondary-900 dark:text-white transition-all" value={form.limit} onChange={e => setForm({...form, limit: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <Input label="Día Corte" type="number" value={form.cutOffDay} onChange={e => setForm({...form, cutOffDay: e.target.value})} />
                <Input label="Día Pago" type="number" value={form.paymentDay} onChange={e => setForm({...form, paymentDay: e.target.value})} />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-secondary-400 ml-2 tracking-widest">Color</label>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-2 custom-scrollbar">
                    {COLORS.map(c => (
                        <button 
                            key={c} 
                            onClick={() => setForm({...form, color: c})}
                            className={`w-8 h-8 rounded-full flex-shrink-0 transition-all shadow-md ${form.color === c ? 'scale-110 ring-4 ring-offset-2 ring-secondary-200 dark:ring-secondary-700' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-secondary-100 dark:border-white/5">
            <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="p-4 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-2xl transition-colors"
                title="Eliminar Tarjeta"
            >
                <Trash2 size={20} />
            </button>
            <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-1 py-4 shadow-xl"><Check size={18} className="mr-2"/> GUARDAR CAMBIOS</Button>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;