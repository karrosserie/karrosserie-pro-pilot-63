import React from 'react';
import FleetVehicleDialog from '@/components/fleet/FleetVehicleDialog';
import FleetVehiclesTable from '@/components/fleet/FleetVehiclesTable';
import FleetLoansHistory from '@/components/fleet/FleetLoansHistory';
import FleetCurrentLoans from '@/components/fleet/FleetCurrentLoans';
import FleetViolations from '@/components/fleet/FleetViolations';
import FleetLoanDialog from '@/components/fleet/FleetLoanDialog';
import VehicleSelectionDialog from '@/components/fleet/VehicleSelectionDialog';
import { useFleetPage } from '@/hooks/use-fleet-page';

const FleetPageContent = () => {
  const {
    // Data
    vehicles,
    currentLoans,
    isLoading,
    error,
    
    // State
    searchTerm,
    isDialogOpen,
    selectedVehicle,
    dialogMode,
    isLoanDialogOpen,
    vehicleToLend,
    loanDialogMode,
    selectedLoanId,
    isVehicleSelectionOpen,
    
    // Setters
    setSearchTerm,
    setIsVehicleSelectionOpen,
    setSelectedLoanId,
    setLoanDialogMode,
    setVehicleToLend,
    setIsLoanDialogOpen,
    
    // Handlers
    handleAddVehicle,
    handleEditVehicle,
    handleViewVehicle,
    handleCloseDialog,
    handleLendVehicle,
    handleLoanSubmit,
    handleCloseLoanDialog,
    handleViewLoanDetails,
    handleReturnVehicle,
    handleNewLoan,
    handleVehicleSelected,
    handleViewLoan,
    handleDeleteLoan
  } = useFleetPage();

  // Handler for viewing return form in read-only mode
  const handleViewReturn = (loanId: string) => {
    console.log('Opening return form in read-only mode for loan:', loanId);
    setSelectedLoanId(loanId);
    setVehicleToLend(null);
    setLoanDialogMode('view'); // This will show the return form in read-only mode
    setIsLoanDialogOpen(true);
  };

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center py-8">
          <p className="text-red-600">Erreur lors du chargement des véhicules: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Flotte de véhicules</h1>
        <p className="text-gray-600 mt-1">Gérez vos véhicules de courtoisie et les prêts clients.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FleetVehiclesTable
            vehicles={vehicles}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onAddVehicle={handleAddVehicle}
            onViewVehicle={handleViewVehicle}
            onEditVehicle={handleEditVehicle}
            onLendVehicle={handleLendVehicle}
          />
          
          <FleetLoansHistory 
            onViewLoan={handleViewLoan} 
            onViewReturn={handleViewReturn}
          />
        </div>
        
        <div className="space-y-6">
          <FleetCurrentLoans 
            currentLoans={currentLoans}
            onViewDetails={handleViewLoanDetails}
            onReturnVehicle={handleReturnVehicle}
            onDeleteLoan={handleDeleteLoan}
            onNewLoan={handleNewLoan}
          />
          <FleetViolations />
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
        vehicles={vehicles || []}
        onVehicleSelect={handleVehicleSelected}
      />
    </div>
  );
};

export default FleetPageContent;
