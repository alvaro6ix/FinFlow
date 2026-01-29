import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-secondary-900
        rounded-xl shadow-sm
        border border-secondary-200 dark:border-secondary-700
        transition-all duration-200
        ${hover ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className={`border-b border-secondary-200 dark:border-secondary-700 ${paddings[padding]}`}>
          {title && (
            <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className={paddings[padding]}>{children}</div>

      {footer && (
        <div className={`border-t border-secondary-200 dark:border-secondary-700 ${paddings[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;