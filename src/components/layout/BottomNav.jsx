import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/expenses', icon: '💰', label: 'Gastos' },
    { path: '/budgets', icon: '🎯', label: 'Presupuestos' },
    { path: '/goals', icon: '🏆', label: 'Metas' },
    { path: '/settings', icon: '⚙️', label: 'Config' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-around py-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors
              ${
                isActive(item.path)
                  ? 'text-primary-600'
                  : 'text-secondary-500 dark:text-secondary-400'
              }
            `}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;