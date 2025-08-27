import React from 'react';
import { WorkshopPlanningInterface } from '@/components/planning/WorkshopPlanningInterface';
import { useVehicleWorkflow } from '@/hooks/use-vehicle-workflow';
import { useEmployees } from '@/hooks/use-employees';
import { useWorkshopSchedule } from '@/hooks/use-workshop-schedule';
import { useCompany } from '@/hooks/use-company';
import { toast } from '@/hooks/use-toast';

const Planning = () => {
  const { companyInfo } = useCompany();
  const { workflowSteps, refetch: refetchWorkflow } = useVehicleWorkflow(companyInfo?.id);
  const { employees } = useEmployees();
  const { schedules } = useWorkshopSchedule();

  // Transform workflow steps into vehicles array for the interface
  const vehicles = workflowSteps?.flatMap(step => 
    step.vehicles.map(vehicle => ({
      ...vehicle,
      step: step.title
    }))
  ) || [];

  const handleScheduleUpdate = async (data: any) => {
    try {
      // Handle schedule updates here
      console.log('Schedule update:', data);
      await refetchWorkflow();
      
      toast({
        title: "Planification mise à jour",
        description: "Les modifications ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du planning:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le planning.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <WorkshopPlanningInterface
        employees={employees}
        vehicles={vehicles}
        schedules={schedules}
        onScheduleUpdate={handleScheduleUpdate}
      />
    </div>
  );
};

export default Planning;