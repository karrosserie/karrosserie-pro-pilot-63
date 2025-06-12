
import React from 'react';
import VehicleCard from './VehicleCard';
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
        <VehicleCard
          key={vehicle.id}
          id={vehicle.id}
          vin={vehicle.vin}
          licensePlate={vehicle.license_plate}
          brand={vehicle.car_brands?.name || 'Marque non définie'}
          model={vehicle.car_models?.name || 'Modèle non défini'}
          year={vehicle.year}
          color={vehicle.color}
          status={vehicle.status as "En attente" | "Réservé" | "En cours" | "Terminé" | "Annulé"}
          clientName={vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Client non défini'}
          onView={() => onViewVehicle(vehicle)}
          onEdit={() => onEditVehicle(vehicle)}
          onDelete={() => onDeleteVehicle(vehicle.id)}
        />
      ))}
    </div>
  );
};

export default VehiclesGrid;
