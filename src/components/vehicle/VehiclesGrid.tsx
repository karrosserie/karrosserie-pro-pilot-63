
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Trash, Car, User, Clock, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAllVehiclesWorkTime } from '@/hooks/use-vehicle-work-time';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 30;

interface Vehicle {
  id: string;
  license_plate?: string;
  vin?: string;
  year?: number;
  color?: string;
  mileage?: number;
  client_id?: string;
  vehicle_image_url?: string;
  vehicle_images?: any;
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
  const [currentPage, setCurrentPage] = useState(1);
  
  // Récupérer tous les temps de travail
  const { data: allWorkTimes = [] } = useAllVehiclesWorkTime();
  
  // Créer une map pour accès rapide
  const workTimeMap = useMemo(() => {
    if (!Array.isArray(allWorkTimes)) return new Map();
    return new Map(allWorkTimes.map(wt => [wt.vehicle_id, wt]));
  }, [allWorkTimes]);

  // Pagination
  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when vehicles change
  useEffect(() => {
    setCurrentPage(1);
  }, [vehicles.length]);

  const getFirstImage = (vehicle: Vehicle) => {
    if (vehicle.vehicle_image_url) return vehicle.vehicle_image_url;
    
    if (vehicle.vehicle_images) {
      try {
        const parsed = Array.isArray(vehicle.vehicle_images) 
          ? vehicle.vehicle_images 
          : JSON.parse(vehicle.vehicle_images);
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof parsed[0] === 'object' && parsed[0].url) {
            return parsed[0].url;
          }
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
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {paginatedVehicles.map((vehicle) => {
          const firstImage = getFirstImage(vehicle);
          const hasRegistration = hasCompleteRegistration(vehicle);
          const workTimeData = workTimeMap.get(vehicle.id);
          
          return (
            <div key={vehicle.id} className="card-container flex flex-col h-full animate-fade-in p-3 sm:p-4">
              <div className="relative h-32 sm:h-40 bg-gray-100 rounded-lg mb-3 sm:mb-4 overflow-hidden">
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
                    
                    {workTimeData.current_total_minutes > 480 && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Temps de travail élevé ({Math.floor(workTimeData.current_total_minutes / 60)}h)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 mt-3 sm:mt-4 pt-3">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={() => onViewVehicle(vehicle)} className="h-8 px-2 sm:px-3">
                    <Eye className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Voir</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEditVehicle(vehicle)} className="h-8 px-2 sm:px-3">
                    <Pencil className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Modifier</span>
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    className="h-8 px-2 sm:px-3 text-red-500 hover:text-red-700 border-red-500 hover:border-red-700" 
                    onClick={() => onDeleteVehicle(vehicle.id)}
                  >
                    <Trash className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Supprimer</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 border border-border rounded-lg bg-muted/30">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {vehicles.length} véhicule{vehicles.length > 1 ? 's' : ''} au total
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2 sm:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Précédent</span>
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground px-1 sm:px-2">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2 sm:px-3"
            >
              <span className="hidden sm:inline mr-1">Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesGrid;
