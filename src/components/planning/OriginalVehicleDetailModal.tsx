import React from 'react';
import { X, User, Phone, Calendar } from 'lucide-react';
import { usePlanningContext } from '@/contexts/OriginalPlanningContext';

const VehicleDetailModal: React.FC = () => {
  const { showVehicleModal, setShowVehicleModal, selectedVehicle } = usePlanningContext();

  if (!showVehicleModal || !selectedVehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedVehicle.brand} {selectedVehicle.model}
            </h2>
            <div className="text-sm text-gray-600">{selectedVehicle.plate} - {selectedVehicle.client}</div>
          </div>
          <button 
            onClick={() => setShowVehicleModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Vehicle info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">VIN:</span>
              <p className="font-medium">WBA3A5G50DNP26082</p>
            </div>
            <div>
              <span className="text-gray-500">Année:</span>
              <p className="font-medium">2020</p>
            </div>
            <div>
              <span className="text-gray-500">Kilométrage:</span>
              <p className="font-medium">45,230 km</p>
            </div>
            <div>
              <span className="text-gray-500">Arrivée:</span>
              <p className="font-medium">15/01/2024</p>
            </div>
          </div>

          {/* Status */}
          <div className="p-3 bg-gray-50 rounded border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Statut actuel</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                selectedVehicle.inProgress 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedVehicle.inProgress ? "En cours" : "En attente"}
              </span>
            </div>
            <p className="text-sm text-gray-600">{selectedVehicle.status}</p>
            
            {selectedVehicle.technician && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                <User className="w-3 h-3" />
                {selectedVehicle.technician}
              </div>
            )}
          </div>

          {/* Client info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>06 12 34 56 78</span>
            </div>
            <div>
              <span className="text-gray-500">Assurance:</span>
              <p className="font-medium">AXA Assurances</p>
            </div>
            <div>
              <span className="text-gray-500">Expert:</span>
              <p className="font-medium">M. Philippe Durand</p>
            </div>
          </div>

          {/* Cost */}
          <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
            <div>
              <div className="text-lg font-semibold text-green-600">{selectedVehicle.price}€</div>
              <div className="text-sm text-gray-600">Montant estimé</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{selectedVehicle.duration}</div>
              <div className="text-xs text-gray-500">Durée prévue</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-2 p-4 border-t border-gray-200">
          <button 
            onClick={() => setShowVehicleModal(false)}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Fermer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Calendar className="w-4 h-4" />
            Planifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;