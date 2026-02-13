import React, { useMemo } from 'react';
import { AlertTriangle, Zap, Calendar, TrendingUp, Info } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

const SmartAlerts = ({ cards, installments }) => {
  const alerts = useMemo(() => {
    const list = [];
    const today = new Date();

    // 1. ANÁLISIS DE UTILIZACIÓN (Riesgo)
    cards.forEach(card => {
      const usage = (card.currentBalance / card.limit) * 100;
      if (usage > 80) {
        list.push({
          type: 'danger',
          icon: AlertTriangle,
          title: `¡Cuidado con ${card.name}!`,
          message: `Estás al ${usage.toFixed(0)}% de tu límite. Si haces otra compra grande podrías sobregirarte (-$${(card.limit * 0.05).toLocaleString()}).`,
          action: 'Abonar ahora'
        });
      }
    });

    // 2. OPORTUNIDADES DE LIQUIDACIÓN (Snowball)
    // Buscamos deudas pequeñas que puedas matar ya
    const smallDebts = installments.filter(i => {
        const remaining = i.totalAmount - (i.paidAmount || 0);
        return remaining > 0 && remaining < 2000; // Umbral de $2,000
    });

    if (smallDebts.length > 0) {
        const target = smallDebts[0];
        const remaining = target.totalAmount - (target.paidAmount || 0);
        list.push({
            type: 'opportunity',
            icon: Zap,
            title: 'Victoria Rápida Detectada',
            message: `Solo te faltan $${remaining.toLocaleString()} para terminar "${target.description}". Si la liquidas hoy, liberas $${target.monthlyPayment.toLocaleString()}/mes de flujo.`,
            action: 'Simular Liquidación'
        });
    }

    // 3. FINALIZACIÓN CERCANA (Motivación)
    installments.forEach(item => {
        const left = item.months - item.installmentsPaid;
        if (left > 0 && left <= 2) {
            list.push({
                type: 'success',
                icon: TrendingUp,
                title: `¡Ya casi eres libre de "${item.description}"!`,
                message: `Solo faltan ${left} pagos. Serás libre de esta deuda en 2 meses.`,
                action: null
            });
        }
    });

    return list;
  }, [cards, installments]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 animate-in slide-in-from-top-4">
      <h3 className="text-xs font-black uppercase text-secondary-400 tracking-widest px-2 flex items-center gap-2">
        <Info size={14} /> Alertas Inteligentes
      </h3>
      
      <div className="grid gap-3">
        {alerts.map((alert, idx) => (
          <div 
            key={idx}
            className={`
              relative p-4 rounded-2xl border backdrop-blur-md overflow-hidden transition-all hover:scale-[1.01]
              ${alert.type === 'danger' ? 'bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-500/30' : ''}
              ${alert.type === 'opportunity' ? 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/30' : ''}
              ${alert.type === 'success' ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30' : ''}
            `}
          >
            <div className="flex gap-4">
                <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0
                    ${alert.type === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : ''}
                    ${alert.type === 'opportunity' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' : ''}
                    ${alert.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : ''}
                `}>
                    <alert.icon size={20} />
                </div>
                <div>
                    <h4 className={`text-sm font-black mb-1 ${
                        alert.type === 'danger' ? 'text-red-700 dark:text-red-300' : 
                        alert.type === 'opportunity' ? 'text-amber-700 dark:text-amber-300' : 
                        'text-emerald-700 dark:text-emerald-300'
                    }`}>
                        {alert.title}
                    </h4>
                    <p className="text-xs font-medium text-secondary-600 dark:text-secondary-300 leading-relaxed">
                        {alert.message}
                    </p>
                    {alert.action && (
                        <button className="mt-2 text-[10px] font-black uppercase underline decoration-2 underline-offset-2 opacity-80 hover:opacity-100">
                            {alert.action}
                        </button>
                    )}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartAlerts;