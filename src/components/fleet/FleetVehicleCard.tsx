
import React from 'react';
import { Car, Eye, Pencil, Trash, Calendar, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

interface FleetVehicleCardProps {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  year?: number;
  color?: string;
  mileage?: number;
  fuelType?: string;
  status: string;
  dailyRate?: number;
  notes?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReserve?: () => void;
}

const FleetVehicleCard: React.FC<FleetVehicleCardProps> = ({
  brand,
  model,
  licensePlate,
  year,
  color,
  mileage,
  fuelType,
  status,
  dailyRate,
  onView,
  onEdit,
  onDelete,
  onReserve
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      case 'rented':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'out_of_service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'reserved':
        return 'Réservé';
      case 'rented':
        return 'Loué';
      case 'maintenance':
        return 'En maintenance';
      case 'out_of_service':
        return 'Hors service';
      default:
        return status;
    }
  };

  return (
    <div className="card-container flex flex-col h-full animate-fade-in">
      <div className="relative h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <div className="flex items-center justify-center h-full text-gray-400">
          <Car className="h-16 w-16" />
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-lg">{brand} {model}</h3>
        
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <Car className="h-4 w-4 mr-1" />
          <span>{licensePlate}</span>
        </div>
        
        {year && (
          <div className="mt-1 text-sm text-gray-600">
            <span>Année: {year}</span>
          </div>
        )}
        
        {color && (
          <div className="mt-1 text-sm text-gray-600">
            <span>Couleur: {color}</span>
          </div>
        )}
        
        {mileage && (
          <div className="mt-1 text-sm text-gray-600">
            <span>Kilométrage: {mileage.toLocaleString()} km</span>
          </div>
        )}
        
        {fuelType && (
          <div className="mt-1 text-sm text-gray-600">
            <span>Carburant: {fuelType}</span>
          </div>
        )}
        
        {dailyRate && (
          <div className="mt-2 flex items-center text-sm font-medium text-green-600">
            <Euro className="h-4 w-4 mr-1" />
            <span>{dailyRate}€/jour</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between space-x-1">
        <div className="flex space-x-1">
          {onView && (
            <Button variant="ghost" size="icon" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-red-500 hover:text-red-700" 
              onClick={onDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {onReserve && status === 'available' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onReserve}
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            Réserver
          </Button>
        )}
      </div>
    </div>
  );
};

export default FleetVehicleCard;
