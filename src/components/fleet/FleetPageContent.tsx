
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Flotte de véhicules</h1>
        <p className="text-gray-600">Gérez vos véhicules de courtoisie et les prêts clients.</p>
      </div>

      {/* Two column layout with asymmetric columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - wider (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <FleetVehiclesTable
            vehicles={vehicles}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
            onViewVehicle={handleViewVehicle}
            onLendVehicle={handleLendVehicle}
          />

          <FleetLoansHistory 
            onViewLoan={handleViewLoan}
            onViewReturn={handleViewReturn}
          />
        </div>

        {/* Right column - narrower (1/3) */}
        <div className="space-y-6">
          <FleetCurrentLoans
            currentLoans={currentLoans}
            onViewDetails={handleViewLoanDetails}
            onReturnVehicle={handleReturnVehicle}
            onNewLoan={handleNewLoan}
            onDeleteLoan={handleDeleteLoan}
          />

          {/* Contraventions section - placeholder for now */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contraventions</h3>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">Aucune contravention en attente</p>
              <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Importer une contravention
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
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
        vehicles={vehicles}
        onVehicleSelect={handleVehicleSelected}
      />
    </div>
  );
};

export default FleetPageContent;
