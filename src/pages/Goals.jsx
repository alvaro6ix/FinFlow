import React, { useState } from 'react';
import { useGoalStore } from '../stores/goalStore';
import Card from '../components/common/Card';

const Goals = () => {
  const { goals, addContribution } = useGoalStore();
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleContribution = async (goalId) => {
    if (!contributionAmount) return;
    await addContribution(goalId, contributionAmount);
    setContributionAmount('');
    setSelectedGoal(null);
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Metas de Ahorro</h1>
          <p className="text-secondary-500 text-sm">Tu camino hacia el éxito</p>
        </div>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
          + Nueva Meta
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <Card key={goal.id} className="overflow-hidden p-0 border-none shadow-xl">
              {/* Imagen Motivacional (Req 6.2) */}
              <div className="h-32 bg-secondary-200 relative">
                 {goal.imageUrl ? (
                   <img src={goal.imageUrl} alt={goal.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary-500 to-purple-600 text-white text-4xl">
                     🎯
                   </div>
                 )}
                 <div className="absolute bottom-4 left-4 text-white drop-shadow-md">
                    <h2 className="text-xl font-bold">{goal.name}</h2>
                 </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-secondary-500 uppercase">Progreso</p>
                    <p className="text-2xl font-bold dark:text-white">
                      ${goal.currentAmount.toLocaleString()} 
                      <span className="text-sm font-normal text-secondary-400"> / ${goal.targetAmount.toLocaleString()}</span>
                    </p>
                  </div>
                  <p className="text-primary-600 font-bold">{progress.toFixed(0)}%</p>
                </div>

                {/* Barra de progreso visual (Req 6.2) */}
                <div className="h-3 w-full bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Aportación Rápida (Req 6.3) */}
                {selectedGoal === goal.id ? (
                  <div className="flex gap-2 animate-in fade-in zoom-in duration-200">
                    <input 
                      type="number" 
                      placeholder="Monto..." 
                      className="flex-1 p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800 border-none outline-none dark:text-white"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                    />
                    <button 
                      onClick={() => handleContribution(goal.id)}
                      className="bg-success-500 text-white px-6 rounded-xl font-bold"
                    >
                      Sumar
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setSelectedGoal(goal.id)}
                    className="w-full py-3 bg-secondary-50 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 rounded-xl font-bold hover:bg-primary-50 transition-colors"
                  >
                    + Registrar Aportación
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;