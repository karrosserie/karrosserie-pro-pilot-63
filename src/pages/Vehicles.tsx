
import React from 'react';
import VehicleDialog from '@/components/vehicle/VehicleDialog';
import VehiclesHeader from '@/components/vehicle/VehiclesHeader';
import VehiclesFilters from '@/components/vehicle/VehiclesFilters';
import VehiclesGrid from '@/components/vehicle/VehiclesGrid';
import VehiclesEmptyState from '@/components/vehicle/VehiclesEmptyState';
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { useVehiclesPage } from '@/hooks/use-vehicles-page';

const Vehicles = () => {
  const {
    dialogOpen,
    dialogMode,
    selectedVehicle,
    statusFilter,
    searchQuery,
    vehicles,
    isLoading,
    error,
    setDialogOpen,
    setStatusFilter,
    setSearchQuery,
    handleCreateVehicle,
    handleViewVehicle,
    handleEditVehicle,
    handleDeleteVehicle,
    handleVehicleSubmit,
  } = useVehiclesPage();

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
      
      {vehicles.length === 0 ? (
        <VehiclesEmptyState
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onCreateVehicle={handleCreateVehicle}
        />
      ) : (
        <VehiclesGrid
          vehicles={vehicles}
          onViewVehicle={handleViewVehicle}
          onEditVehicle={handleEditVehicle}
          onDeleteVehicle={handleDeleteVehicle}
        />
      )}

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
        defaultValues={selectedVehicle || {}}
        onSubmit={handleVehicleSubmit}
        mode={dialogMode}
      />
    </div>
  );
};

export default Vehicles;
