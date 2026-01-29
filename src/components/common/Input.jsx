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
        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
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
            w-full rounded-lg border transition-colors duration-200
            ${icon ? 'pl-10' : 'pl-3'}
            pr-3 py-2.5
            text-secondary-900 dark:text-white
            placeholder-secondary-400
            focus:outline-none focus:ring-2
            ${
              error
                ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                : 'border-secondary-300 dark:border-secondary-600 focus:border-primary-500 focus:ring-primary-500'
            }
            ${disabled ? 'bg-secondary-100 dark:bg-secondary-800 cursor-not-allowed' : 'bg-white dark:bg-secondary-900'}
            ${inputClassName}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-danger-500 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;