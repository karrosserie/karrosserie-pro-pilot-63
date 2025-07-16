import React from 'react';
import { X, Clock, AlertTriangle, Wrench, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlanning } from '@/contexts/PlanningContext';

const WaitingVehiclesModal: React.FC = () => {
  const { state, actions } = usePlanning();
  const { isWaitingVehiclesModalOpen } = state;

  const waitingVehicles = state.steps.flatMap(step => 
    step.vehicles.filter(vehicle => !vehicle.inProgress)
  );

  const waitingReasons = {
    parts: waitingVehicles.filter((_, i) => i % 3 === 0).length,
    approvals: waitingVehicles.filter((_, i) => i % 3 === 1).length,
    technicians: waitingVehicles.filter((_, i) => i % 3 === 2).length,
  };

  const handleClose = () => {
    actions.closeWaitingVehiclesModal();
  };

  return (
    <Dialog open={isWaitingVehiclesModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Véhicules en attente
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-800 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{waitingVehicles.length} véhicules en attente</span>
            </div>
            <div className="text-sm text-orange-700 flex gap-4">
              <span>Pièces: {waitingReasons.parts}</span>
              <span>Approbations: {waitingReasons.approvals}</span>
              <span>Techniciens: {waitingReasons.technicians}</span>
            </div>
          </div>

          {/* Waiting vehicles list */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Liste des véhicules</h3>
            {waitingVehicles.map((vehicle, index) => {
              const reasonIndex = index % 3;
              const reason = reasonIndex === 0 ? 'Pièces manquantes' : 
                           reasonIndex === 1 ? 'Approbation en attente' : 
                           'Technicien non assigné';
              const reasonIcon = reasonIndex === 0 ? Wrench : 
                               reasonIndex === 1 ? Clock : User;
              const ReasonIcon = reasonIcon;

              return (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{vehicle.brand} {vehicle.model}</h4>
                        <Badge variant="secondary">{vehicle.plate}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{vehicle.client}</p>
                      <p className="text-sm text-gray-600 mb-2">{vehicle.status}</p>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <ReasonIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-700">{reason}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{vehicle.price}€</div>
                      <div className="text-sm text-gray-500">{vehicle.duration}h</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        actions.openScheduleModal(vehicle);
                        handleClose();
                      }}
                    >
                      Planifier
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        actions.openVehicleDetailModal(vehicle);
                        handleClose();
                      }}
                    >
                      Détails
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitingVehiclesModal;