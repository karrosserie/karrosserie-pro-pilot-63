
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash2, MoreVertical, FileText, Receipt } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Vehicle {
  id: string;
  license_plate?: string;
  vin?: string;
  year?: number;
  color?: string;
  mileage?: number;
  client_id?: string;
  car_brands?: {
    id: string;
    name: string;
  };
  car_models?: {
    id: string;
    name: string;
  };
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface VehiclesGridProps {
  vehicles: Vehicle[];
  onViewVehicle: (vehicle: Vehicle) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onCreateQuote?: (vehicle: Vehicle) => void;
  onCreateInvoice?: (vehicle: Vehicle) => void;
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  vehicles,
  onViewVehicle,
  onEditVehicle,
  onDeleteVehicle,
  onCreateQuote,
  onCreateInvoice
}) => {
  const handleCreateQuote = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Creating quote for vehicle:', vehicle);
    onCreateQuote?.(vehicle);
  };

  const handleCreateInvoice = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Creating invoice for vehicle:', vehicle);
    onCreateInvoice?.(vehicle);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">
                {vehicle.car_brands?.name} {vehicle.car_models?.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg z-50">
                  <DropdownMenuItem onClick={(e) => handleCreateQuote(e, vehicle)} className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Créer un devis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => handleCreateInvoice(e, vehicle)} className="cursor-pointer">
                    <Receipt className="h-4 w-4 mr-2" />
                    Créer une facture
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-sm text-gray-600">
              {vehicle.clients?.first_name} {vehicle.clients?.last_name}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Plaque:</span>
                <Badge variant="outline">{vehicle.license_plate}</Badge>
              </div>
              {vehicle.year && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Année:</span>
                  <span className="text-sm">{vehicle.year}</span>
                </div>
              )}
              {vehicle.color && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Couleur:</span>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2 border" 
                      style={{ backgroundColor: vehicle.color }} 
                    />
                    <span className="text-sm">{vehicle.color}</span>
                  </div>
                </div>
              )}
              {vehicle.mileage && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Kilométrage:</span>
                  <span className="text-sm">{vehicle.mileage.toLocaleString()} km</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => onViewVehicle(vehicle)}>
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEditVehicle(vehicle)}>
                <Pencil className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700" 
                onClick={() => onDeleteVehicle(vehicle.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VehiclesGrid;
