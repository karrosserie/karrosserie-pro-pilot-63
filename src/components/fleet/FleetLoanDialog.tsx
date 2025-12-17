
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFormDialog } from '@/hooks/use-form-dialog';
import FleetLoanForm, { LoanFormData } from './FleetLoanForm';
import FleetReturnForm from './FleetReturnForm';
import { FleetReturnFormData } from './FleetReturnForm.types';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useFleetReservation } from '@/hooks/use-fleet-reservations';

interface FleetLoanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: FleetVehicle | null;
  loanId: string | null;
  mode: 'create' | 'edit' | 'view' | 'return' | 'view_return';
  onSubmit: (loanData: LoanFormData | FleetReturnFormData) => void;
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
  const { handleOpenChange } = useFormDialog({ 
    hasUnsavedChanges: mode === 'create' || mode === 'edit' || mode === 'return',
    onOpenChange: onClose 
  });

  const handleLoanSubmit = (loanData: LoanFormData) => {
    onSubmit(loanData);
    onClose();
  };

  const handleReturnSubmit = (returnData: FleetReturnFormData) => {
    onSubmit(returnData);
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Nouveau prêt de véhicule';
      case 'edit':
        return 'Modifier le prêt';
      case 'view':
        return 'Détails du prêt';
      case 'return':
        return 'Retour de véhicule';
      case 'view_return':
        return 'Détails du retour';
      default:
        return 'Prêt de véhicule';
    }
  };

  // Create a complete FleetVehicle object from the partial data
  const createCompleteVehicle = (partialVehicle: any): FleetVehicle => {
    return {
      id: partialVehicle.id,
      brand_id: partialVehicle.brand_id || '',
      model_id: partialVehicle.model_id || '',
      license_plate: partialVehicle.license_plate || '',
      color: partialVehicle.color || '',
      year: partialVehicle.year || new Date().getFullYear(),
      vin: partialVehicle.vin || '',
      engine_number: partialVehicle.engine_number || '',
      mileage: partialVehicle.mileage || 0,
      status: partialVehicle.status || 'Disponible',
      insurance_card_url: partialVehicle.insurance_card_url || '',
      registration_front_url: partialVehicle.registration_front_url || '',
      registration_back_url: partialVehicle.registration_back_url || '',
      created_at: partialVehicle.created_at || new Date().toISOString(),
      updated_at: partialVehicle.updated_at || new Date().toISOString(),
      company_id: partialVehicle.company_id || '',
      car_brands: partialVehicle.car_brands || null,
      car_models: partialVehicle.car_models || null
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={mode === 'view' || mode === 'view_return' ? onClose : handleOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2 shrink-0">
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 flex flex-col">
        {(mode === 'return' || mode === 'view_return') ? (
          reservation && reservation.fleet_vehicles ? (
            <FleetReturnForm
              vehicle={createCompleteVehicle(reservation.fleet_vehicles)}
              reservationId={reservation.id}
              onSubmit={handleReturnSubmit}
              onCancel={onClose}
              isViewMode={mode === 'view_return'}
            />
          ) : (
            <div className="p-4">
              <p className="text-gray-600">Chargement des données de retour...</p>
            </div>
          )
        ) : (
          // Always render FleetLoanForm for create/edit/view modes
          <>
            {mode === 'create' && vehicle ? (
              <FleetLoanForm
                vehicle={vehicle}
                onSubmit={handleLoanSubmit}
                onCancel={onClose}
                isOpen={isOpen}
              />
            ) : reservation && reservation.fleet_vehicles ? (
              <FleetLoanForm
                vehicle={createCompleteVehicle(reservation.fleet_vehicles)}
                onSubmit={handleLoanSubmit}
                onCancel={onClose}
                defaultValues={reservation}
                isViewMode={mode === 'view'}
                isOpen={isOpen}
              />
            ) : (
              <div className="p-4">
                <p className="text-gray-600">Chargement des données du prêt...</p>
              </div>
            )}
          </>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FleetLoanDialog;
