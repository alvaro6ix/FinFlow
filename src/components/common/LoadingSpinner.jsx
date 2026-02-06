import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'text-[#FFD700]', // ✅ GOLD
    secondary: 'text-secondary-400',
    white: 'text-white',
    purple: 'text-indigo-600',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        <div className={`
          ${sizes[size]} 
          rounded-full 
          border-4 
          border-secondary-200 dark:border-white/10 
        `}></div>
        
        <div className={`
          absolute top-0 left-0 
          ${sizes[size]} 
          rounded-full 
          border-4 
          border-t-transparent 
          border-r-transparent 
          animate-spin 
          ${colors[color] || colors.primary}
        `}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;