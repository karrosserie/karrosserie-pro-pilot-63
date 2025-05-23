
import React, { useState } from 'react';
import VehicleCard from '@/components/vehicle/VehicleCard';
import VehicleDialog from '@/components/vehicle/VehicleDialog';
import { Button } from '@/components/ui/button';
import { Car, Plus, Search } from 'lucide-react';
import { useVehicles } from '@/hooks/use-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

const Vehicles = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { vehicles, isLoading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { user } = useAuth();

  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      deleteVehicle.mutate(vehicleId);
    }
  };

  const handleVehicleSubmit = (data: any) => {
    if (dialogMode === 'create') {
      createVehicle.mutate({
        brand: data.brand,
        model: data.model,
        year: data.year ? parseInt(data.year) : null,
        license_plate: data.licensePlate,
        color: data.color,
        vin: data.vin,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        fuel_type: data.fuelType,
        client_id: data.clientId,
        user_id: user ? user.id : null,
      });
    } else if (dialogMode === 'edit' && selectedVehicle) {
      updateVehicle.mutate({
        id: selectedVehicle.id,
        data: {
          brand: data.brand,
          model: data.model,
          year: data.year ? parseInt(data.year) : null,
          license_plate: data.licensePlate,
          color: data.color,
          vin: data.vin,
          mileage: data.mileage ? parseInt(data.mileage) : null,
          fuel_type: data.fuelType,
          client_id: data.clientId,
        }
      });
    }
    setDialogOpen(false);
  };

  // Filtrer les véhicules selon le statut et la recherche
  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesStatus = statusFilter === 'Tous' || vehicle.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.license_plate?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  // Convertir les données de la base pour correspondre au format VehicleCard
  const vehicleCardsData = filteredVehicles.map(vehicle => ({
    id: vehicle.id,
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    licensePlate: vehicle.license_plate || '',
    status: (vehicle.status || 'En attente') as 'En réparation' | 'Terminé' | 'En attente' | 'Diagnostic',
    owner: vehicle.clients ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}` : 'Non assigné',
    onView: () => handleViewVehicle(vehicle),
    onEdit: () => handleEditVehicle(vehicle),
    onDelete: () => handleDeleteVehicle(vehicle.id)
  }));

  if (isLoading) return <TableLoading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Véhicules</h1>
        <p className="text-gray-600 mt-1">Consultez et gérez tous les véhicules de vos clients.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center">
          <div className="flex space-x-2">
            {['Tous', 'En réparation', 'Terminé', 'En attente', 'Diagnostic'].map((status) => (
              <Button 
                key={status}
                variant={statusFilter === status ? "default" : "outline"} 
                className="text-sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un véhicule..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
            />
          </div>
          
          <Button className="btn-primary" onClick={handleCreateVehicle}>
            <Car className="h-4 w-4 mr-2" />
            Ajouter un véhicule
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicleCardsData.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            brand={vehicle.brand}
            model={vehicle.model}
            year={vehicle.year}
            licensePlate={vehicle.licensePlate}
            status={vehicle.status}
            owner={vehicle.owner}
            onView={vehicle.onView}
            onEdit={vehicle.onEdit}
            onDelete={vehicle.onDelete}
          />
        ))}
      </div>

      {vehicleCardsData.length === 0 && (
        <div className="text-center py-12">
          <Car className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun véhicule</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'Tous' 
              ? 'Aucun véhicule ne correspond aux critères de recherche.'
              : 'Commencez par ajouter un véhicule.'
            }
          </p>
          {(!searchQuery && statusFilter === 'Tous') && (
            <div className="mt-6">
              <Button onClick={handleCreateVehicle} className="btn-primary">
                <Car className="h-4 w-4 mr-2" />
                Ajouter un véhicule
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Vehicle Dialog */}
      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          dialogMode === 'create' 
            ? 'Ajouter un véhicule' 
            : dialogMode === 'edit' 
            ? 'Modifier le véhicule' 
            : 'Détails du véhicule'
        }
        description={
          dialogMode === 'create' 
            ? 'Saisissez les informations du nouveau véhicule.'
            : dialogMode === 'edit'
            ? 'Modifiez les informations du véhicule.'
            : ''
        }
        defaultValues={selectedVehicle ? {
          brand: selectedVehicle.brand || '',
          model: selectedVehicle.model || '',
          year: selectedVehicle.year?.toString() || '',
          licensePlate: selectedVehicle.license_plate || '',
          color: selectedVehicle.color || '',
          vin: selectedVehicle.vin || '',
          mileage: selectedVehicle.mileage?.toString() || '',
          fuelType: selectedVehicle.fuel_type || '',
          clientId: selectedVehicle.client_id || '',
        } : {}}
        onSubmit={handleVehicleSubmit}
        mode={dialogMode}
      />
    </div>
  );
};

export default Vehicles;
