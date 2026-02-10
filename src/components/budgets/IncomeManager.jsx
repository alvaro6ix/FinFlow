import React, { useState, useMemo } from 'react';
import { useBudgetStore } from '../../stores/budgetStore';
import { useAuthStore } from '../../stores/authStore';
import { 
  Plus, Trash2, BrainCircuit, Sparkles, Briefcase, TrendingUp, X, Edit2, 
  History, BarChart2, Calendar, ArrowRight 
} from 'lucide-react';

const IncomeManager = () => {
  const { user } = useAuthStore();
  const { incomeSources, addIncome, updateIncome, deleteIncome } = useBudgetStore();
  
  const [viewMode, setViewMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [monthA, setMonthA] = useState('');
  const [monthB, setMonthB] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', amount: '', type: 'fixed', frequency: 'monthly', date: new Date().toISOString().split('T')[0]
  });

  const historyData = useMemo(() => {
    const filtered = incomeSources.filter(inc => {
      if (!inc.date) return false;
      const d = new Date(inc.date.seconds ? inc.date.seconds * 1000 : inc.date);
      return d.toISOString().slice(0, 7) === selectedMonth;
    });
    const fixedTotal = filtered.filter(i => i.type === 'fixed').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const variableTotal = filtered.filter(i => i.type === 'variable').reduce((acc, curr) => acc + Number(curr.amount), 0);
    return { items: filtered, fixedTotal, variableTotal, total: fixedTotal + variableTotal };
  }, [incomeSources, selectedMonth]);

  const compareData = useMemo(() => {
    if (!monthA || !monthB) return null;
    const getMonthTotal = (m) => incomeSources
      .filter(inc => {
        if (!inc.date) return false;
        const d = new Date(inc.date.seconds ? inc.date.seconds * 1000 : inc.date);
        return d.toISOString().slice(0, 7) === m;
      })
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalA = getMonthTotal(monthA);
    const totalB = getMonthTotal(monthB);
    const diff = totalB - totalA;
    const percent = totalA > 0 ? ((diff / totalA) * 100) : 0;
    return { totalA, totalB, diff, percent };
  }, [incomeSources, monthA, monthB]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;
    const payload = { ...formData, amount: parseFloat(formData.amount) };
    if (editingId) await updateIncome(editingId, payload);
    else await addIncome({ userId: user.uid, ...payload });
    setFormData({ name: '', amount: '', type: 'fixed', frequency: 'monthly', date: new Date().toISOString().split('T')[0] });
    setEditingId(null);
  };

  const handleEdit = (inc) => {
    const d = new Date(inc.date.seconds ? inc.date.seconds * 1000 : inc.date);
    setFormData({
      name: inc.name,
      amount: inc.amount,
      type: inc.type,
      frequency: inc.frequency || 'monthly',
      date: d.toISOString().split('T')[0]
    });
    setEditingId(inc.id);
    setViewMode('add');
  };

  const containerClass = "relative overflow-hidden bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-xl group mb-8 transition-all hover:shadow-2xl";
  // ✅ Input corregido: text-color explícito y color-scheme dark
  const inputClass = "w-full bg-white/50 dark:bg-black/20 border border-secondary-200 dark:border-white/10 rounded-xl p-3 text-secondary-900 dark:text-white placeholder-secondary-400 text-xs font-bold outline-none focus:ring-2 focus:ring-[#FFD700] transition-all dark:[color-scheme:dark]";
  const selectClass = "w-full bg-white/50 dark:bg-black/20 border border-secondary-200 dark:border-white/10 rounded-xl p-3 text-secondary-900 dark:text-white text-xs font-bold outline-none appearance-none cursor-pointer";
  const activeTabClass = "bg-[#FFD700] text-[#1e1b4b] shadow-lg shadow-[#FFD700]/20 font-black";
  const inactiveTabClass = "bg-white/50 dark:bg-white/5 text-secondary-500 dark:text-secondary-400 hover:bg-white/80 dark:hover:bg-white/10";

  return (
    <div className={containerClass}>
      
      <div className="relative z-10 p-6 sm:p-8">
        
        {/* HEADER & TABS (Responsive: flex-wrap) */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2 self-start lg:self-center">
            <div className="p-2.5 rounded-xl bg-[#FFD700] shadow-sm"><Sparkles size={18} className="text-[#1e1b4b]" /></div>
            <span className="text-lg font-black uppercase tracking-widest text-secondary-900 dark:text-white">Ingresos</span>
          </div>
          
          {/* Pestañas: scroll horizontal en móvil si es muy pequeño, o wrap */}
          <div className="flex flex-wrap justify-center gap-1 p-1 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-md border border-white/10 w-full lg:w-auto">
            <button onClick={() => setViewMode('add')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${viewMode === 'add' ? activeTabClass : inactiveTabClass}`}>
              <Plus size={14} /> <span className="hidden sm:inline">Registrar</span>
            </button>
            <button onClick={() => setViewMode('history')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${viewMode === 'history' ? activeTabClass : inactiveTabClass}`}>
              <History size={14} /> Historial
            </button>
            <button onClick={() => setViewMode('compare')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${viewMode === 'compare' ? activeTabClass : inactiveTabClass}`}>
              <BarChart2 size={14} /> Comparar
            </button>
          </div>
        </div>

        {/* --- VISTA 1: REGISTRO --- */}
        {viewMode === 'add' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              <input type="text" placeholder="Concepto" className={inputClass} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="number" placeholder="Monto" className={inputClass} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              <input type="date" className={inputClass} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <select className={selectClass} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="fixed" className="text-black">Fijo (Sueldo)</option>
                <option value="variable" className="text-black">Variable (Extra)</option>
              </select>
              {formData.type === 'fixed' && (
                <select className={selectClass} value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                  <option value="monthly" className="text-black">Mensual</option>
                  <option value="biweekly" className="text-black">Quincenal</option>
                  <option value="weekly" className="text-black">Semanal</option>
                </select>
              )}
            </form>
            <button onClick={handleSave} className="w-full py-4 bg-[#FFD700] hover:bg-[#e6c200] text-[#1e1b4b] rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-[1.01] active:scale-95">
              {editingId ? 'Actualizar Ingreso' : 'Guardar Ingreso'}
            </button>
          </div>
        )}

        {/* --- VISTA 2: HISTORIAL (Responsive) --- */}
        {viewMode === 'history' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
            <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 p-2 rounded-xl w-full sm:w-fit border border-secondary-100 dark:border-white/10">
              <Calendar size={16} className="text-[#FFD700]" />
              <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="bg-transparent text-secondary-900 dark:text-white font-bold outline-none text-sm w-full dark:[color-scheme:dark]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Fijo</p>
                <p className="text-lg font-black text-secondary-900 dark:text-white">${historyData.fixedTotal.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase">Variable</p>
                <p className="text-lg font-black text-secondary-900 dark:text-white">${historyData.variableTotal.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20">
                <p className="text-[10px] text-[#b45309] dark:text-[#FFD700] font-bold uppercase">Total</p>
                <p className="text-lg font-black text-secondary-900 dark:text-white">${historyData.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {historyData.items.map(inc => (
                <div key={inc.id} className="flex justify-between items-center p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-secondary-100 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${inc.type === 'fixed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>
                      {inc.type === 'fixed' ? <Briefcase size={14} /> : <TrendingUp size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-secondary-900 dark:text-white">{inc.name}</p>
                      <p className="text-[9px] text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
                        {new Date(inc.date.seconds ? inc.date.seconds * 1000 : inc.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-secondary-900 dark:text-[#FFD700]">${Number(inc.amount).toLocaleString()}</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(inc)} className="p-1.5 text-secondary-400 hover:text-indigo-500 rounded-lg hover:bg-white/20"><Edit2 size={14} /></button>
                      <button onClick={() => deleteIncome(inc.id)} className="p-1.5 text-secondary-400 hover:text-red-500 rounded-lg hover:bg-white/20"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VISTA 3: COMPARAR (Responsive Inputs) --- */}
        {viewMode === 'compare' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <input type="month" value={monthA} onChange={e => setMonthA(e.target.value)} className={`${inputClass} dark:[color-scheme:dark]`} />
              <ArrowRight className="text-secondary-400 dark:text-[#FFD700] rotate-90 sm:rotate-0" />
              <input type="month" value={monthB} onChange={e => setMonthB(e.target.value)} className={`${inputClass} dark:[color-scheme:dark]`} />
            </div>

            {compareData && (
              <div className="bg-white/50 dark:bg-white/5 rounded-[2rem] p-6 border border-secondary-100 dark:border-white/10 text-center">
                <p className="text-xs font-bold text-secondary-500 dark:text-gray-400 uppercase mb-4">Diferencia</p>
                <div className="flex justify-center items-end gap-2 mb-2">
                  <span className={`text-4xl font-black ${compareData.diff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {compareData.diff >= 0 ? '+' : ''}${compareData.diff.toLocaleString()}
                  </span>
                  <span className={`text-sm font-bold mb-2 ${compareData.diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    ({compareData.percent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default IncomeManager;