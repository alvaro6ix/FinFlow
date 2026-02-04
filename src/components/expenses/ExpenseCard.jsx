import { Trash2, Image, MapPin } from "lucide-react";
import { SYSTEM_CATEGORIES } from "../../constants/categories";

export default function ExpenseCard({ expense, onDelete, onOpen }) {
  const category = SYSTEM_CATEGORIES.find(c => c.id === expense.categoryId);

  return (
    <div className="bg-white dark:bg-secondary-900 rounded-2xl p-4 shadow-md hover:shadow-xl transition flex justify-between gap-4">
      {/* INFO */}
      <div className="flex-1">
        <p className="font-black text-sm">
          {expense.description || category?.label || "Gasto"}
        </p>

        <div className="flex items-center gap-2 text-xs text-secondary-500 mt-1">
          <span>{category?.icon}</span>
          <span>{category?.label}</span>
          <span>•</span>
          <span className="uppercase">{expense.purchaseType}</span>
          <span>{expense.emotion && `• ${expense.emotion}`}</span>
        </div>

        <p className="text-[10px] text-secondary-400 mt-1">
          {new Date(expense.date).toLocaleDateString("es-MX")}
        </p>

        {/* EXTRAS */}
        <div className="flex gap-2 mt-2">
          {expense.imageUrl && <Image size={14} />}
          {expense.location && <MapPin size={14} />}
        </div>
      </div>

      {/* AMOUNT */}
      <div className="text-right">
        <p className="text-lg font-black text-red-500">
          ${expense.amount.toLocaleString()}
        </p>

        <button
          onClick={() => onDelete(expense.id)}
          className="text-[10px] text-red-400 hover:text-red-600 flex items-center gap-1 justify-end mt-1"
        >
          <Trash2 size={12} /> Eliminar
        </button>
      </div>
    </div>
  );
}
