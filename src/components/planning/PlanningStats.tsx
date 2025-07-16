import React from 'react';
import { usePlanning } from '@/contexts/PlanningContext';

const PlanningStats: React.FC = () => {
  const { state } = usePlanning();
  const { stats } = state;

  return (
    <div className="flex items-center justify-end gap-8 mb-8">
      <div className="text-center">
        <div className="text-3xl font-bold text-blue-600">{stats.vehicles}</div>
        <div className="text-sm text-gray-600 uppercase tracking-wide">VÉHICULES</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
        <div className="text-sm text-gray-600 uppercase tracking-wide">TERMINÉS</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600">{stats.waiting}</div>
        <div className="text-sm text-gray-600 uppercase tracking-wide">EN ATTENTE</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600">{stats.revenue.toLocaleString()}€</div>
        <div className="text-sm text-gray-600 uppercase tracking-wide">CA EN COURS</div>
      </div>
    </div>
  );
};

export default PlanningStats;