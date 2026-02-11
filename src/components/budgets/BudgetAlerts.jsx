import React from 'react';
import { AlertTriangle, Trash2, Info, AlertCircle, Bell, Eye, Check } from 'lucide-react';
import { useBudgetStore } from '../../stores/budgetStore';

const BudgetAlerts = ({ alerts = [] }) => {
  const { deleteAlert, markAlertAsRead } = useBudgetStore();

  // Filtrar solo las no leídas (read: false)
  // Al marcar como leída, Firebase actualiza read=true y esta lista se reduce automáticamente.
  const visibleAlerts = alerts.filter(a => !a.read);

  if (!visibleAlerts || visibleAlerts.length === 0) {
    return (
      <div className="p-8 text-center bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl rounded-[2rem] border border-white/20 border-dashed">
        <div className="bg-emerald-500/10 p-3 rounded-full w-fit mx-auto mb-2">
            <Check size={24} className="text-emerald-500" />
        </div>
        <p className="text-xs font-black text-secondary-400 uppercase tracking-widest">Estás al día</p>
        <p className="text-[10px] text-secondary-300 mt-1">No hay alertas nuevas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
      {visibleAlerts.map((alert) => {
        let borderColor = '';
        let iconColor = '';
        let bgColor = '';
        let Icon = Info;
        let title = '';

        if (alert.type === 'exceeded' || alert.severity === 'error') {
          borderColor = 'border-red-200 dark:border-red-900/30';
          iconColor = 'text-red-500';
          bgColor = 'bg-red-50 dark:bg-red-900/10';
          Icon = AlertCircle;
          title = 'Límite Excedido';
        } else if (alert.type === 'warning') {
          borderColor = 'border-amber-200 dark:border-amber-900/30';
          iconColor = 'text-amber-500';
          bgColor = 'bg-amber-50 dark:bg-amber-900/10';
          Icon = AlertTriangle;
          title = 'Alerta de Consumo';
        }

        return (
          <div 
            key={alert.id} 
            className={`relative flex items-start gap-3 p-4 rounded-2xl border ${borderColor} ${bgColor} transition-all hover:scale-[1.01]`}
          >
            {/* Icono */}
            <div className={`shrink-0 p-2 rounded-xl bg-white dark:bg-secondary-800 shadow-sm ${iconColor}`}>
              <Icon size={18} />
            </div>

            {/* Contenido */}
            <div className="flex-1 pr-12"> 
              <h4 className="text-xs font-black uppercase tracking-wider mb-1 text-secondary-900 dark:text-white">
                {title}
              </h4>
              <p className="text-xs font-medium text-secondary-600 dark:text-secondary-300 leading-relaxed">
                {alert.message || (
                    <>
                        <span className="font-black text-secondary-900 dark:text-white">
                            {alert.percentage ? alert.percentage.toFixed(0) : 0}%
                        </span> en <strong>{alert.categoryLabel}</strong>.
                    </>
                )}
              </p>
              <p className="text-[9px] text-secondary-400 mt-2 font-bold uppercase">
                 {alert.timestamp?.seconds 
                    ? new Date(alert.timestamp.seconds * 1000).toLocaleDateString() 
                    : 'Hoy'}
              </p>
            </div>

            {/* Acciones */}
            <div className="absolute top-3 right-3 flex flex-col gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); markAlertAsRead(alert.id); }}
                className="p-1.5 text-secondary-400 hover:text-indigo-500 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors"
                title="Marcar como leída (Ocultar)"
              >
                <Eye size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteAlert(alert.id); }}
                className="p-1.5 text-secondary-400 hover:text-red-500 hover:bg-white/50 dark:hover:bg-black/20 rounded-lg transition-colors"
                title="Eliminar permanentemente"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetAlerts;