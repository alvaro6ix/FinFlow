import React from 'react';

const BudgetProgress = ({ spent, total, alertThreshold = 80, showLabels = true, size = 'md' }) => {
  const percentage = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
  const overBudget = spent > total;
  const overagePercentage = overBudget ? ((spent - total) / total) * 100 : 0;

  const getColor = () => {
    if (percentage >= 100) return 'red';
    if (percentage >= alertThreshold) return 'yellow';
    return 'green';
  };

  const color = getColor();

  const colorClasses = {
    green: {
      bg: 'bg-green-500',
      light: 'bg-green-100',
      text: 'text-green-700',
      glow: 'shadow-green-500/50',
    },
    yellow: {
      bg: 'bg-yellow-500',
      light: 'bg-yellow-100',
      text: 'text-yellow-700',
      glow: 'shadow-yellow-500/50',
    },
    red: {
      bg: 'bg-red-500',
      light: 'bg-red-100',
      text: 'text-red-700',
      glow: 'shadow-red-500/50',
    },
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  const colors = colorClasses[color];
  const heightClass = sizeClasses[size];

  return (
    <div className="w-full space-y-2">
      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background */}
        <div className={`w-full ${heightClass} ${colors.light} rounded-full overflow-hidden`}>
          {/* Progress Fill */}
          <div
            className={`${heightClass} ${colors.bg} rounded-full transition-all duration-500 ease-out relative ${colors.glow} shadow-lg`}
            style={{
              width: `${Math.min(percentage, 100)}%`,
            }}
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>

          {/* Alert Threshold Marker */}
          {alertThreshold < 100 && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gray-400/50"
              style={{
                left: `${alertThreshold}%`,
              }}
            />
          )}
        </div>

        {/* Overage Indicator (if exceeded) */}
        {overBudget && (
          <div className="absolute -right-1 top-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-red-600 rounded-full animate-ping opacity-75" />
            </div>
          </div>
        )}
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${colors.text}`}>
              {percentage.toFixed(1)}%
            </span>
            {overBudget && (
              <span className="text-red-600 text-xs font-medium">
                (+{overagePercentage.toFixed(1)}% excedido)
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            {alertThreshold < 100 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span>Alerta: {alertThreshold}%</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 ${colors.bg} rounded-full`} />
              <span>Usado</span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            ${spent.toLocaleString('es-MX', { minimumFractionDigits: 2 })} gastado
          </span>
          <span>
            de ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;