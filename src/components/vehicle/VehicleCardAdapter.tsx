
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
  return (
    <VehicleCard
      brand={vehicle.car_brands?.name || 'Marque non définie'}
      model={vehicle.car_models?.name || 'Modèle non défini'}
      year={vehicle.year}
      licensePlate={vehicle.license_plate}
      status={vehicle.status as "En attente" | "Réservé" | "En cours" | "Terminé" | "Annulé"}
      owner={vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Client non défini'}
      imageUrl={vehicle.vehicle_images?.[0]}
      vehicleImages={vehicle.vehicle_images}
      registrationDocumentFrontUrl={vehicle.registration_document_front_url}
      registrationDocumentBackUrl={vehicle.registration_document_back_url}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default VehicleCardAdapter;
