
import React from 'react';
import {
  Dialog,
  DialogContent,  
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFormDialog } from '@/hooks/use-form-dialog';
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
  const { handleOpenChange } = useFormDialog({ 
    hasUnsavedChanges: mode === 'create' || mode === 'edit', 
    onOpenChange: onClose 
  });
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
    <Dialog open={isOpen} onOpenChange={mode === 'view' ? onClose : handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto sm:w-full">
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
