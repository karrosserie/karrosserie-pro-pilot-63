import React from 'react';
import { PlanningProvider } from '@/contexts/PlanningContext';
import PlanningHeader from '@/components/planning/PlanningHeader';
import PlanningTabs from '@/components/planning/PlanningTabs';
import ScheduleModal from '@/components/planning/ScheduleModal';
import WaitingVehiclesModal from '@/components/planning/WaitingVehiclesModal';
import VehicleDetailModal from '@/components/planning/VehicleDetailModal';

const Planning: React.FC = () => {
  return (
    <PlanningProvider>
      <div className="min-h-screen bg-gray-50">
        <PlanningHeader />
        <PlanningTabs />
        <ScheduleModal />
        <WaitingVehiclesModal />
        <VehicleDetailModal />
      </div>
    </PlanningProvider>
  );
};

export default Planning;