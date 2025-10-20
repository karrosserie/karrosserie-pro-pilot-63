
import React, { useState, useEffect } from 'react';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { useFleetReturns } from '@/hooks/use-fleet-returns';
import { useFleetPage } from '@/hooks/use-fleet-page';
import { useCompany } from '@/hooks/use-company';
import { getCurrentPosition } from '@/utils/geolocation';
import { generateAttestationPDF, generateReturnAttestationPDF } from '@/utils/pdf-generator';
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
import { useUserOnboardingProgress } from '@/hooks/use-user-onboarding-progress';
import { FleetLoanCreatedDialog } from './FleetLoanCreatedDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const FleetPageContent = () => {
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL
  // État pour le dialog d'attestation
  const [isAttestationDialogOpen, setIsAttestationDialogOpen] = useState(false);
  const [selectedLoanForAttestation, setSelectedLoanForAttestation] = useState<string | null>(null);
  const [showGuideDialog, setShowGuideDialog] = useState(false);
  const [showLoanCreatedDialog, setShowLoanCreatedDialog] = useState(false);

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

  const { reservations } = useFleetReservations();
  const { returns } = useFleetReturns();
  const { companyData } = useCompany();
  const isMobile = useIsMobile();
  const { shouldShowFleetReservationHelp, shouldShowFleetGuide, shouldShowFleetLoanCreatedHelp, markHelpAsSeen } = useUserOnboardingProgress();

  // Afficher le guide si pas encore vu
  useEffect(() => {
    if (!isLoading && (shouldShowFleetReservationHelp || shouldShowFleetGuide)) {
      setShowGuideDialog(true);
    }
  }, [isLoading, shouldShowFleetReservationHelp, shouldShowFleetGuide]);

  // Afficher le dialog "prêt créé" après création d'un prêt
  useEffect(() => {
    if (!isLoading && currentLoans.length > 0 && shouldShowFleetLoanCreatedHelp) {
      // Délai pour laisser le temps au dialog de prêt de se fermer
      const timer = setTimeout(() => {
        setShowLoanCreatedDialog(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentLoans.length, shouldShowFleetLoanCreatedHelp]);

  // Fermer le guide et marquer comme vu
  const handleCloseGuide = () => {
    setShowGuideDialog(false);
    markHelpAsSeen('fleet_reservation_help_seen');
    if (vehicles.length > 0) {
      markHelpAsSeen('fleet_reservation_guide_completed');
    }
  };

  // Fermer le dialog "prêt créé"
  const handleCloseLoanCreatedDialog = () => {
    setShowLoanCreatedDialog(false);
    markHelpAsSeen('fleet_loan_created_help_seen');
  };

  // Guider vers l'action appropriée
  const handleGuideAction = () => {
    handleCloseGuide();
    if (vehicles.length === 0) {
      handleAddVehicle();
    } else {
      handleNewLoan();
    }
  };

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

  // Fonction pour télécharger l'attestation de prêt depuis l'historique
  const handleDownloadLoanAttestation = async (loanId: string) => {
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

      // Générer le PDF d'attestation de prêt
      await generateAttestationPDF(loanData, companyData, userPosition);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF d\'attestation de prêt:', error);
    }
  };

  // Fonction pour télécharger l'attestation de retour depuis l'historique
  const handleDownloadReturnAttestation = async (loanId: string) => {
    try {
      const loanData = reservations?.find(r => r.id === loanId);
      if (!loanData) {
        console.error('Données du prêt non trouvées');
        return;
      }

      // Trouver les données de retour correspondantes
      const fleetReturn = returns?.find(r => r.fleet_reservation_id === loanId);
      if (!fleetReturn) {
        console.error('Données de retour non trouvées pour ce prêt');
        return;
      }

      // Utiliser les données de retour réelles avec la signature du retour
      const returnData = {
        return_date: fleetReturn.return_date,
        return_mileage: fleetReturn.return_mileage,
        fuel_level_return: fleetReturn.fuel_level_return,
        damages: Array.isArray(fleetReturn.damages) ? fleetReturn.damages : (fleetReturn.damages ? JSON.parse(fleetReturn.damages as string) : []),
        vehicle_images: Array.isArray(fleetReturn.vehicle_images) ? fleetReturn.vehicle_images : (fleetReturn.vehicle_images ? JSON.parse(fleetReturn.vehicle_images as string) : []),
        client_signature: fleetReturn.client_signature, // Signature du retour, pas du prêt
        client_name: fleetReturn.client_name,
        attestation_accepted: fleetReturn.attestation_accepted,
        notes: fleetReturn.notes
      };

      // Obtenir la position utilisateur
      let userPosition = '[position non disponible]';
      try {
        const position = await getCurrentPosition();
        userPosition = `${position.latitude.toFixed(6)},${position.longitude.toFixed(6)}`;
      } catch (error) {
        console.error('Erreur de géolocalisation:', error);
      }

      // Générer le PDF d'attestation de retour
      await generateReturnAttestationPDF(returnData, loanData, companyData, userPosition);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF d\'attestation de retour:', error);
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
            onDownloadLoanAttestation={handleDownloadLoanAttestation}
            onDownloadReturnAttestation={handleDownloadReturnAttestation}
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
              onDownloadLoanAttestation={handleDownloadLoanAttestation}
              onDownloadReturnAttestation={handleDownloadReturnAttestation}
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

      <AlertDialog open={showGuideDialog} onOpenChange={setShowGuideDialog}>
        <AlertDialogContent className="sm:max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-center">
              {vehicles.length === 0 
                ? 'Bienvenue dans la gestion de flotte !' 
                : 'Prêter un véhicule de courtoisie'
              }
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-center">
              {vehicles.length === 0 ? (
                <>
                  Pour commencer, vous devez d'abord <strong>ajouter un véhicule de courtoisie</strong> à votre flotte.
                  <br /><br />
                  Cliquez sur le bouton "Ajouter un véhicule" pour enregistrer votre premier véhicule de prêt.
                </>
              ) : (
                <>
                  Vous avez des véhicules enregistrés dans votre flotte. 
                  <br /><br />
                  Pour prêter un véhicule à un client, cliquez sur le bouton <strong>"Nouveau prêt"</strong> dans la section "Prêts en cours".
                  <br /><br />
                  <div className="space-y-2 mt-4">
                    <div className="flex items-start gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span><strong>Contrat sécurisé en 2 clics</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span><strong>On gère les PV</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span><strong>On demande un paiement pour le prêt de véhicule à l'assurance si c'est possible</strong></span>
                    </div>
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseGuide} className="mr-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Plus tard
            </AlertDialogAction>
            <AlertDialogAction onClick={handleGuideAction}>
              {vehicles.length === 0 ? 'Ajouter un véhicule' : 'Nouveau prêt'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FleetLoanCreatedDialog
        open={showLoanCreatedDialog}
        onClose={handleCloseLoanCreatedDialog}
      />
    </div>
  );
};

export default FleetPageContent;
