import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-indigo-900/90',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-indigo-900/90',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-indigo-900/90',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-indigo-900/90',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-1.5
            bg-indigo-900/90 dark:bg-black/90
            backdrop-blur-md
            text-white text-[10px] font-bold uppercase tracking-wide
            rounded-lg
            whitespace-nowrap shadow-xl
            animate-in fade-in zoom-in-95 duration-200
            border border-white/10
            ${positions[position]}
          `}
        >
          {content}
          {/* Flechita */}
          <div
            className={`
              absolute w-0 h-0 
              border-4 border-transparent
              ${arrowPositions[position]}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;