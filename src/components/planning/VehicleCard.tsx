import React from 'react';
import { Clock, User, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/planning';
import { usePlanning } from '@/contexts/PlanningContext';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { actions } = usePlanning();

  const handleSchedule = () => {
    actions.scheduleVehicle(vehicle.id);
  };

  const handleOpenScheduleModal = () => {
    actions.openScheduleModal(vehicle);
  };

  const handleOpenDetail = () => {
    actions.openVehicleDetailModal(vehicle);
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleOpenDetail}
    >
      <div className="space-y-3">
        {/* Vehicle Info */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</h4>
            <p className="text-sm text-gray-500">{vehicle.plate}</p>
            <p className="text-sm text-gray-500">{vehicle.client}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-green-600">{vehicle.price}€</div>
            <div className="text-sm text-gray-500">{vehicle.duration}h</div>
          </div>
        </div>
        
        {/* Status */}
        <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-800" 
             onClick={(e) => {
               e.stopPropagation();
               handleOpenScheduleModal();
             }}>
          {vehicle.status}
        </div>
        
        {/* Technician */}
        {vehicle.technician && (
          <div className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-800"
               onClick={(e) => {
                 e.stopPropagation();
                 handleOpenScheduleModal();
               }}>
            <User className="w-3 h-3 mr-1" />
            {vehicle.technician}
          </div>
        )}
        
        {/* Status Badge and Actions */}
        <div className="flex items-center justify-between">
          {vehicle.inProgress ? (
            <Badge variant="default" className="bg-blue-600 text-white">
              En cours
            </Badge>
          ) : (
            <span className="text-sm text-gray-500">À planifier</span>
          )}
          
          {!vehicle.inProgress && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                handleSchedule();
              }}
              className="text-xs"
            >
              <Calendar className="w-3 h-3 mr-1" />
              Planifier
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;