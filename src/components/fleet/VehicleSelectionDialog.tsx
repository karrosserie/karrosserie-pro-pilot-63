
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Car } from 'lucide-react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface VehicleSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: FleetVehicle[];
  onVehicleSelect: (vehicle: FleetVehicle) => void;
}

const VehicleSelectionDialog: React.FC<VehicleSelectionDialogProps> = ({
  isOpen,
  onClose,
  vehicles,
  onVehicleSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter only available vehicles
  const availableVehicles = vehicles.filter(vehicle => 
    vehicle.status === 'Disponible' && 
    (vehicle.car_brands?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicle.car_models?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleVehicleSelect = (vehicle: FleetVehicle) => {
    onVehicleSelect(vehicle);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sélectionner un véhicule pour le prêt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un véhicule..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableVehicles.length > 0 ? (
              availableVehicles.map((vehicle) => (
                <div 
                  key={vehicle.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {vehicle.car_brands?.name} {vehicle.car_models?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {vehicle.license_plate} • {vehicle.year || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-green-100 text-green-800">
                    {vehicle.status || 'Disponible'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Aucun véhicule disponible trouvé' : 'Aucun véhicule disponible'}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSelectionDialog;
