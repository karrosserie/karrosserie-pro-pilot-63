
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, Eye, Edit, Trash2 } from 'lucide-react';

interface Vehicle {
  id: string;
  license_plate: string | null;
  year: number | null;
  color: string | null;
  vin: string | null;
  mileage: number | null;
  fuel_type: string | null;
  status: string | null;
  car_brands?: {
    name: string;
  };
  car_models?: {
    name: string;
  };
  clients?: {
    first_name: string;
    last_name: string;
  };
}

interface VehiclesGridProps {
  vehicles: Vehicle[];
  onViewVehicle: (vehicle: Vehicle) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicle: Vehicle) => void;
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  vehicles,
  onViewVehicle,
  onEditVehicle,
  onDeleteVehicle
}) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Réservé':
        return 'bg-blue-100 text-blue-800';
      case 'En cours':
        return 'bg-orange-100 text-orange-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  {vehicle.car_brands?.name || 'Marque inconnue'} {vehicle.car_models?.name || 'Modèle inconnu'}
                </CardTitle>
              </div>
              <Badge className={getStatusColor(vehicle.status)}>
                {vehicle.status || 'En attente'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Immatriculation:</span>
                <span className="font-medium">{vehicle.license_plate || 'Non renseignée'}</span>
              </div>
              
              {vehicle.year && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Année:</span>
                  <span className="font-medium">{vehicle.year}</span>
                </div>
              )}
              
              {vehicle.color && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Couleur:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border" 
                      style={{ backgroundColor: vehicle.color }}
                    />
                    <span className="font-medium">{vehicle.color}</span>
                  </div>
                </div>
              )}
              
              {vehicle.clients && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-medium">
                    {vehicle.clients.first_name} {vehicle.clients.last_name}
                  </span>
                </div>
              )}
              
              {vehicle.mileage && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Kilométrage:</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onViewVehicle(vehicle)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEditVehicle(vehicle)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteVehicle(vehicle)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehiclesGrid;
