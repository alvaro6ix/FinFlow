import React, { useState } from 'react';
import {
  AlertTriangle,
  XCircle,
  CheckCircle,
  X,
  Bell,
  BellOff,
  Trash2,
  Eye,
} from 'lucide-react';
import { useBudgetStore } from '../../stores/budgetStore';

const BudgetAlerts = ({ showInDashboard = false }) => {
  const { alerts, markAlertAsRead, deleteAlert, clearAllAlerts, getUnreadAlerts } =
    useBudgetStore();

  const [filter, setFilter] = useState('all');

  const unreadAlerts = getUnreadAlerts();

  const getFilteredAlerts = () => {
    let filtered = [...alerts];

    switch (filter) {
      case 'unread':
        filtered = filtered.filter((alert) => !alert.read);
        break;
      case 'threshold':
        filtered = filtered.filter((alert) => alert.type === 'threshold');
        break;
      case 'exceeded':
        filtered = filtered.filter((alert) => alert.type === 'exceeded');
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const displayedAlerts = getFilteredAlerts();

  const getAlertIcon = (type, severity) => {
    if (type === 'exceeded' || severity === 'error') {
      return <XCircle className="text-red-600" size={24} />;
    }
    if (type === 'threshold' || severity === 'warning') {
      return <AlertTriangle className="text-yellow-600" size={24} />;
    }
    return <CheckCircle className="text-green-600" size={24} />;
  };

  const getAlertColors = (type, severity) => {
    if (type === 'exceeded' || severity === 'error') {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700',
      };
    }
    if (type === 'threshold' || severity === 'warning') {
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        badge: 'bg-yellow-100 text-yellow-700',
      };
    }
    return {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-700',
    };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }
    if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  };

  // Dashboard Banner
  if (showInDashboard) {
    const exceededBudgets = alerts.filter(
      (alert) => alert.type === 'exceeded' && !alert.read
    );

    if (exceededBudgets.length === 0) return null;

    return (
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">¡Atención! Presupuestos Excedidos</h3>
              <p className="text-white/90 mb-3">
                Tienes {exceededBudgets.length}{' '}
                {exceededBudgets.length === 1 ? 'categoría' : 'categorías'} que han excedido su
                presupuesto
              </p>
              <div className="space-y-2">
                {exceededBudgets.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white/10 rounded-lg px-3 py-2 text-sm backdrop-blur-sm"
                  >
                    <p className="font-medium">{alert.message}</p>
                  </div>
                ))}
              </div>
              {exceededBudgets.length > 3 && (
                <p className="text-sm text-white/80 mt-2">
                  + {exceededBudgets.length - 3} más...
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => exceededBudgets.forEach((alert) => markAlertAsRead(alert.id))}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Full Alert Center
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell size={28} className="text-blue-600" />
              {unreadAlerts.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadAlerts.length}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Centro de Alertas</h2>
              <p className="text-sm text-gray-600">
                {unreadAlerts.length} alertas sin leer
              </p>
            </div>
          </div>

          {alerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <Trash2 size={18} />
              Limpiar todo
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Todas', icon: Bell },
            { value: 'unread', label: 'Sin leer', icon: Eye },
            { value: 'threshold', label: 'Umbral', icon: AlertTriangle },
            { value: 'exceeded', label: 'Excedidos', icon: XCircle },
          ].map((item) => {
            const Icon = item.icon;
            const count =
              item.value === 'all'
                ? alerts.length
                : item.value === 'unread'
                ? unreadAlerts.length
                : alerts.filter((a) => a.type === item.value).length;

            return (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === item.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                {item.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === item.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts List */}
      {displayedAlerts.length > 0 ? (
        <div className="space-y-3">
          {displayedAlerts.map((alert) => {
            const colors = getAlertColors(alert.type, alert.severity);
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl shadow-lg border-l-4 ${colors.border} p-5 transition-all hover:shadow-xl ${
                  !alert.read ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`${colors.bg} p-3 rounded-xl`}>
                    {getAlertIcon(alert.type, alert.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{alert.message}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatTimestamp(alert.timestamp)}
                        </p>
                      </div>
                      {!alert.read && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          Nuevo
                        </span>
                      )}
                    </div>

                    {/* Percentage Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${colors.badge} text-sm font-semibold`}>
                      <span>Progreso:</span>
                      <span>{alert.percentage}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!alert.read && (
                      <button
                        onClick={() => markAlertAsRead(alert.id)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Marcar como leída"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Eliminar"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellOff size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay alertas</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'No tienes ninguna alerta en este momento'
              : `No hay alertas de tipo "${filter}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetAlerts;