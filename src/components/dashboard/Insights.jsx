import React from 'react';
import Card from '../common/Card';
import Alert from '../common/Alert';

const Insights = ({ insights = [] }) => {
  const getAlertType = (insight) => {
    if (insight.type === 'success') return 'success';
    if (insight.type === 'warning') return 'warning';
    if (insight.type === 'danger') return 'error';
    return 'info';
  };

  if (insights.length === 0) return null;

  return (
    <Card title="💡 Insights Inteligentes">
      <div className="flex flex-col gap-3">
        {insights.map((insight, index) => (
          <Alert
            key={index}
            type={getAlertType(insight)}
            // Corrección: Usamos insight.text para coincidir con financialLogic.js
            message={insight.text}
          />
        ))}
      </div>
      {/* Indicador de Asistente Proactivo */}
      <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-800">
        <p className="text-[10px] text-secondary-400 uppercase font-bold tracking-widest text-center">
          Analizado por FinFlow AI
        </p>
      </div>
    </Card>
  );
};

export default Insights;