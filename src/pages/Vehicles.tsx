
import React from 'react';
import VehicleDialog from '@/components/vehicle/VehicleDialog';
import VehicleDetailsDialog from '@/components/vehicle/VehicleDetailsDialog';
import VehicleDocumentDialogs from '@/components/vehicle/VehicleDocumentDialogs';
import VehiclesHeader from '@/components/vehicle/VehiclesHeader';
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
    searchQuery,
    vehicles,
    isLoading,
    error,
    quoteDialogOpen,
    setQuoteDialogOpen,
    invoiceDialogOpen,
    setInvoiceDialogOpen,
    selectedVehicleForDocument,
    setSelectedVehicleForDocument,
    setDialogOpen,
    setSearchQuery,
    handleCreateVehicle,
    handleViewVehicle,
    handleEditVehicle,
    handleDeleteVehicle,
    handleVehicleSubmit,
    handleCreateQuote,
    handleCreateInvoice,
  } = useVehiclesPage();

  if (isLoading) return <TableLoading />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="page-container">
      <VehiclesHeader 
        onCreateVehicle={handleCreateVehicle}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
      
      {vehicles.length === 0 ? (
        <VehiclesEmptyState
          searchQuery={searchQuery}
          statusFilter="Tous"
          onCreateVehicle={handleCreateVehicle}
        />
      ) : (
        <VehiclesGrid
          vehicles={vehicles}
          onViewVehicle={handleViewVehicle}
          onEditVehicle={handleEditVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          onCreateQuote={handleCreateQuote}
          onCreateInvoice={handleCreateInvoice}
        />
      )}

      {dialogMode === 'view' ? (
        <VehicleDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Détails du véhicule"
          defaultValues={selectedVehicle || {}}
          onSubmit={handleVehicleSubmit}
          mode={dialogMode}
        />
      ) : (
        <VehicleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={
            dialogMode === 'create' 
              ? 'Ajouter un véhicule' 
              : 'Modifier le véhicule'
          }
          description={
            dialogMode === 'create' 
              ? 'Saisissez les informations du nouveau véhicule.'
              : 'Modifiez les informations du véhicule.'
          }
          defaultValues={selectedVehicle || {}}
          onSubmit={handleVehicleSubmit}
          mode={dialogMode}
        />
      )}

      <VehicleDocumentDialogs
        quoteDialogOpen={quoteDialogOpen}
        setQuoteDialogOpen={setQuoteDialogOpen}
        invoiceDialogOpen={invoiceDialogOpen}
        setInvoiceDialogOpen={setInvoiceDialogOpen}
        selectedVehicleForDocument={selectedVehicleForDocument}
        setSelectedVehicleForDocument={setSelectedVehicleForDocument}
      />
    </div>
  );
};

export default Vehicles;
