import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuthStore();

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
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-secondary-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
            <span>💰</span> FinFlow
          </h1>
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs">
            {user?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-700 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
            <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <span>💰</span> FinFlow
            </h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path) ? 'bg-primary-500 text-white shadow-md' : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}>
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
            <button onClick={signOut} className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 justify-center">
              <span>🚪</span> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;