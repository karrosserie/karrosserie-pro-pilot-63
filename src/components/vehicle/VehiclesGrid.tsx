
import React from 'react';
import VehicleCard from '@/components/vehicle/VehicleCard';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  vehicle_images?: string | string[];
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
  // Helper function to convert vehicle_images to string array
  const convertToImageArray = (images?: string | string[]): string[] => {
    if (!images) return [];
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [images];
      } catch {
        return [images];
      }
    }
    return Array.isArray(images) ? images : [];
  };

  // Transform vehicles data for VehicleCard component
  const vehicleCardsData = vehicles.map(vehicle => ({
    id: vehicle.id,
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    licensePlate: vehicle.license_plate || '',
    status: 'En attente' as 'En réparation' | 'Terminé' | 'En attente' | 'Diagnostic', // Default status since not in database
    owner: vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Non assigné',
    vehicleImages: convertToImageArray(vehicle.vehicle_images),
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
          vehicleImages={vehicle.vehicleImages}
          onView={vehicle.onView}
          onEdit={vehicle.onEdit}
          onDelete={vehicle.onDelete}
        />
      ))}
    </div>
  );
};

export default VehiclesGrid;
