
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FleetVehicleForm from './FleetVehicleForm';

interface FleetVehicleDialogProps {
  vehicle: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FleetVehicleDialog: React.FC<FleetVehicleDialogProps> = ({
  vehicle,
  open,
  onOpenChange
}) => {
  const title = vehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule';
  const description = vehicle 
    ? 'Modifiez les informations du véhicule de courtoisie.'
    : 'Ajoutez un nouveau véhicule à votre flotte de courtoisie.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FleetVehicleForm 
          vehicle={vehicle}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FleetVehicleDialog;
