
import React, { useState } from 'react';
import VehicleDialog from '@/components/vehicle/VehicleDialog';
import VehiclesHeader from '@/components/vehicle/VehiclesHeader';
import VehiclesFilters from '@/components/vehicle/VehiclesFilters';
import VehiclesGrid from '@/components/vehicle/VehiclesGrid';
import VehiclesEmptyState from '@/components/vehicle/VehiclesEmptyState';
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

  // Filter vehicles based on status and search
  const filteredVehicles = vehicles?.filter(vehicle => {
    const vehicleStatus = vehicle.status || 'En attente';
    const matchesStatus = statusFilter === 'Tous' || vehicleStatus === statusFilter;
    const matchesSearch = searchQuery === '' || 
      vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.license_plate?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  if (isLoading) return <TableLoading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="page-container">
      <VehiclesHeader onCreateVehicle={handleCreateVehicle} />
      
      <VehiclesFilters
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onStatusFilterChange={setStatusFilter}
        onSearchQueryChange={setSearchQuery}
      />
      
      {filteredVehicles.length === 0 ? (
        <VehiclesEmptyState
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onCreateVehicle={handleCreateVehicle}
        />
      ) : (
        <VehiclesGrid
          vehicles={filteredVehicles}
          onViewVehicle={handleViewVehicle}
          onEditVehicle={handleEditVehicle}
          onDeleteVehicle={handleDeleteVehicle}
        />
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
