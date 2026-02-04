import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuthStore();

  const menuItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/expenses", icon: "💰", label: "Gastos" },
    { path: "/budgets", icon: "🎯", label: "Presupuestos" },
    { path: "/goals", icon: "🏆", label: "Metas" },
    { path: "/analytics", icon: "📈", label: "Análisis" },
    { path: "/settings", icon: "⚙️", label: "Configuración" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-secondary-100 dark:bg-secondary-950 transition-colors duration-300">
      
      {/* HEADER MÓVIL */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-secondary-50 dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-xl"
          >
            ☰
          </button>

          <h1 className="font-black text-primary-600 flex items-center gap-2">
            💰 FinFlow
          </h1>

          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.displayName?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50 h-full w-64
          bg-secondary-50 dark:bg-secondary-900
          border-r border-secondary-200 dark:border-secondary-800
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* LOGO */}
          <div className="p-6 border-b border-secondary-200 dark:border-secondary-800">
            <h1 className="text-2xl font-black text-primary-600 flex items-center gap-2">
              💰 FinFlow
            </h1>
          </div>

          {/* NAV */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all
                  ${
                    isActive(item.path)
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800"
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* LOGOUT */}
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-800">
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg py-2 transition"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main
        className="
          flex-1
          pt-16 lg:pt-0
          bg-secondary-100 dark:bg-secondary-950
          transition-colors duration-300
        "
      >
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
