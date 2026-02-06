import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const modalContent = (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay Oscuro con Blur */}
      <div 
        className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm transition-opacity" 
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Contenedor Glass */}
      <div
        className={`
          relative w-full ${sizes[size]}
          bg-white/95 dark:bg-secondary-900/95
          backdrop-blur-xl
          border border-white/20 dark:border-white/5
          rounded-t-[2.5rem] sm:rounded-[2.5rem]
          shadow-2xl shadow-black/20
          transform transition-all duration-300 animate-in slide-in-from-bottom-10 fade-in
          flex flex-col max-h-[90vh]
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-secondary-100 dark:border-white/5 shrink-0">
            {title ? (
              <h2 className="text-sm font-black text-secondary-900 dark:text-white uppercase tracking-widest">
                {title}
              </h2>
            ) : <div />}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-secondary-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content con Scroll personalizado */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-100 dark:border-white/5 bg-secondary-50/50 dark:bg-black/20 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;