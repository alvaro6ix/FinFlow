import React from 'react';
import Card from '../common/Card';

const HealthScore = ({ score = 0 }) => {
  const getColor = (score) => {
    if (score >= 70) return 'text-success-600';
    if (score >= 40) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getBgColor = (score) => {
    if (score >= 70) return 'stroke-success-500';
    if (score >= 40) return 'stroke-warning-500';
    return 'stroke-danger-500';
  };

  const getMessage = (score) => {
    if (score >= 70) return '¡Excelente! Tu salud financiera es muy buena 🎉';
    if (score >= 40) return 'Vas bien, pero puedes mejorar 💪';
    return 'Necesitas ajustar tus gastos ⚠️';
  };

  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary-200 dark:text-secondary-700"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={getBgColor(score)}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getColor(score)}`}>
                {score}
              </div>
              <div className="text-xs text-secondary-500">Score</div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
            Salud Financiera
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400">
            {getMessage(score)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default HealthScore;