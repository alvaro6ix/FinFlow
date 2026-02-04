import { X, MapPin, Image as ImageIcon, ExternalLink, Repeat, Tag, Calendar, Clock, CreditCard, Wallet, Landmark, HelpCircle } from "lucide-react";
import Button from "../common/Button";
import { SYSTEM_CATEGORIES, EMOTIONS } from "../../constants/categories";

const PAYMENT_ICONS = {
  efectivo: Wallet,
  tarjeta: CreditCard,
  transferencia: Landmark,
  otro: HelpCircle
};

export default function ExpenseDetails({ expense, onClose }) {
  if (!expense) return null;

  const category = SYSTEM_CATEGORIES.find(c => c.id === expense.categoryId);
  const emotionData = EMOTIONS.find(e => e.id === expense.emotion);
  
  // SOLUCIÓN: Referencias a componentes en Mayúsculas
  const CategoryIcon = category?.icon || Tag;
  const EmotionIcon = emotionData?.icon || HelpCircle;
  const PaymentIcon = PAYMENT_ICONS[expense.paymentMethod] || HelpCircle;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-secondary-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full">
            <CategoryIcon size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {category?.label} {expense.subcategoryName && `> ${expense.subcategoryName}`}
            </span>
          </div>
          <button onClick={onClose} className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full transition-transform active:scale-90"><X size={20}/></button>
        </div>

        {/* MONTO Y DESCRIPCIÓN */}
        <div className="text-center space-y-2">
          <p className="text-5xl font-black text-amber-500 tracking-tighter">
            ${Number(expense.amount).toLocaleString()}
          </p>
          <p className="text-lg font-bold text-secondary-900 dark:text-white leading-tight">
            {expense.description || "Gasto sin nota"}
          </p>
          {expense.isRecurring && (
            <div className="flex justify-center items-center gap-1 text-indigo-500 font-black text-[10px] uppercase bg-indigo-50 dark:bg-indigo-900/20 py-1 px-3 rounded-full w-fit mx-auto">
              <Repeat size={12} className="animate-spin-slow" /> Recurrente ({expense.recurrence})
            </div>
          )}
        </div>

        {/* FECHA Y HORA */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700 flex flex-col items-center">
            <Calendar size={14} className="text-indigo-500 mb-1" />
            <p className="text-[10px] font-black uppercase">{formatDate(expense.date)}</p>
          </div>
          <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700 flex flex-col items-center">
            <Clock size={14} className="text-indigo-500 mb-1" />
            <p className="text-[10px] font-black uppercase">{formatTime(expense.date)}</p>
          </div>
        </div>

        {/* PAGO Y PSICOLOGÍA */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700">
            <p className="text-[8px] font-black text-secondary-400 uppercase mb-1 tracking-widest">Pago</p>
            <div className="flex items-center justify-center gap-1 text-indigo-600">
              <PaymentIcon size={12} />
              <p className="text-xs font-black uppercase">{expense.paymentMethod}</p>
            </div>
          </div>
          <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700">
            <p className="text-[8px] font-black text-secondary-400 uppercase mb-1 tracking-widest">Psicología</p>
            <div className="flex items-center justify-center gap-1 text-indigo-600">
              <EmotionIcon size={12} style={{ color: emotionData?.color }} />
              <p className="text-xs font-black uppercase">{emotionData?.label || expense.emotion} · {expense.purchaseType}</p>
            </div>
          </div>
        </div>

        {/* TAGS */}
        {expense.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center py-1">
            {expense.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-[9px] font-black uppercase border border-indigo-100 dark:border-indigo-800">#{tag}</span>
            ))}
          </div>
        )}

        {/* IMAGEN DEL TICKET */}
        {expense.imageUrl && (
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-secondary-400 ml-2 tracking-widest">Ticket adjunto</p>
            <div className="rounded-[2rem] overflow-hidden border-4 border-secondary-50 dark:border-secondary-800 shadow-lg">
              <img src={expense.imageUrl} alt="Ticket" className="w-full h-48 object-cover hover:scale-105 transition-all cursor-pointer" onClick={() => window.open(expense.imageUrl, '_blank')}/>
            </div>
          </div>
        )}

        {/* UBICACIÓN GPS */}
        {expense.location && (
          <a 
            href={`https://www.google.com/maps?q=${expense.location.lat},${expense.location.lng}`} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl group transition-all hover:bg-emerald-100"
          >
            <div className="flex items-center gap-3">
              <MapPin size={20} />
              <span className="text-xs font-black uppercase tracking-tighter">Ver ubicación en Maps</span>
            </div>
            <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        )}

        <Button variant="primary" fullWidth className="py-5 bg-indigo-600 rounded-2xl shadow-xl font-black uppercase text-white tracking-widest" onClick={onClose}>
          Entendido
        </Button>
      </div>
    </div>
  );
}