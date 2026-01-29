import React from 'react';
import { useGoalStore } from '../stores/goalStore';
import Card from '../components/common/Card';
import { useSettingsStore } from '../stores/settingsStore';

const Goals = () => {
  const { goals, addContribution } = useGoalStore();
  const { currency } = useSettingsStore();

  const formatMoney = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(val);

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Metas de Ahorro</h1>
          <p className="text-secondary-500">Construye tu futuro paso a paso.</p>
        </div>
        <button className="bg-primary-500 text-white p-3 rounded-2xl shadow-lg">＋ Nueva Meta</button>
      </header>

      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <Card key={goal.id}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="text-3xl bg-secondary-100 p-3 rounded-2xl">🏆</div>
                  <div>
                    <h3 className="font-bold text-lg dark:text-white">{goal.name}</h3>
                    <p className="text-sm text-secondary-500">Objetivo: {formatMoney(goal.targetAmount)}</p>
                  </div>
                </div>
                <span className="text-primary-600 font-bold">{progress.toFixed(0)}%</span>
              </div>

              <div className="w-full bg-secondary-100 dark:bg-secondary-800 h-4 rounded-full overflow-hidden mb-6">
                <div 
                  className="bg-primary-500 h-full transition-all duration-1000" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => addContribution(goal.id, 100)}
                  className="flex-1 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold hover:bg-primary-100 transition-colors"
                >
                  Aportar $100
                </button>
                <button className="flex-1 py-3 bg-secondary-50 text-secondary-600 rounded-xl font-bold">Ver Detalles</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;