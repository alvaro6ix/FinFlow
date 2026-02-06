import { 
  Trash2, Pencil, MapPin, ImageIcon, Repeat, Tag, Wallet, CreditCard, Landmark, HelpCircle,
  // ✅ IMPORTACIÓN MASIVA
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Music, Camera, Wrench, Pizza, Beer, 
  Truck, TreePine, Gamepad2, GraduationCap, ShoppingCart, Factory, Construction,
  Smartphone, Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase,
  Banknote, Receipt, TrendingUp, PiggyBank, Star, Zap
} from "lucide-react";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { useUIStore } from "../../stores/uiStore";
import { useCategoryStore } from "../../stores/categoryStore"; 

// ✅ MAPA MAESTRO
const ICON_MAP = {
  Utensils, Pizza, Coffee, Beer, Car, Truck, Home, TreePine, Film, Gamepad2, 
  Music, Pill, Heart, Dumbbell, Book, GraduationCap, Shirt, ShoppingBag, ShoppingCart, 
  Plane, Gift, Camera, Wrench, Factory, Construction, Star, Zap, Smartphone, 
  Laptop, Monitor, Baby, Dog, Cat, Umbrella, ShieldCheck, Briefcase, CreditCard, 
  Banknote, Wallet, Landmark, Receipt, TrendingUp, PiggyBank, HelpCircle
};

const PAYMENT_ICONS = { efectivo: Wallet, tarjeta: CreditCard, transferencia: Landmark, otro: HelpCircle };

export default function ExpenseItem({ expense, onDelete, onSelect }) {
  const { openEditExpenseModal } = useUIStore();
  const { customCategories } = useCategoryStore(); 

  let category = SYSTEM_CATEGORIES.find(c => c.id === expense.categoryId);
  let isCustom = false;

  if (!category) {
    category = customCategories.find(c => c.id === expense.categoryId);
    isCustom = true;
  }

  let IconComponent = HelpCircle;
  let categoryColor = '#FFD700';

  if (category) {
    categoryColor = category.color || '#FFD700';
    if (isCustom) {
      IconComponent = ICON_MAP[category.iconName] || HelpCircle;
    } else {
      IconComponent = category.icon;
    }
  }

  const PaymentIcon = PAYMENT_ICONS[expense.paymentMethod] || Wallet;

  return (
    <div 
      onClick={() => onSelect && onSelect(expense)}
      className="group relative overflow-hidden bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm rounded-[1.5rem] p-4 border border-white/40 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: categoryColor }} />

      <div className="flex items-center justify-between pl-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#1e1b4b] shadow-sm shrink-0" style={{ backgroundColor: categoryColor }}>
            <IconComponent size={18} strokeWidth={2.5} />
          </div>
          
          <div className="min-w-0 flex flex-col">
            <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-wider mb-0.5">{category?.label || 'Gasto'}</span>
            <h4 className="font-black text-sm text-secondary-900 dark:text-white truncate leading-tight">{expense.description || category?.label}</h4>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-[9px] font-bold text-secondary-500 uppercase bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded-md">
                <PaymentIcon size={10} /> {expense.paymentMethod}
              </div>
              <div className="flex items-center gap-1">
                {expense.isRecurring && <Repeat size={10} className="text-[#FFD700]" />}
                {expense.location && <MapPin size={10} className="text-emerald-500" />}
                {expense.imageUrl && <ImageIcon size={10} className="text-indigo-500" />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="font-black text-base text-secondary-900 dark:text-white">${Number(expense.amount).toLocaleString()}</p>
            <p className="text-[9px] font-bold text-secondary-400 uppercase">{new Date(expense.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="flex flex-col gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); openEditExpenseModal(expense); }} className="p-1.5 bg-[#FFD700] text-[#1e1b4b] rounded-lg shadow-sm hover:scale-110 transition-transform active:scale-95"><Pencil size={12} strokeWidth={3} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors active:scale-95"><Trash2 size={12} strokeWidth={2.5} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}