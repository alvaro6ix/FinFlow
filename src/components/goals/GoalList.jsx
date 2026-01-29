import React from 'react';
import GoalCard from './GoalCard';

const GoalList = ({ goals = [], currency, onEdit, onDelete, onAddContribution }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
          No hay metas creadas
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400">
          Crea tu primera meta financiera y comienza a ahorrar
        </p>
      </div>
    );
  }

  // Separar metas activas y completadas
  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);

  return (
    <div className="space-y-8">
      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
            Metas Activas ({activeGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                currency={currency}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddContribution={onAddContribution}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
            Metas Completadas ({completedGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                currency={currency}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalList;