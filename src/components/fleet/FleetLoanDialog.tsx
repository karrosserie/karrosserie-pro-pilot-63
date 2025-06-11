
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import FleetLoanForm from './FleetLoanForm';
import FleetReturnForm from './FleetReturnForm';
import { LoanFormData } from './FleetLoanForm';
import { FleetReturnFormData } from './FleetReturnForm.types';
import { useFleetReservation } from '@/hooks/use-fleet-reservations';
import { useFleetReturnByReservation } from '@/hooks/use-fleet-returns';

interface FleetLoanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: FleetVehicle | null;
  loanId?: string | null;
  mode: 'create' | 'edit' | 'view' | 'return';
  onSubmit?: (loanData: LoanFormData) => void;
}

const FleetLoanDialog: React.FC<FleetLoanDialogProps> = ({
  isOpen,
  onClose,
  vehicle,
  loanId,
  mode,
  onSubmit
}) => {
  const { reservation } = useFleetReservation(loanId || undefined);
  const { fleetReturn } = useFleetReturnByReservation(loanId || undefined);

  const getDialogTitle = () => {
    switch (mode) {
      case 'create':
        return 'Nouveau prêt de véhicule';
      case 'edit':
        return 'Modifier le prêt';
      case 'view':
        return 'Détails du prêt';
      case 'return':
        return fleetReturn ? 'Détails du retour' : 'Retour de véhicule';
      default:
        return 'Prêt de véhicule';
    }
  };

  const handleReturnSubmit = (returnData: FleetReturnFormData) => {
    console.log('Return data submitted:', returnData);
    onClose();
  };

  // Si on est en mode return et qu'on a déjà un retour, on affiche les données en lecture seule
  const isViewOnlyReturn = mode === 'return' && !!fleetReturn;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        {mode === 'return' ? (
          reservation?.fleet_vehicles ? (
            <FleetReturnForm
              vehicle={reservation.fleet_vehicles as FleetVehicle}
              reservationId={loanId || ''}
              onSubmit={handleReturnSubmit}
              onCancel={onClose}
              isViewMode={isViewOnlyReturn}
              existingReturnData={fleetReturn}
            />
          ) : (
            <div className="p-4 text-center">
              <p>Chargement des informations du véhicule...</p>
            </div>
          )
        ) : (
          <FleetLoanForm
            vehicle={vehicle}
            mode={mode}
            onSubmit={onSubmit || (() => {})}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FleetLoanDialog;
