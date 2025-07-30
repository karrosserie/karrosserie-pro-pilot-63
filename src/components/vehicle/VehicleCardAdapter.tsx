
import React from 'react';
import VehicleCard from './VehicleCard';
import { Vehicle } from '@/services/supabase/vehicles';

interface VehicleCardAdapterProps {
  vehicle: Vehicle;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateQuote?: () => void;
  onCreateInvoice?: () => void;
}

const VehicleCardAdapter: React.FC<VehicleCardAdapterProps> = ({
  vehicle,
  onView,
  onEdit,
  onDelete,
  onCreateQuote,
  onCreateInvoice
}) => {
  // Helper function to safely parse vehicle images
  const parseVehicleImages = (images: any): string[] => {
    if (!images) return [];
    if (Array.isArray(images)) {
      // Si c'est déjà un tableau d'objets VehicleImageData, extraire les URLs
      if (images.length > 0 && typeof images[0] === 'object' && images[0].url) {
        return images.map((img: any) => img.url).filter((url: string) => url && url.trim() !== '');
      }
      // Si c'est un tableau de strings (ancienne structure), retourner tel quel
      return images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
    }
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return parseVehicleImages(parsed);
      } catch {
        return [];
      }
    }
    return [];
  };

  const vehicleImages = parseVehicleImages(vehicle.vehicle_images);
  console.log('DEBUG - vehicle.vehicle_images:', vehicle.vehicle_images);
  console.log('DEBUG - parsed vehicleImages:', vehicleImages);

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
      onCreateQuote={onCreateQuote}
      onCreateInvoice={onCreateInvoice}
    />
  );
};

export default VehicleCardAdapter;
