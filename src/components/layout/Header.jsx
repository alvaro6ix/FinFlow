import React from 'react';
import { useAuthStore } from '../../stores/authStore';

const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onMenuClick}
          className="text-secondary-600 dark:text-secondary-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
          <span className="text-2xl">💰</span>
          FinFlow
        </h1>

        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
          {user?.displayName?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Header;