import React from 'react';
import { Tag, Calendar, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ICON_LOOKUP = { ...LucideIcons };

const BudgetDetailTable = ({ expenses, allCategories }) => {
  
  // Función para obtener la etiqueta completa (Categoría > Subcategoría) y el icono
  const getCategoryDetails = (categoryId, subcategoryId) => {
    const parent = allCategories.find(c => c.id === categoryId);
    let subLabel = '';
    
    // Buscar subcategoría
    if (parent && subcategoryId) {
      // 1. Buscar en array interno (Sistema)
      if (parent.subcategories) {
        const sub = parent.subcategories.find(s => s.id === subcategoryId);
        if (sub) subLabel = sub.label;
      }
      // 2. Buscar en categorías planas (Custom)
      if (!subLabel) {
        const sub = allCategories.find(c => c.id === subcategoryId);
        if (sub) subLabel = sub.label;
      }
    }

    // Resolver Icono
    let Icon = Tag;
    if (parent?.icon) {
      if (typeof parent.icon === 'function' || typeof parent.icon === 'object') Icon = parent.icon;
    } else if (parent?.iconName && ICON_LOOKUP[parent.iconName]) {
      Icon = ICON_LOOKUP[parent.iconName];
    }

    return {
      label: parent ? (subLabel ? `${parent.label} › ${subLabel}` : parent.label) : 'Sin categoría',
      color: parent?.color || '#94a3b8',
      Icon
    };
  };

  if (!expenses || expenses.length === 0) return null;

  return (
    <div className="bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 shadow-xl mt-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-secondary-100 dark:bg-white/5 rounded-xl text-secondary-500">
          <FileText size={18} />
        </div>
        <h3 className="text-lg font-black text-secondary-900 dark:text-white uppercase tracking-tight">Detalle de Gastos</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase text-secondary-400 tracking-widest border-b border-secondary-200 dark:border-white/5">
              <th className="pb-4 pl-2">Categoría</th>
              <th className="pb-4">Descripción</th>
              <th className="pb-4">Fecha</th>
              <th className="pb-4 text-right pr-2">Monto</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {expenses.map((expense) => {
              const { label, color, Icon } = getCategoryDetails(expense.categoryId, expense.subcategoryId);
              
              return (
                <tr key={expense.id} className="group hover:bg-white/40 dark:hover:bg-white/5 transition-colors border-b border-secondary-100 dark:border-white/5 last:border-none">
                  
                  {/* Categoría + Icono */}
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl shadow-sm" style={{ backgroundColor: `${color}20`, color: color }}>
                        <Icon size={16} />
                      </div>
                      <span className="font-bold text-secondary-900 dark:text-white text-xs">{label}</span>
                    </div>
                  </td>

                  {/* Descripción */}
                  <td className="py-4 text-secondary-600 dark:text-secondary-300 text-xs max-w-[150px] truncate">
                    {expense.description || <span className="opacity-30 italic">Sin nota</span>}
                  </td>

                  {/* Fecha */}
                  <td className="py-4 text-secondary-500 dark:text-secondary-400 text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="opacity-50" />
                      {new Date(expense.date.seconds ? expense.date.seconds * 1000 : expense.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </div>
                  </td>

                  {/* Monto */}
                  <td className="py-4 pr-2 text-right">
                    <span className="font-black text-secondary-900 dark:text-white block">
                      ${Number(expense.amount).toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetDetailTable;