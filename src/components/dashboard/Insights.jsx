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
    <Card title="💡 Insights">
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <Alert
            key={index}
            type={getAlertType(insight)}
            message={insight.message}
          />
        ))}
      </div>
    </Card>
  );
};

export default Insights;