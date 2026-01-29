import React from 'react';

const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const types = {
    success: {
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      text: 'text-success-800 dark:text-success-200',
      icon: '✅',
    },
    error: {
      bg: 'bg-danger-50 dark:bg-danger-900/20',
      border: 'border-danger-200 dark:border-danger-800',
      text: 'text-danger-800 dark:text-danger-200',
      icon: '❌',
    },
    warning: {
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800',
      text: 'text-warning-800 dark:text-warning-200',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-info-50 dark:bg-info-900/20',
      border: 'border-info-200 dark:border-info-800',
      text: 'text-info-800 dark:text-info-200',
      icon: 'ℹ️',
    },
  };

  const alertStyle = types[type];

  return (
    <div
      className={`
        ${alertStyle.bg} ${alertStyle.border} ${alertStyle.text}
        border rounded-lg p-4 animate-slide-down
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{alertStyle.icon}</span>
        <div className="flex-1">
          {title && <h4 className="font-bold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;