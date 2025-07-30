import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Car, Pencil, HandCoins } from 'lucide-react';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { Loading } from '@/components/ui/loading';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import { Table, TableHeader, TableRow, TableBody, TableCell, TableHead } from '@/components/ui/table';

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
  const { sortedData, sortConfig, handleSort } = useTableSorting(vehicles, 'license_plate');
  
  const filteredVehicles = sortedData?.filter(vehicle =>
    vehicle.car_brands?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.car_models?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <Loading text="Chargement des véhicules..." />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHeader sortKey="vehicle" sortConfig={sortConfig} onSort={handleSort}>
                  Véhicule
                </SortableTableHeader>
                <SortableTableHeader sortKey="license_plate" sortConfig={sortConfig} onSort={handleSort}>
                  Immatriculation
                </SortableTableHeader>
                <SortableTableHeader sortKey="year" sortConfig={sortConfig} onSort={handleSort}>
                  Année
                </SortableTableHeader>
                <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
                  Statut
                </SortableTableHeader>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {vehicle.car_brands?.name} {vehicle.car_models?.name}
                    </TableCell>
                    <TableCell>{vehicle.license_plate}</TableCell>
                    <TableCell>{vehicle.year || '-'}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="space-x-2">
                      {vehicle.status === 'Disponible' && (
                        <Button 
                          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
                          size="sm"
                          onClick={() => onLendVehicle(vehicle)}
                        >
                          <HandCoins className="h-4 w-4 mr-1" />
                          Prêter
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditVehicle(vehicle)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    {searchTerm ? 'Aucun véhicule trouvé' : 'Aucun véhicule de courtoisie'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default FleetVehiclesTable;