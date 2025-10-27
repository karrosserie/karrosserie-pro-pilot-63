
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash, MoreVertical, Car, User, Clock, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAllVehiclesWorkTime } from '@/hooks/use-vehicle-work-time';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

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
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({
  vehicles,
  onViewVehicle,
  onEditVehicle,
  onDeleteVehicle
}) => {
  // Récupérer tous les temps de travail
  const { data: allWorkTimes = [] } = useAllVehiclesWorkTime();
  
  // Créer une map pour accès rapide
  const workTimeMap = useMemo(() => {
    if (!Array.isArray(allWorkTimes)) return new Map();
    return new Map(allWorkTimes.map(wt => [wt.vehicle_id, wt]));
  }, [allWorkTimes]);

  const getFirstImage = (vehicle: Vehicle) => {
    if (vehicle.vehicle_image_url) return vehicle.vehicle_image_url;
    
    if (vehicle.vehicle_images) {
      try {
        const parsed = Array.isArray(vehicle.vehicle_images) 
          ? vehicle.vehicle_images 
          : JSON.parse(vehicle.vehicle_images);
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Si c'est un tableau d'objets VehicleImageData, extraire l'URL
          if (typeof parsed[0] === 'object' && parsed[0].url) {
            return parsed[0].url;
          }
          // Si c'est un tableau de strings (ancienne structure), retourner tel quel
          return typeof parsed[0] === 'string' ? parsed[0] : null;
        }
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
        const workTimeData = workTimeMap.get(vehicle.id);
        
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
              
              {/* Affichage du temps de travail */}
              {workTimeData && workTimeData.current_total_minutes > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className={cn(
                      "font-medium",
                      workTimeData.is_currently_working && "text-green-600 animate-pulse"
                    )}>
                      {workTimeData.formatted_duration}
                    </span>
                    {workTimeData.is_currently_working && (
                      <Badge className="bg-green-500 text-white hover:bg-green-600">
                        En cours
                      </Badge>
                    )}
                  </div>
                  
                  {/* Alerte si le temps dépasse 8h */}
                  {workTimeData.current_total_minutes > 480 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Temps de travail élevé ({Math.floor(workTimeData.current_total_minutes / 60)}h)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-100 mt-4 pt-3">
              <div className="flex flex-wrap gap-2 justify-center">
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
                  className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700" 
                  onClick={() => onDeleteVehicle(vehicle.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VehiclesGrid;
