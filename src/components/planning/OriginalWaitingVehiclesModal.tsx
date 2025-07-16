import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { usePlanningContext } from '@/contexts/OriginalPlanningContext';

const WaitingVehiclesModal: React.FC = () => {
  const { showWaitingModal, setShowWaitingModal, steps } = usePlanningContext();

  if (!showWaitingModal) return null;

  const waitingVehicles = steps.flatMap(step => 
    step.vehicles.filter(vehicle => !vehicle.inProgress)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Véhicules en attente</h2>
          </div>
          <button 
            onClick={() => setShowWaitingModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="text-sm text-gray-600 mb-4">
            <strong>{waitingVehicles.length} véhicules</strong> nécessitent une attention
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
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
                    <button className="mt-1 px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50">
                      Planifier
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-3 mt-3 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Pièces: 2</span>
              <span>Approbations: 1</span>
              <span>Techniciens: 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingVehiclesModal;