
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash, MoreVertical, FileText, Receipt, Car, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';

interface Vehicle {
  id: string;
  license_plate?: string;
  vin?: string;
  year?: number;
  color?: string;
  mileage?: number;
  client_id?: string;
  vehicle_image_url?: string;
  vehicle_images?: any; // Changed from string to any to match Json type
  registration_document_front_url?: string;
  registration_document_back_url?: string;
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

  const getFirstImage = (vehicle: Vehicle) => {
    if (vehicle.vehicle_image_url) return vehicle.vehicle_image_url;
    
    if (vehicle.vehicle_images) {
      try {
        const parsed = Array.isArray(vehicle.vehicle_images) 
          ? vehicle.vehicle_images 
          : JSON.parse(vehicle.vehicle_images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
      } catch {
        return null;
      }
    }
    
    return null;
  };

  const hasCompleteRegistration = (vehicle: Vehicle) => {
    return vehicle.registration_document_front_url && 
           vehicle.registration_document_front_url.trim() !== '' && 
           vehicle.registration_document_back_url && 
           vehicle.registration_document_back_url.trim() !== '';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => {
        const firstImage = getFirstImage(vehicle);
        const hasRegistration = hasCompleteRegistration(vehicle);
        
        return (
          <div key={vehicle.id} className="card-container flex flex-col h-full animate-fade-in">
            <div className="relative h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden">
              {firstImage ? (
                <img 
                  src={firstImage} 
                  alt={`${vehicle.car_brands?.name} ${vehicle.car_models?.name}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Car className="h-12 w-12" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  En attente
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg">
                {vehicle.car_brands?.name} {vehicle.car_models?.name}
              </h3>
              
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Car className="h-4 w-4 mr-1" />
                <span>{vehicle.license_plate}</span>
              </div>
              
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>Client: {vehicle.clients?.first_name} {vehicle.clients?.last_name}</span>
              </div>
              
              <div className="mt-2">
                <StatusBadge 
                  status={hasRegistration ? "Certificat d'immatriculation importé" : "Pas de certificat d'immatriculation"}
                  className={hasRegistration ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
                />
              </div>
            </div>
            
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={() => onViewVehicle(vehicle)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEditVehicle(vehicle)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-red-500 hover:text-red-700" 
                  onClick={() => onDeleteVehicle(vehicle.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg z-50" align="end">
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
          </div>
        );
      })}
    </div>
  );
};

export default VehiclesGrid;
