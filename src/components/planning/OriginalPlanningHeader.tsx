import React from 'react';
import { Settings, User, AlertTriangle } from 'lucide-react';
import { usePlanningContext } from '@/contexts/OriginalPlanningContext';

const PlanningHeader: React.FC = () => {
  const { currentView, setCurrentView } = usePlanningContext();

  return (
    <div className="bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - View buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('manager')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === 'manager'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Vue Manager
          </button>
          <button
            onClick={() => setCurrentView('employee')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentView === 'employee'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            Vue Employé
          </button>
        </div>
        
        {/* Right side - Emergency button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors">
          <AlertTriangle className="w-4 h-4" />
          Véhicule Urgence
        </button>
      </div>
    </div>
  );
};

export default PlanningHeader;