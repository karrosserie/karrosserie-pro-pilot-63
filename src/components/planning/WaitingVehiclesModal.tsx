import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePlanning } from '@/contexts/PlanningContext';

const WaitingVehiclesModal: React.FC = () => {
  const { state, actions } = usePlanning();
  const { isWaitingVehiclesModalOpen } = state;

  const waitingVehicles = state.steps.flatMap(step => 
    step.vehicles.filter(vehicle => !vehicle.inProgress)
  );

  const handleClose = () => {
    actions.closeWaitingVehiclesModal();
  };

  const handlePlanify = (vehicleId: string) => {
    const vehicle = waitingVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      actions.scheduleVehicle(vehicleId);
      handleClose();
    }
  };

  return (
    <Dialog open={isWaitingVehiclesModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Véhicules en attente</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="text-sm text-gray-600 mb-4">
            <strong>{waitingVehicles.length} véhicules</strong> nécessitent une attention :
          </div>
          
          {waitingVehicles.map((vehicle, index) => {
            const reasons = ['Pièces manquantes', 'Approbation client', 'Technicien disponible'];
            const reason = reasons[index % 3];
            
            return (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </div>
                  <div className="text-sm text-gray-600">{vehicle.plate} - {vehicle.client}</div>
                  <div className="text-xs text-orange-600 mt-1">{reason}</div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold text-green-600">{vehicle.price}€</div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePlanify(vehicle.id)}
                    className="mt-1 text-xs"
                  >
                    Planifier
                  </Button>
                </div>
              </div>
            );
          })}
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Pièces: {Math.floor(waitingVehicles.length / 3)}</span>
              <span>Approbations: {Math.floor(waitingVehicles.length / 3)}</span>
              <span>Techniciens: {waitingVehicles.length - 2 * Math.floor(waitingVehicles.length / 3)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitingVehiclesModal;