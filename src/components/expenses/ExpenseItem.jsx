import { 
  Trash2, Pencil, MapPin, ImageIcon, Repeat, Tag, Wallet, CreditCard, Landmark, HelpCircle,
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Star, Zap, Music, Camera, Wrench 
} from "lucide-react";
import { SYSTEM_CATEGORIES } from "../../constants/categories";
import { useUIStore } from "../../stores/uiStore";
import { useCategoryStore } from "../../stores/categoryStore"; // ✅ Importamos tus categorías

// ✅ Mapeo de iconos para recuperar el componente visual por el nombre guardado en Firebase
const ICON_MAP = {
  Utensils, Car, Home, Film, Pill, Book, Shirt, Coffee, ShoppingBag, 
  Dumbbell, Plane, Gift, Heart, Star, Zap, Music, Camera, Wrench, HelpCircle
};

const PAYMENT_ICONS = { efectivo: Wallet, tarjeta: CreditCard, transferencia: Landmark, otro: HelpCircle };

export default function ExpenseItem({ expense, onDelete, onSelect }) {
  const { openEditExpenseModal } = useUIStore();
  const { customCategories } = useCategoryStore(); // ✅ Obtenemos las categorías de tu DB

  // 1. Buscamos si la categoría es del sistema
  let category = SYSTEM_CATEGORIES.find(c => c.id === expense.categoryId);
  let isCustom = false;

  // 2. Si no es de sistema, la buscamos en tus categorías personalizadas
  if (!category) {
    category = customCategories.find(c => c.id === expense.categoryId);
    isCustom = true;
  }

  // ✅ Lógica de Icono: Si es personalizada usa el ICON_MAP, si es de sistema usa su propiedad .icon
  let CategoryIcon = Tag; 
  if (category) {
    if (isCustom) {
      CategoryIcon = ICON_MAP[category.iconName] || HelpCircle;
    } else {
      CategoryIcon = category.icon;
    }
  }

  const PaymentIcon = PAYMENT_ICONS[expense.paymentMethod] || HelpCircle;

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full flex items-center gap-1 mb-2 pr-1 animate-in fade-in duration-300">
      {/* TARJETA DE GASTO */}
      <div
        onClick={() => onSelect?.(expense)}
        className="flex-1 bg-white dark:bg-secondary-900 rounded-[1.2rem] p-2.5 shadow-sm border border-secondary-100 dark:border-secondary-800 active:scale-[0.98] transition-all min-w-0 overflow-hidden"
      >
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-start gap-2 min-w-0 flex-1">
            {/* ✅ Color dinámico: Usa el de la categoría personalizada o el de sistema */}
            <div 
              className="p-1.5 rounded-xl bg-secondary-50 dark:bg-secondary-800 shrink-0" 
              style={{ color: category?.color || "#6366f1" }}
            >
              <CategoryIcon size={14} />
            </div>
            
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-black text-secondary-900 dark:text-white text-[9px] uppercase truncate leading-tight">
                    {expense.description || category?.label}
                  </p>
                  {expense.subcategoryName && (
                    <p className="text-[7px] text-secondary-500 font-bold truncate">
                      {expense.subcategoryName}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-black text-red-500 tracking-tighter whitespace-nowrap">
                    -${Number(expense.amount).toLocaleString()}
                  </p>
                  <p className="text-[6px] text-secondary-400 font-bold">
                    {formatTime(expense.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                <div className="flex items-center gap-0.5 text-indigo-500 bg-indigo-50/50 px-1 py-0.5 rounded shrink-0">
                  <PaymentIcon size={7} />
                  <span className="text-[6px] font-black uppercase whitespace-nowrap">{expense.paymentMethod}</span>
                </div>
                
                {expense.isRecurring && (
                  <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50/50 px-1 py-0.5 rounded shrink-0">
                    <Repeat size={7} />
                    <span className="text-[6px] font-black uppercase">{expense.recurrence}</span>
                  </div>
                )}
                
                {expense.location && <MapPin size={7} className="text-emerald-500" />}
                {expense.imageUrl && <ImageIcon size={7} className="text-purple-500" />}
              </div>

              {expense.tags && expense.tags.length > 0 && (
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {expense.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-[6px] font-bold text-secondary-400 bg-secondary-50 dark:bg-secondary-800 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="flex flex-col gap-1 shrink-0">
        <button 
          onClick={(e) => { e.stopPropagation(); openEditExpenseModal(expense); }} 
          className="p-1.5 text-indigo-500 bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-100 dark:border-secondary-800 active:scale-90 transition-transform"
        >
          <Pencil size={10} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }} 
          className="p-1.5 text-red-500 bg-white dark:bg-secondary-900 rounded-xl shadow-sm border border-secondary-100 dark:border-secondary-800 active:scale-90 transition-transform"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
}