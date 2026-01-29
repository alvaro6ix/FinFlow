import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/expenses', icon: '💰', label: 'Gastos' },
    { path: '/budgets', icon: '🎯', label: 'Presupuestos' },
    { path: '/goals', icon: '🏆', label: 'Metas' },
    { path: '/analytics', icon: '📈', label: 'Análisis' },
    { path: '/settings', icon: '⚙️', label: 'Configuración' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-secondary-900 
        border-r border-secondary-200 dark:border-secondary-700
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <span className="text-3xl">💰</span>
            FinFlow
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${
                  isActive(item.path)
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                }
              `}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;