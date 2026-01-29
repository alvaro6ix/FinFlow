import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { DEFAULT_CATEGORIES } from '../../constants/categories';

const ExpenseFilters = ({ onFilterChange, onClear }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState('month');

  const handleCategoryToggle = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    onFilterChange({ categories: newCategories, dateRange });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    onFilterChange({ categories: selectedCategories, dateRange: range });
  };

  const handleClear = () => {
    setSelectedCategories([]);
    setDateRange('month');
    onClear();
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Date Range */}
        <div>
          <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
            Período
          </h4>
          <div className="flex flex-wrap gap-2">
            {['today', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => handleDateRangeChange(range)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${dateRange === range
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                  }
                `}
              >
                {range === 'today' && 'Hoy'}
                {range === 'week' && 'Semana'}
                {range === 'month' && 'Mes'}
                {range === 'year' && 'Año'}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
            Categorías
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {DEFAULT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1
                  ${selectedCategories.includes(category.id)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-secondary-200 dark:border-secondary-700'
                  }
                `}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Clear Button */}
        {(selectedCategories.length > 0 || dateRange !== 'month') && (
          <Button variant="ghost" onClick={handleClear} fullWidth>
            Limpiar Filtros
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ExpenseFilters;