
import React, { useState } from 'react';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { useFleetPage } from '@/hooks/use-fleet-page';
import { useCompany } from '@/hooks/use-company';
import { getCurrentPosition } from '@/utils/geolocation';
import { generateAttestationPDF } from '@/utils/pdf-generator';
import FleetVehicleDialog from './FleetVehicleDialog';
import FleetLoanDialog from './FleetLoanDialog';
import VehicleSelectionDialog from './VehicleSelectionDialog';
import FleetVehiclesTable from './FleetVehiclesTable';
import FleetCurrentLoans from './FleetCurrentLoans';
import FleetLoansHistory from './FleetLoansHistory';
import FleetAttestationDialog from './FleetAttestationDialog';
import FleetViolations from './FleetViolations';
import { Loading } from '@/components/ui/loading';
import { useIsMobile } from '@/hooks/use-mobile';

const FleetPageContent = () => {
  // État pour le dialog d'attestation
  const [isAttestationDialogOpen, setIsAttestationDialogOpen] = useState(false);
  const [selectedLoanForAttestation, setSelectedLoanForAttestation] = useState<string | null>(null);

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

  // Fonction pour gérer l'ouverture du dialog d'attestation
  const handleViewAttestation = (loanId: string) => {
    setSelectedLoanForAttestation(loanId);
    setIsAttestationDialogOpen(true);
  };

  // Fonction pour fermer le dialog d'attestation
  const handleCloseAttestationDialog = () => {
    setIsAttestationDialogOpen(false);
    setSelectedLoanForAttestation(null);
  };

  // Trouver les données complètes du prêt sélectionné pour l'attestation
  const selectedLoanData = selectedLoanForAttestation 
    ? currentLoans.find(loan => loan.id === selectedLoanForAttestation)
    : null;

  const { reservations } = useFleetReservations();
  const { companyData } = useCompany();

  // Fonction pour gérer le téléchargement de l'attestation
  const handleDownloadAttestation = async (loanId: string) => {
    try {
      const loanData = reservations?.find(r => r.id === loanId);
      if (!loanData) {
        console.error('Données du prêt non trouvées');
        return;
      }

      // Obtenir la position utilisateur
      let userPosition = '[position non disponible]';
      try {
        const position = await getCurrentPosition();
        userPosition = `${position.latitude.toFixed(6)},${position.longitude.toFixed(6)}`;
      } catch (error) {
        console.error('Erreur de géolocalisation:', error);
      }

      // Générer le PDF
      await generateAttestationPDF(loanData, companyData, userPosition);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  };

  if (isLoading) {
    return <Loading text="Chargement de la flotte..." size="lg" />;
  }

  if (error) {
    return (
      <div className="text-red-500">Error: {error.message}</div>
    );
  }

  const isMobile = useIsMobile();

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Flotte de véhicules</h1>
        <p className="text-sm md:text-base text-gray-600">Gérez vos véhicules de courtoisie et les prêts clients.</p>
      </div>

      {/* Responsive layout */}
      {isMobile ? (
        <div className="space-y-6">
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

          <FleetCurrentLoans
            currentLoans={currentLoans}
            onViewDetails={handleViewLoanDetails}
            onReturnVehicle={handleReturnVehicle}
            onNewLoan={handleNewLoan}
            onDeleteLoan={handleDeleteLoan}
            onViewAttestation={handleViewAttestation}
            onDownloadAttestation={handleDownloadAttestation}
          />

          <FleetLoansHistory 
            onViewLoan={handleViewLoan}
            onViewReturn={handleViewReturn}
          />

          <FleetViolations />
        </div>
      ) : (
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
              onViewAttestation={handleViewAttestation}
              onDownloadAttestation={handleDownloadAttestation}
            />

            <FleetViolations />
          </div>
        </div>
      )}

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

      <FleetAttestationDialog
        open={isAttestationDialogOpen}
        onOpenChange={handleCloseAttestationDialog}
        loanId={selectedLoanForAttestation}
        loanData={reservations?.find(r => r.id === selectedLoanForAttestation)}
      />
    </div>
  );
};

export default FleetPageContent;
