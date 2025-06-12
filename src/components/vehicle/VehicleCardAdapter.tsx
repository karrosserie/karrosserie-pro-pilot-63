
import React from 'react';
import VehicleCard from './VehicleCard';
import { Vehicle } from '@/services/supabase/vehicles';

interface VehicleCardAdapterProps {
  vehicle: Vehicle;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const VehicleCardAdapter: React.FC<VehicleCardAdapterProps> = ({
  vehicle,
  onView,
  onEdit,
  onDelete
}) => {
  // Helper function to safely parse vehicle images
  const parseVehicleImages = (images: any): string[] => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const vehicleImages = parseVehicleImages(vehicle.vehicle_images);

  return (
    <VehicleCard
      brand={vehicle.car_brands?.name || 'Marque non définie'}
      model={vehicle.car_models?.name || 'Modèle non défini'}
      year={vehicle.year}
      licensePlate={vehicle.license_plate}
      status={vehicle.status as "En attente" | "Réservé" | "En cours" | "Terminé" | "Annulé"}
      owner={vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Client non défini'}
      imageUrl={vehicleImages[0]}
      vehicleImages={vehicleImages}
      registrationDocumentFrontUrl={vehicle.registration_document_front_url}
      registrationDocumentBackUrl={vehicle.registration_document_back_url}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default VehicleCardAdapter;
