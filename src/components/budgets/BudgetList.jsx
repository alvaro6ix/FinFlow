import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Wallet } from 'lucide-react';
import BudgetCard from './BudgetCard';

const BudgetList = ({ budgets, onEdit, onDelete, categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('category');

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.icon || '💰';
  };

  const getFilteredBudgets = () => {
    let filtered = [...budgets];

    if (searchTerm) {
      filtered = filtered.filter((budget) =>
        budget.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((budget) => {
        const percentage = (budget.spent / budget.amount) * 100;

        switch (filterStatus) {
          case 'active':
            return budget.isActive && percentage < budget.alertThreshold;
          case 'warning':
            return percentage >= budget.alertThreshold && percentage < 100;
          case 'exceeded':
            return percentage >= 100;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const getSortedBudgets = () => {
    const filtered = getFilteredBudgets();

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'category':
          return a.categoryName.localeCompare(b.categoryName);
        case 'percentage': {
          const percentA = (a.spent / a.amount) * 100;
          const percentB = (b.spent / b.amount) * 100;
          return percentB - percentA;
        }
        case 'amount':
          return b.amount - a.amount;
        case 'remaining': {
          const remainingA = a.amount - a.spent;
          const remainingB = b.amount - b.spent;
          return remainingA - remainingB;
        }
        default:
          return 0;
      }
    });
  };

  const displayedBudgets = getSortedBudgets();

  const getStatusCount = (status) => {
    return budgets.filter((budget) => {
      const percentage = (budget.spent / budget.amount) * 100;

      switch (status) {
        case 'active':
          return budget.isActive && percentage < budget.alertThreshold;
        case 'warning':
          return percentage >= budget.alertThreshold && percentage < 100;
        case 'exceeded':
          return percentage >= 100;
        default:
          return true;
      }
    }).length;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar presupuesto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Estado:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'Todos', count: budgets.length },
              { value: 'active', label: 'Activos', count: getStatusCount('active') },
              { value: 'warning', label: 'Alerta', count: getStatusCount('warning') },
              { value: 'exceeded', label: 'Excedidos', count: getStatusCount('exceeded') },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === filter.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === filter.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: 'category', label: 'Categoría' },
              { value: 'percentage', label: 'Porcentaje' },
              { value: 'amount', label: 'Monto' },
              { value: 'remaining', label: 'Disponible' },
            ].map((sort) => (
              <button
                key={sort.value}
                onClick={() => setSortBy(sort.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  sortBy === sort.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold">{displayedBudgets.length}</span> de{' '}
          <span className="font-semibold">{budgets.length}</span> presupuestos
        </p>
      </div>

      {/* Budget Cards Grid */}
      {displayedBudgets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={onEdit}
              onDelete={onDelete}
              categoryIcon={getCategoryIcon(budget.categoryId)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay presupuestos</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all'
              ? 'No se encontraron presupuestos con los filtros aplicados'
              : 'Crea tu primer presupuesto para comenzar a controlar tus gastos'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BudgetList;