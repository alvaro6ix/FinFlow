import React from 'react';

const Logo = ({ size = 48, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="512" height="512" rx="120" fill="#6366f1"/>
      <path 
        d="M160 352V160H352" 
        stroke="white" 
        strokeWidth="45" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M160 256H310" 
        stroke="white" 
        strokeWidth="45" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="352" cy="160" r="35" fill="#10b981"/>
      <path 
        d="M160 352L240 272" 
        stroke="#10b981" 
        strokeWidth="45" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;