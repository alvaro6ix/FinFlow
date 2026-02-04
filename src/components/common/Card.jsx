import React from 'react';

const Card = ({ children, title, className = "" }) => {
  return (
    <div
      className={`
        bg-secondary-50 dark:bg-secondary-900
        rounded-3xl
        p-6
        shadow-sm
        border border-secondary-200 dark:border-secondary-800
        ${className}
      `}
    >
      {title && (
        <h3 className="text-sm font-black mb-4 text-secondary-700 dark:text-secondary-200 uppercase tracking-widest">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
