
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

interface VehiclesHeaderProps {
  onCreateVehicle: () => void;
}

const VehiclesHeader: React.FC<VehiclesHeaderProps> = ({ onCreateVehicle }) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Véhicules</h1>
        <p className="text-gray-600 mt-1">Consultez et gérez tous les véhicules de vos clients.</p>
      </div>
      
      <div className="flex justify-end mb-6">
        <Button className="btn-primary" onClick={onCreateVehicle}>
          <Car className="h-4 w-4 mr-2" />
          Ajouter un véhicule
        </Button>
      </div>
    </>
  );
};

export default VehiclesHeader;
