
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Edit, Calendar, Fuel } from 'lucide-react';

interface FleetVehicleCardProps {
  vehicle: any;
  onEdit: () => void;
  onReserve: () => void;
}

const FleetVehicleCard: React.FC<FleetVehicleCardProps> = ({
  vehicle,
  onEdit,
  onReserve
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Réservé':
        return 'bg-blue-100 text-blue-800';
      case 'En maintenance':
        return 'bg-amber-100 text-amber-800';
      case 'Indisponible':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5" />
            {vehicle.brand} {vehicle.model}
          </CardTitle>
          <Badge className={getStatusColor(vehicle.status || 'Disponible')}>
            {vehicle.status || 'Disponible'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600">
          <p><span className="font-medium">Plaque:</span> {vehicle.license_plate}</p>
          <p><span className="font-medium">Année:</span> {vehicle.year}</p>
          {vehicle.fuel_type && (
            <p className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              {vehicle.fuel_type}
            </p>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Modifier
          </Button>
          <Button 
            size="sm" 
            onClick={onReserve} 
            className="flex-1"
            disabled={vehicle.status === 'Réservé' || vehicle.status === 'Indisponible'}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Réserver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetVehicleCard;
