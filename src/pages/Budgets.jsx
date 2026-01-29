import React from 'react';
import Card from '../components/common/Card';

const Budgets = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Presupuestos
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Gestiona tus presupuestos por categoría
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
            Presupuestos
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            Esta funcionalidad estará disponible pronto
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Budgets;