
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FleetVehicleForm from './FleetVehicleForm';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface FleetVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: FleetVehicle | null;
  mode: 'create' | 'edit' | 'view';
}

const FleetVehicleDialog: React.FC<FleetVehicleDialogProps> = ({
  isOpen,
  onClose,
  vehicle,
  mode
}) => {
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Ajouter un véhicule de courtoisie';
      case 'edit':
        return 'Modifier le véhicule de courtoisie';
      case 'view':
        return 'Détails du véhicule de courtoisie';
      default:
        return 'Véhicule de courtoisie';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <FleetVehicleForm
          vehicle={vehicle}
          mode={mode}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FleetVehicleDialog;
