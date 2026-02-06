import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'font-black uppercase tracking-wider rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg backdrop-blur-md relative overflow-hidden group';

  const variants = {
    // ✅ PRIMARY: DORADO LOGIN (Sin cambio a naranja)
    primary: 'bg-[#FFD700] text-[#1e1b4b] border border-white/40 shadow-[0_0_15px_rgba(255,215,0,0.4)] hover:brightness-110',
    
    // Secondary: Cristal Blanco
    secondary: 'bg-white/80 dark:bg-secondary-800/80 text-secondary-600 dark:text-secondary-200 border border-secondary-200 dark:border-white/10 hover:bg-white',
    
    // Outline: Borde Dorado
    outline: 'bg-transparent border-2 border-[#FFD700] text-[#b45309] dark:text-[#FFD700]',
    
    // Ghost: Texto simple
    ghost: 'text-secondary-600 hover:bg-secondary-100/50 dark:hover:bg-white/10 shadow-none',
    
    // Danger: Rojo
    danger: 'bg-red-500 text-white shadow-red-500/30 hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm',
    xl: 'px-10 py-5 text-base',
  };

  const fullWidthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size]}
        ${fullWidthStyle}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Procesando...</span>
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
};

export default Button;