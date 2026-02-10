import React from 'react';
import { AlertTriangle, Trash2, Info, AlertCircle, Bell, Eye } from 'lucide-react';
import { useBudgetStore } from '../../stores/budgetStore';

const BudgetAlerts = ({ alerts = [] }) => {
  const { deleteAlert, markAlertAsRead } = useBudgetStore();

  // Filtrar solo las no leídas (el botón Ojo las marca como leídas y las quita de aquí)
  const unreadAlerts = alerts.filter(a => !a.read);

  if (!unreadAlerts || unreadAlerts.length === 0) {
    return (
      <div className="p-8 text-center bg-white/40 dark:bg-secondary-900/40 backdrop-blur-xl rounded-[2rem] border border-white/20 border-dashed">
        <Bell size={32} className="mx-auto text-secondary-300 mb-2 opacity-50" />
        <p className="text-xs font-black text-secondary-400 uppercase tracking-widest">Estás al día</p>
        <p className="text-[10px] text-secondary-300 mt-1">No hay alertas nuevas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
      {unreadAlerts.map((alert) => {
        let borderColor = '';
        let iconColor = '';
        let Icon = Info;
        let title = '';

        if (alert.percentage >= 100) {
          borderColor = 'border-red-500/50 bg-red-500/5';
          iconColor = 'text-red-500 bg-red-500/10';
          Icon = AlertTriangle;
          title = 'Límite Excedido';
        } else if (alert.percentage >= 85) {
          borderColor = 'border-orange-500/50 bg-orange-500/5';
          iconColor = 'text-orange-500 bg-orange-500/10';
          Icon = AlertCircle;
          title = 'Consumo Crítico';
        } else {
          borderColor = 'border-yellow-500/50 bg-yellow-500/5';
          iconColor = 'text-yellow-500 bg-yellow-500/10';
          Icon = Info;
          title = 'Aviso de Gasto';
        }

        return (
          <div 
            key={alert.id} 
            className={`relative p-4 rounded-3xl border backdrop-blur-md flex items-start gap-4 transition-all hover:scale-[1.01] ${borderColor}`}
          >
            <div className={`p-2.5 rounded-2xl ${iconColor}`}>
              <Icon size={18} />
            </div>
            
            <div className="flex-1 pr-14"> {/* Padding derecho para dejar sitio a los botones */}
              <h4 className="text-xs font-black uppercase tracking-wider mb-1 text-secondary-900 dark:text-white">
                {title}
              </h4>
              <p className="text-xs font-medium text-secondary-600 dark:text-secondary-300 leading-relaxed">
                <span className="font-black text-secondary-900 dark:text-white">{alert.percentage.toFixed(0)}%</span> en <strong>{alert.categoryName}</strong>.
              </p>
            </div>

            {/* Acciones: Ojo y Basura */}
            <div className="absolute top-3 right-3 flex gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); markAlertAsRead(alert.id); }}
                className="p-1.5 text-secondary-400 hover:text-indigo-500 dark:hover:text-white transition-colors rounded-lg hover:bg-white/10"
                title="Marcar como leída"
              >
                <Eye size={14} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteAlert(alert.id); }}
                className="p-1.5 text-secondary-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-white/10"
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