import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-secondary-100/50 text-secondary-600 border-secondary-200',
    primary: 'bg-indigo-100/50 text-indigo-700 border-indigo-200',
    success: 'bg-emerald-100/50 text-emerald-700 border-emerald-200',
    danger: 'bg-red-100/50 text-red-700 border-red-200',
    warning: 'bg-amber-100/50 text-amber-700 border-amber-200', // Dorado suave
    info: 'bg-cyan-100/50 text-cyan-700 border-cyan-200',
    gold: 'bg-[#FFD700]/20 text-[#b45309] border-[#FFD700]/50', // Nuevo: Gold style
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-3 py-1 text-[10px]',
    lg: 'px-4 py-1.5 text-xs',
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        backdrop-blur-sm
        font-black uppercase tracking-widest
        rounded-full border
        shadow-sm
        ${variants[variant] || variants.default}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;