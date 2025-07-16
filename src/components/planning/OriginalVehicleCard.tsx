import React from 'react';
import { User, Calendar } from 'lucide-react';
import { usePlanningContext, Vehicle } from '@/contexts/OriginalPlanningContext';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { setSelectedVehicle, setShowVehicleModal } = usePlanningContext();

  const handleVehicleClick = () => {
    setSelectedVehicle(vehicle);
    setShowVehicleModal(true);
  };

  const handlePlanifierClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle planifier action
    console.log('Planifier vehicle:', vehicle.id);
  };

  return (
    <div 
      className="bg-white p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleVehicleClick}
    >
      <div className="space-y-3">
        {/* Vehicle title and details */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h4>
            <div className="text-sm text-gray-600">{vehicle.plate}</div>
            <div className="text-sm text-gray-600">{vehicle.client}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-green-600">{vehicle.price}€</div>
            <div className="text-sm text-gray-500">{vehicle.duration}</div>
          </div>
        </div>

        {/* Status */}
        <div className="text-sm text-blue-600">
          {vehicle.status}
        </div>

        {/* Technician */}
        {vehicle.technician && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <User className="w-3 h-3" />
            {vehicle.technician}
          </div>
        )}

        {/* Status badge and action button */}
        <div className="flex items-center justify-between">
          {vehicle.inProgress ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              En cours
            </span>
          ) : (
            <span className="text-sm text-gray-500">À planifier</span>
          )}
          
          {!vehicle.inProgress && (
            <button
              onClick={handlePlanifierClick}
              className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              <Calendar className="w-3 h-3" />
              Planifier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;