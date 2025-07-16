import React from 'react';
import { PlanningProvider } from '@/contexts/PlanningContext';
import PlanningHeader from '@/components/planning/PlanningHeader';
import PlanningTabs from '@/components/planning/PlanningTabs';
import ScheduleModal from '@/components/planning/ScheduleModal';

const Planning: React.FC = () => {
  return (
    <PlanningProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <PlanningHeader />
          <PlanningTabs />
          <ScheduleModal />
        </div>
      </div>
    </PlanningProvider>
  );
};

export default Planning;