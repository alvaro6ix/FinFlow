import React from 'react';

const Logo = ({ size = 48, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-lg ${className}`}
    >
      {/* Fondo Morado Profundo (Liquid Purple) */}
      <rect width="512" height="512" rx="120" fill="#1e1b4b"/>
      
      {/* Líneas Blancas (Glass) */}
      <path 
        d="M160 352V160H352" 
        stroke="white" 
        strokeWidth="45" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeOpacity="0.9"
      />
      <path 
        d="M160 256H310" 
        stroke="white" 
        strokeWidth="45" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeOpacity="0.9"
      />
      
      {/* Acento Dorado (Liquid Gold) */}
      <circle cx="352" cy="160" r="40" fill="#FFD700"/>
      <path 
        d="M160 352L240 272" 
        stroke="#FFD700" 
        strokeWidth="45" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;