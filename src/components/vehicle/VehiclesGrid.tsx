
import React from 'react';
import VehicleCard from '@/components/vehicle/VehicleCard';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  status?: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
}

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
  // Transform vehicles data for VehicleCard component
  const vehicleCardsData = vehicles.map(vehicle => ({
    id: vehicle.id,
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    licensePlate: vehicle.license_plate || '',
    status: (vehicle.status || 'En attente') as 'En réparation' | 'Terminé' | 'En attente' | 'Diagnostic',
    owner: vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Non assigné',
    onView: () => onViewVehicle(vehicle),
    onEdit: () => onEditVehicle(vehicle),
    onDelete: () => onDeleteVehicle(vehicle.id)
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicleCardsData.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          brand={vehicle.brand}
          model={vehicle.model}
          year={vehicle.year}
          licensePlate={vehicle.licensePlate}
          status={vehicle.status}
          owner={vehicle.owner}
          onView={vehicle.onView}
          onEdit={vehicle.onEdit}
          onDelete={vehicle.onDelete}
        />
      ))}
    </div>
  );
};

export default VehiclesGrid;
