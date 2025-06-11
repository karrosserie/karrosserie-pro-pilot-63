
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
        ) : mode === 'view' ? (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Détails du prêt</h3>
            <p className="text-gray-600 mb-4">ID du prêt: {loanId}</p>
            <div className="space-y-2">
              <p><strong>Véhicule:</strong> {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Information du prêt'}</p>
              <p><strong>Statut:</strong> En cours</p>
              <p><strong>Date de début:</strong> Exemple date</p>
              <p><strong>Date de retour prévue:</strong> Exemple date</p>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={onClose}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : mode === 'edit' ? (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Modifier le prêt</h3>
            <p className="text-gray-600 mb-4">ID du prêt: {loanId}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date de retour prévue</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea 
                  className="w-full p-2 border rounded-md"
                  placeholder="Notes sur le prêt..."
                  rows={3}
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
                    console.log('Prêt modifié:', loanId);
                    onClose();
                  }}
                  className="px-4 py-2 bg-karrosserie-orange text-white rounded-md hover:bg-karrosserie-orange/90"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        ) : mode === 'return' ? (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Formulaire de retour de véhicule</h3>
            <p className="text-gray-600 mb-4">ID du prêt: {loanId}</p>
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
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default FleetLoanDialog;
