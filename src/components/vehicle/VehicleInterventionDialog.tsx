import React from 'react';
import InterventionDialog from '@/components/intervention/InterventionDialog';

interface VehicleInterventionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVehicle?: any;
}

const VehicleInterventionDialog = ({
  open,
  onOpenChange,
  selectedVehicle
}: VehicleInterventionDialogProps) => {
  // Get the client from the selected vehicle
  const client = selectedVehicle?.clients;

  return (
    <InterventionDialog
      client={client}
      open={open}
      onOpenChange={onOpenChange}
      preselectedVehicle={selectedVehicle}
    />
  );
};

export default VehicleInterventionDialog;