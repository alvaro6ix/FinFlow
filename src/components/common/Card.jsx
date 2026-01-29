import React from 'react';

const Card = ({ children, title, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-secondary-900 rounded-3xl p-6 shadow-sm border border-secondary-100 dark:border-secondary-800 ${className}`}>
      {title && (
        <h3 className="text-lg font-bold mb-4 text-secondary-900 dark:text-white">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;