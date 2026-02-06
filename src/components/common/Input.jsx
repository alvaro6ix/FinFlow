import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  name,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-secondary-500 dark:text-secondary-400 mb-2 ml-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary-400 group-focus-within:text-amber-500 transition-colors">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full 
            bg-white/50 dark:bg-secondary-900/50 
            backdrop-blur-sm
            border border-white/40 dark:border-white/10
            rounded-2xl
            py-4
            text-sm font-bold text-secondary-900 dark:text-white
            placeholder-secondary-400/70
            transition-all duration-300
            shadow-sm
            
            ${icon ? 'pl-11' : 'pl-4'}
            pr-4
            
            /* ✅ FOCUS DORADO (GOLD) */
            focus:outline-none 
            focus:ring-4 focus:ring-amber-500/10 
            focus:border-amber-500/50 
            focus:bg-white/80 dark:focus:bg-secondary-900/80
            
            disabled:opacity-50 disabled:cursor-not-allowed
            
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${inputClassName}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 ml-2 text-[10px] font-bold text-red-500 uppercase tracking-wide flex items-center gap-1">
          • {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 ml-2 text-[10px] text-secondary-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;