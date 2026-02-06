import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, align = 'left', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-3 min-w-[220px]
            bg-white/90 dark:bg-secondary-900/95
            backdrop-blur-xl
            border border-white/20 dark:border-white/10
            rounded-2xl shadow-2xl shadow-indigo-500/10
            animate-in fade-in slide-in-from-top-2 duration-200
            p-2
            ${alignmentClasses[align]}
            ${className}
          `}
        >
          <div className="flex flex-col gap-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-3 text-left text-xs font-bold uppercase tracking-wide
        text-secondary-600 dark:text-secondary-300
        hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600
        rounded-xl transition-colors duration-200
        flex items-center gap-3
        ${className}
      `}
    >
      {icon && <span className="text-indigo-500">{icon}</span>}
      {children}
    </button>
  );
};

export default Dropdown;