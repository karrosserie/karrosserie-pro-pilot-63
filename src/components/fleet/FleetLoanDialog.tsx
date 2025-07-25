
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        {mode === 'create' && vehicle ? (
          <FleetLoanForm
            vehicle={vehicle}
            onSubmit={handleLoanSubmit}
            onCancel={onClose}
          />
        ) : mode === 'edit' && reservation && reservation.fleet_vehicles ? (
          <FleetLoanForm
            vehicle={createCompleteVehicle(reservation.fleet_vehicles)}
            onSubmit={handleLoanSubmit}
            onCancel={onClose}
            defaultValues={reservation}
          />
        ) : mode === 'view' && reservation && reservation.fleet_vehicles ? (
          <FleetLoanForm
            vehicle={createCompleteVehicle(reservation.fleet_vehicles)}
            onSubmit={handleLoanSubmit}
            onCancel={onClose}
            defaultValues={reservation}
            isViewMode={true}
          />
        ) : mode === 'return' && reservation && reservation.fleet_vehicles ? (
          <FleetReturnForm
            vehicle={createCompleteVehicle(reservation.fleet_vehicles)}
            reservationId={reservation.id}
            onSubmit={handleReturnSubmit}
            onCancel={onClose}
          />
        ) : mode === 'view_return' && reservation && reservation.fleet_vehicles ? (
          <FleetReturnForm
            vehicle={createCompleteVehicle(reservation.fleet_vehicles)}
            reservationId={reservation.id}
            onSubmit={handleReturnSubmit}
            onCancel={onClose}
            isViewMode={true}
          />
        ) : (
          <div className="p-4">
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FleetLoanDialog;
