
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
    <div className="flex flex-col gap-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Véhicules</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Consultez et gérez les véhicules de vos clients
          </p>
        </div>
        
        <Button 
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white w-full sm:w-auto" 
          onClick={onCreateVehicle}
        >
          <Car className="h-4 w-4 mr-2" />
          <span className="sm:inline">Nouveau véhicule</span>
        </Button>
      </div>
      
      <div className="flex items-center w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un véhicule..." 
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white border-gray-200 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem>Tous les clients</DropdownMenuItem>
            <DropdownMenuItem>Clients récents</DropdownMenuItem>
            <DropdownMenuItem>Clients actifs</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VehiclesHeader;
