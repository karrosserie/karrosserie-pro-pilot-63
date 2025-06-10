
import React from 'react';
import VehicleCard from '@/components/vehicle/VehicleCard';
import type { Database } from '@/integrations/supabase/types';
import { VehicleStatus } from '@/types/vehicle';

// Use the actual Supabase type for vehicles
type VehicleRow = Database['public']['Tables']['vehicles']['Row'];

interface Vehicle extends VehicleRow {
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
  const convertToImageArray = (images?: any): string[] => {
    if (!images) return [];
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [images];
      } catch {
        return [images];
      }
    }
    if (Array.isArray(images)) {
      return images.filter(img => typeof img === 'string');
    }
    return [];
  };

  // Helper function to ensure valid vehicle status
  const getValidStatus = (status?: string): VehicleStatus => {
    const validStatuses: VehicleStatus[] = ['En attente', 'Réservé', 'En cours', 'Terminé', 'Annulé'];
    if (status && validStatuses.includes(status as VehicleStatus)) {
      return status as VehicleStatus;
    }
    return 'En attente'; // Default status
  };

  // Transform vehicles data for VehicleCard component
  const vehicleCardsData = vehicles.map(vehicle => ({
    id: vehicle.id,
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    licensePlate: vehicle.license_plate || '',
    status: getValidStatus(vehicle.status),
    owner: vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Non assigné',
    vehicleImages: convertToImageArray(vehicle.vehicle_images),
    registrationDocumentFrontUrl: vehicle.registration_document_front_url,
    registrationDocumentBackUrl: vehicle.registration_document_back_url,
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
          registrationDocumentFrontUrl={vehicle.registrationDocumentFrontUrl}
          registrationDocumentBackUrl={vehicle.registrationDocumentBackUrl}
          onView={vehicle.onView}
          onEdit={vehicle.onEdit}
          onDelete={vehicle.onDelete}
        />
      ))}
    </div>
  );
};

export default VehiclesGrid;
