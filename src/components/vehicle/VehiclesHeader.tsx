
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car, Search, Filter } from 'lucide-react';

interface VehiclesHeaderProps {
  onCreateVehicle: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const VehiclesHeader: React.FC<VehiclesHeaderProps> = ({
  onCreateVehicle,
  searchQuery,
  onSearchQueryChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-800">Véhicules</h2>
      
      <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
        <div className="relative flex-1 md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un véhicule..." 
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
          />
        </div>
        
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        
        <Button className="btn-primary" onClick={onCreateVehicle}>
          <Car className="h-4 w-4 mr-2" />
          Nouveau véhicule
        </Button>
      </div>
    </div>
  );
};

export default VehiclesHeader;
