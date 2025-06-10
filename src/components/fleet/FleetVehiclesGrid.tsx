
import React from 'react';
import FleetVehicleCard from './FleetVehicleCard';

interface FleetVehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year?: number;
  color?: string;
  mileage?: number;
  fuel_type?: string;
  status: string;
  daily_rate?: number;
  notes?: string;
}

interface FleetVehiclesGridProps {
  vehicles: FleetVehicle[];
  onViewVehicle: (vehicle: FleetVehicle) => void;
  onEditVehicle: (vehicle: FleetVehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onReserveVehicle: (vehicle: FleetVehicle) => void;
}

const FleetVehiclesGrid: React.FC<FleetVehiclesGridProps> = ({
  vehicles,
  onViewVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onReserveVehicle
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <FleetVehicleCard
          key={vehicle.id}
          id={vehicle.id}
          brand={vehicle.brand}
          model={vehicle.model}
          licensePlate={vehicle.license_plate}
          year={vehicle.year}
          color={vehicle.color}
          mileage={vehicle.mileage}
          fuelType={vehicle.fuel_type}
          status={vehicle.status}
          dailyRate={vehicle.daily_rate}
          notes={vehicle.notes}
          onView={() => onViewVehicle(vehicle)}
          onEdit={() => onEditVehicle(vehicle)}
          onDelete={() => onDeleteVehicle(vehicle.id)}
          onReserve={() => onReserveVehicle(vehicle)}
        />
      ))}
    </div>
  );
};

export default FleetVehiclesGrid;
