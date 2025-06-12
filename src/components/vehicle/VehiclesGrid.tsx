
import React from 'react';
import VehicleCardAdapter from './VehicleCardAdapter';
import { Vehicle } from '@/services/supabase/vehicles';

interface VehiclesGridProps {
  vehicles: Vehicle[];
  onViewVehicle: (vehicle: Vehicle) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  vehicles,
  onViewVehicle,
  onEditVehicle,
  onDeleteVehicle
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCardAdapter
          key={vehicle.id}
          vehicle={vehicle}
          onView={() => onViewVehicle(vehicle)}
          onEdit={() => onEditVehicle(vehicle)}
          onDelete={() => onDeleteVehicle(vehicle.id)}
        />
      ))}
    </div>
  );
};

export default VehiclesGrid;
