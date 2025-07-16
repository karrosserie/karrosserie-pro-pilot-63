import React from 'react';
import { AlertTriangle, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlanning } from '@/contexts/PlanningContext';

const PlanningHeader: React.FC = () => {
  const { state, actions } = usePlanning();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - View mode buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant={state.viewMode === 'manager' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => actions.setViewMode('manager')}
            className="rounded-full px-4 py-2"
          >
            <Settings className="w-4 h-4 mr-2" />
            Vue Manager
          </Button>
          <Button
            variant={state.viewMode === 'employee' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => actions.setViewMode('employee')}
            className="rounded-full px-4 py-2"
          >
            <User className="w-4 h-4 mr-2" />
            Vue Employé
          </Button>
        </div>
        
        {/* Right side - Emergency button */}
        <Button 
          variant="destructive" 
          size="sm"
          className="rounded-full px-4 py-2"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Véhicule Urgence
        </Button>
      </div>
    </div>
  );
};

export default PlanningHeader;