import React from 'react';
import Card from '../common/Card';

const HealthScore = ({ score = 0 }) => {
  const getColor = (s) => {
    if (s >= 70) return 'text-success-600';
    if (s >= 40) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getBgColor = (s) => {
    if (s >= 70) return 'stroke-success-500';
    if (s >= 40) return 'stroke-warning-500';
    return 'stroke-danger-500';
  };

  const getMessage = (s) => {
    if (s >= 85) return '¡Dominio total! Tus finanzas están en el top 1% 🏆';
    if (s >= 70) return '¡Excelente! Tu salud financiera es muy sólida 🎉';
    if (s >= 40) return 'Vas por buen camino, pero cuida los gastos por impulso 💪';
    return 'Alerta: Tus gastos están superando tu capacidad. ¡Ajusta el plan! ⚠️';
  };

  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-secondary-100 dark:text-secondary-800"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${getBgColor(score)} transition-all duration-1000 ease-in-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-black ${getColor(score)} transition-colors duration-500`}>
                {score}
              </div>
              <div className="text-[10px] font-bold text-secondary-400 uppercase tracking-tighter">Score</div>
            </div>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-black text-secondary-900 dark:text-white mb-1 uppercase tracking-tight">
            Salud Financiera
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
            {getMessage(score)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default HealthScore;