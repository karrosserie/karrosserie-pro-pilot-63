import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Calendar, Pencil, HandCoins } from 'lucide-react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface FleetVehiclesMobileCardProps {
  vehicle: FleetVehicle;
  onViewVehicle: (vehicle: FleetVehicle) => void;
  onEditVehicle: (vehicle: FleetVehicle) => void;
  onLendVehicle: (vehicle: FleetVehicle) => void;
}

export const FleetVehiclesMobileCard = ({ 
  vehicle, 
  onViewVehicle, 
  onEditVehicle, 
  onLendVehicle 
}: FleetVehiclesMobileCardProps) => {
  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Car className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-card-foreground">
              {vehicle.car_brands?.name} {vehicle.car_models?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehicle.license_plate}
            </p>
          </div>
        </div>
        <span 
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            vehicle.status === 'Disponible' 
              ? 'bg-green-100 text-green-800' 
              : vehicle.status === 'En prêt'
              ? 'bg-amber-100 text-amber-800'
              : vehicle.status === 'En maintenance'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {vehicle.status || 'Disponible'}
        </span>
      </div>

      {vehicle.year && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Année: {vehicle.year}</span>
        </div>
      )}

      <div className="flex space-x-2 pt-2">
        {vehicle.status === 'Disponible' && (
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
            onClick={() => onLendVehicle(vehicle)}
          >
            <HandCoins className="h-4 w-4 mr-1" />
            Prêter
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={() => onEditVehicle(vehicle)}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Modifier
        </Button>
      </div>
    </div>
  );
};