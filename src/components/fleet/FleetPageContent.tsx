import React from 'react';
import { useFleetPage } from '@/hooks/use-fleet-page';
import FleetVehicleDialog from './FleetVehicleDialog';
import FleetLoanDialog from './FleetLoanDialog';
import VehicleSelectionDialog from './VehicleSelectionDialog';
import FleetVehiclesTable from './FleetVehiclesTable';
import FleetCurrentLoans from './FleetCurrentLoans';
import FleetLoansHistory from './FleetLoansHistory';

const FleetPageContent = () => {
  const {
    vehicles,
    currentLoans,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    selectedVehicle,
    dialogMode,
    handleAddVehicle,
    handleEditVehicle,
    handleViewVehicle,
    handleCloseDialog,
    handleLendVehicle,
    isLoanDialogOpen,
    vehicleToLend,
    loanDialogMode,
    selectedLoanId,
    handleLoanSubmit,
    handleCloseLoanDialog,
    handleViewLoanDetails,
    handleReturnVehicle,
    handleNewLoan,
    isVehicleSelectionOpen,
    setIsVehicleSelectionOpen,
    handleVehicleSelected,
    handleViewLoan,
    handleViewReturn,
    handleDeleteLoan
  } = useFleetPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestion de flotte</h1>
        <button onClick={handleNewLoan} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Nouveau prêt
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un véhicule..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FleetVehiclesTable
          vehicles={vehicles}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddVehicle={handleAddVehicle}
          onEditVehicle={handleEditVehicle}
          onViewVehicle={handleViewVehicle}
          onLendVehicle={handleLendVehicle}
        />

        <div className="space-y-6">
          <FleetCurrentLoans
            loans={currentLoans}
            onViewLoan={handleViewLoanDetails}
            onReturnVehicle={handleReturnVehicle}
            onNewLoan={handleNewLoan}
            onDeleteLoan={handleDeleteLoan}
          />

          <FleetLoansHistory 
            onViewLoan={handleViewLoan}
            onViewReturn={handleViewReturn}
          />
        </div>
      </div>

      <FleetVehicleDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        vehicle={selectedVehicle}
        mode={dialogMode}
      />

      <FleetLoanDialog
        isOpen={isLoanDialogOpen}
        onClose={handleCloseLoanDialog}
        vehicle={vehicleToLend}
        loanId={selectedLoanId}
        mode={loanDialogMode}
        onSubmit={handleLoanSubmit}
      />

      <VehicleSelectionDialog
        isOpen={isVehicleSelectionOpen}
        onClose={() => setIsVehicleSelectionOpen(false)}
        onVehicleSelected={handleVehicleSelected}
      />
    </div>
  );
};

export default FleetPageContent;
