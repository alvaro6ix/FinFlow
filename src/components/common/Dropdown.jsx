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
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 min-w-[200px]
            bg-white dark:bg-secondary-800
            border border-secondary-200 dark:border-secondary-700
            rounded-lg shadow-lg
            animate-slide-down
            ${alignmentClasses[align]}
            ${className}
          `}
        >
          <div className="py-1">
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
        w-full px-4 py-2 text-left text-sm
        text-secondary-700 dark:text-secondary-300
        hover:bg-secondary-100 dark:hover:bg-secondary-700
        transition-colors flex items-center gap-3
        ${className}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </button>
  );
};

export default Dropdown;