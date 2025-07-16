import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlanning } from '@/contexts/PlanningContext';

const PlanningHeader: React.FC = () => {
  const { state, actions } = usePlanning();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Planning Atelier</h1>
        <p className="text-muted-foreground">Parcours complet avec synchronisation planning automatique</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={state.viewMode === 'manager' ? 'default' : 'outline'}
          onClick={() => actions.setViewMode('manager')}
          size="sm"
        >
          Vue Manager
        </Button>
        <Button
          variant={state.viewMode === 'employee' ? 'default' : 'outline'}
          onClick={() => actions.setViewMode('employee')}
          size="sm"
        >
          Vue Employé
        </Button>
        <Button variant="destructive" size="sm">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Véhicule Urgence
        </Button>
      </div>
    </div>
  );
};

export default PlanningHeader;