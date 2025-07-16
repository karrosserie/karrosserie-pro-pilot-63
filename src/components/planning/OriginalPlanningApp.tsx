import React, { useState } from 'react';
import { PlanningProvider } from '@/contexts/OriginalPlanningContext';
import PlanningHeader from '@/components/planning/OriginalPlanningHeader';
import PlanningTabs from '@/components/planning/OriginalPlanningTabs';
import WorkshopSteps from '@/components/planning/OriginalWorkshopSteps';
import WaitingVehiclesModal from '@/components/planning/OriginalWaitingVehiclesModal';
import VehicleDetailModal from '@/components/planning/OriginalVehicleDetailModal';

const OriginalPlanningApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('etapes');

  return (
    <PlanningProvider>
      <div className="min-h-screen bg-gray-50">
        <PlanningHeader />
        <PlanningTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'etapes' && <WorkshopSteps />}
        
        {activeTab === 'planning' && (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Vue Planning</h2>
            <p className="text-gray-600">Interface planning en développement</p>
          </div>
        )}
        
        {activeTab === 'planning-employes' && (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Planning Employés</h2>
            <p className="text-gray-600">Interface planning employés en développement</p>
          </div>
        )}
        
        {activeTab === 'employes' && (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Employés</h2>
            <p className="text-gray-600">Interface employés en développement</p>
          </div>
        )}
        
        {activeTab === 'process' && (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Process</h2>
            <p className="text-gray-600">Interface process en développement</p>
          </div>
        )}
        
        <WaitingVehiclesModal />
        <VehicleDetailModal />
      </div>
    </PlanningProvider>
  );
};

export default OriginalPlanningApp;