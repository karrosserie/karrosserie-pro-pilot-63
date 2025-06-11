
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Car } from 'lucide-react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface FleetVehiclesTableProps {
  vehicles: FleetVehicle[];
  isLoading: boolean;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onAddVehicle: () => void;
  onViewVehicle: (vehicle: FleetVehicle) => void;
  onEditVehicle: (vehicle: FleetVehicle) => void;
  onLendVehicle: (vehicle: FleetVehicle) => void;
}

const FleetVehiclesTable: React.FC<FleetVehiclesTableProps> = ({
  vehicles,
  isLoading,
  searchTerm,
  onSearchTermChange,
  onAddVehicle,
  onViewVehicle,
  onEditVehicle,
  onLendVehicle
}) => {
  const filteredVehicles = vehicles?.filter(vehicle =>
    vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="card-container mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Mes véhicules de courtoisie</h2>
        
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>
          
          <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white" onClick={onAddVehicle}>
            <Car className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Chargement...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Véhicule</th>
                <th scope="col" className="px-6 py-3">Immatriculation</th>
                <th scope="col" className="px-6 py-3">Année</th>
                <th scope="col" className="px-6 py-3">Statut</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{vehicle.brand} {vehicle.model}</td>
                    <td className="px-6 py-4">{vehicle.license_plate}</td>
                    <td className="px-6 py-4">{vehicle.year || '-'}</td>
                    <td className="px-6 py-4">
                      <span 
                        className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                          vehicle.status === 'Disponible' 
                            ? 'bg-green-100 text-green-800' 
                            : vehicle.status === 'En prêt'
                            ? 'bg-amber-100 text-amber-800'
                            : vehicle.status === 'En maintenance'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {vehicle.status || 'Disponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {vehicle.status === 'Disponible' && (
                        <Button 
                          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
                          size="sm"
                          onClick={() => onLendVehicle(vehicle)}
                        >
                          Prêter
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditVehicle(vehicle)}
                      >
                        Modifier
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Aucun véhicule trouvé' : 'Aucun véhicule de courtoisie'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FleetVehiclesTable;
