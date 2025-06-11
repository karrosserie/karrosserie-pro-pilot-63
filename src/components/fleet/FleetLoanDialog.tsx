
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FleetLoanForm, { LoanFormData } from './FleetLoanForm';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useFleetReservation } from '@/hooks/use-fleet-reservations';

interface FleetLoanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: FleetVehicle | null;
  loanId: string | null;
  mode: 'create' | 'edit' | 'view' | 'return';
  onSubmit: (loanData: LoanFormData) => void;
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

  const handleSubmit = (loanData: LoanFormData) => {
    onSubmit(loanData);
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
      default:
        return 'Prêt de véhicule';
    }
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
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        ) : mode === 'edit' && reservation && reservation.fleet_vehicles ? (
          <FleetLoanForm
            vehicle={reservation.fleet_vehicles}
            reservation={reservation}
            onSubmit={handleSubmit}
            onCancel={onClose}
            mode="edit"
          />
        ) : mode === 'view' && reservation && reservation.fleet_vehicles ? (
          <FleetLoanForm
            vehicle={reservation.fleet_vehicles}
            reservation={reservation}
            onSubmit={handleSubmit}
            onCancel={onClose}
            mode="view"
          />
        ) : mode === 'return' && reservation ? (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Formulaire de retour de véhicule</h3>
            <p className="text-gray-600 mb-4">Prêt: {reservation.id}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">État du véhicule au retour</label>
                <textarea 
                  className="w-full p-2 border rounded-md"
                  placeholder="Décrivez l'état du véhicule..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kilométrage de retour</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Kilométrage..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    console.log('Retour validé pour le prêt:', loanId);
                    onClose();
                  }}
                  className="px-4 py-2 bg-karrosserie-orange text-white rounded-md hover:bg-karrosserie-orange/90"
                >
                  Valider le retour
                </button>
              </div>
            </div>
          </div>
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
