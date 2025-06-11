
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FleetLoanForm, { LoanFormData } from './FleetLoanForm';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface FleetLoanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: FleetVehicle | null;
  onSubmit: (loanData: LoanFormData) => void;
}

const FleetLoanDialog: React.FC<FleetLoanDialogProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSubmit
}) => {
  if (!vehicle) return null;

  const handleSubmit = (loanData: LoanFormData) => {
    onSubmit(loanData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau prêt de véhicule</DialogTitle>
        </DialogHeader>
        <FleetLoanForm
          vehicle={vehicle}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FleetLoanDialog;
