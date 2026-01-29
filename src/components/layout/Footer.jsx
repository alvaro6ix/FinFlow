import React from 'react';

const Footer = () => {
  return (
    <footer className="hidden lg:block mt-auto py-6 px-8 border-t border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between text-sm text-secondary-600 dark:text-secondary-400">
        <p>© 2024 FinFlow. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary-600 transition-colors">
            Términos
          </a>
          <a href="#" className="hover:text-primary-600 transition-colors">
            Privacidad
          </a>
          <a href="#" className="hover:text-primary-600 transition-colors">
            Soporte
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;