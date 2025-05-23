
import React from 'react';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

interface VehiclesEmptyStateProps {
  searchQuery: string;
  statusFilter: string;
  onCreateVehicle: () => void;
}

const VehiclesEmptyState: React.FC<VehiclesEmptyStateProps> = ({
  searchQuery,
  statusFilter,
  onCreateVehicle
}) => {
  const hasFilters = searchQuery || statusFilter !== 'Tous';

  return (
    <div className="text-center py-12">
      <Car className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun véhicule</h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasFilters 
          ? 'Aucun véhicule ne correspond aux critères de recherche.'
          : 'Commencez par ajouter un véhicule.'
        }
      </p>
      {!hasFilters && (
        <div className="mt-6">
          <Button onClick={onCreateVehicle} className="btn-primary">
            <Car className="h-4 w-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </div>
      )}
    </div>
  );
};

export default VehiclesEmptyState;
