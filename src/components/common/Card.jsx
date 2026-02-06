import React from 'react';

const Card = ({ children, title, className = "" }) => {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/70 dark:bg-secondary-900/60 
        backdrop-blur-xl
        rounded-[2.5rem]
        p-6 sm:p-8
        shadow-xl shadow-indigo-500/5
        border border-white/40 dark:border-white/10
        transition-all duration-300
        hover:shadow-2xl hover:shadow-indigo-500/10
        ${className}
      `}
    >
      {/* Brillo decorativo superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

      {title && (
        <h3 className="text-xs font-black mb-6 text-secondary-900 dark:text-white uppercase tracking-[0.2em] border-b border-secondary-100 dark:border-white/10 pb-4">
          {title}
        </h3>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;