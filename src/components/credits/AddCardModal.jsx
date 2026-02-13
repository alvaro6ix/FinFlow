import React, { useState } from 'react';
import { X, Check, CreditCard } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuthStore } from '../../stores/authStore';
import { useCreditStore } from '../../stores/creditStore';

const COLORS = [
  '#1e1b4b', // Midnight (Default)
  '#b91c1c', // Red
  '#0f766e', // Teal
  '#7c3aed', // Violet
  '#c2410c', // Orange
  '#be185d', // Pink
  '#15803d', // Green
  '#000000', // Black
  '#FFD700', // Gold
];

const AddCardModal = ({ onClose }) => {
  const { user } = useAuthStore();
  const { addCard } = useCreditStore();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    limit: '',
    cutOffDay: '',
    paymentDay: '',
    color: '#1e1b4b'
  });

  const handleSubmit = async () => {
    if (!form.name || !form.limit) return;
    setLoading(true);
    await addCard({
        ...form,
        limit: parseFloat(form.limit),
        cutOffDay: parseInt(form.cutOffDay),
        paymentDay: parseInt(form.paymentDay)
    }, user.uid);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-secondary-900 w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-secondary-900 dark:text-white uppercase tracking-tight">Nueva Tarjeta</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-white/5 transition-colors text-secondary-500"><X size={20} /></button>
        </div>

        {/* Preview de la Tarjeta */}
        <div 
            className="w-full h-48 rounded-[2rem] mb-8 p-6 flex flex-col justify-between shadow-2xl transition-colors duration-500 relative overflow-hidden"
            style={{ background: form.color }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex justify-between items-start">
                <span className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Vista Previa</span>
                <CreditCard className="text-white/80" size={28} />
            </div>
            <div className="relative z-10">
                <h3 className="text-white text-2xl font-black tracking-tight truncate mb-1">{form.name || 'Nombre del Banco'}</h3>
                <p className="text-white/90 text-sm font-bold opacity-80 flex items-center gap-2">
                    <span className="text-[10px] uppercase">Límite</span>
                    ${form.limit ? Number(form.limit).toLocaleString() : '0.00'}
                </p>
            </div>
        </div>

        <div className="space-y-5">
            <Input label="Alias de la Tarjeta" placeholder="Ej: BBVA Oro" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            
            <div className="relative group">
                <label className="text-[10px] font-black uppercase text-secondary-400 ml-2 mb-1 block tracking-widest">Límite de Crédito</label>
                <span className="absolute left-4 top-[38px] text-lg font-black text-secondary-400">$</span>
                <input type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#FFD700] text-secondary-900 dark:text-white transition-all" value={form.limit} onChange={e => setForm({...form, limit: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <Input label="Día de Corte" type="number" placeholder="Ej: 14" value={form.cutOffDay} onChange={e => setForm({...form, cutOffDay: e.target.value})} />
                <Input label="Día de Pago" type="number" placeholder="Ej: 4" value={form.paymentDay} onChange={e => setForm({...form, paymentDay: e.target.value})} />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-secondary-400 ml-2 tracking-widest">Color de Tarjeta</label>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-2 custom-scrollbar">
                    {COLORS.map(c => (
                        <button 
                            key={c} 
                            onClick={() => setForm({...form, color: c})}
                            className={`w-10 h-10 rounded-full flex-shrink-0 transition-all shadow-md ${form.color === c ? 'scale-110 ring-4 ring-offset-2 ring-secondary-200 dark:ring-secondary-700' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </div>
        </div>

        <div className="flex gap-3 mt-8">
            <Button variant="secondary" onClick={onClose} className="flex-1 py-4">CANCELAR</Button>
            <Button variant="primary" onClick={handleSubmit} loading={loading} className="flex-[2] py-4 shadow-xl"><Check size={18} className="mr-2"/> GUARDAR</Button>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;