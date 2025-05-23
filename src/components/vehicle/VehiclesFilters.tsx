
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface VehiclesFiltersProps {
  statusFilter: string;
  searchQuery: string;
  onStatusFilterChange: (status: string) => void;
  onSearchQueryChange: (query: string) => void;
}

const VehiclesFilters: React.FC<VehiclesFiltersProps> = ({
  statusFilter,
  searchQuery,
  onStatusFilterChange,
  onSearchQueryChange
}) => {
  const statusOptions = ['Tous', 'En réparation', 'Terminé', 'En attente', 'Diagnostic'];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center">
        <div className="flex space-x-2">
          {statusOptions.map((status) => (
            <Button 
              key={status}
              variant={statusFilter === status ? "default" : "outline"} 
              className="text-sm"
              onClick={() => onStatusFilterChange(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto">
        <div className="relative flex-1 md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un véhicule..." 
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
          />
        </div>
      </div>
    </div>
  );
};

export default VehiclesFilters;
