import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200',
    success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-200',
    danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-200',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-200',
    info: 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;