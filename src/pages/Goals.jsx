import React from 'react';
import Card from '../components/common/Card';

const Goals = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Metas Financieras
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Define y alcanza tus objetivos de ahorro
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
            Metas Financieras
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            Esta funcionalidad estará disponible pronto
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Goals;