
import React from 'react';
import { useVehicles } from '@/hooks/use-vehicles';
import VehicleCard from '@/components/vehicle/VehicleCard';
import { Car } from 'lucide-react';

interface ClientVehiclesTabProps {
  clientId: string;
}

const ClientVehiclesTab: React.FC<ClientVehiclesTabProps> = ({ clientId }) => {
  const { vehicles, isLoading } = useVehicles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientVehicles = vehicles?.filter(vehicle => vehicle.client_id === clientId) || [];

  if (clientVehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun véhicule</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de véhicule enregistré.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clientVehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          brand={vehicle.car_brands?.name || 'Marque inconnue'}
          model={vehicle.car_models?.name || 'Modèle inconnu'}
          year={vehicle.year || 0}
          licensePlate={vehicle.license_plate}
          status={vehicle.status as any}
          owner={vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Client inconnu'}
          imageUrl={vehicle.image_url}
          vehicleImages={vehicle.vehicle_images}
          registrationDocumentFrontUrl={vehicle.registration_document_front_url}
          registrationDocumentBackUrl={vehicle.registration_document_back_url}
        />
      ))}
    </div>
  );
};

export default ClientVehiclesTab;
