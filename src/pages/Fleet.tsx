
import React, { useState } from 'react';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import FleetVehicleDialog from '@/components/fleet/FleetVehicleDialog';
import FleetVehiclesTable from '@/components/fleet/FleetVehiclesTable';
import FleetLoansHistory from '@/components/fleet/FleetLoansHistory';
import FleetCurrentLoans from '@/components/fleet/FleetCurrentLoans';
import FleetViolations from '@/components/fleet/FleetViolations';
import FleetLoanDialog from '@/components/fleet/FleetLoanDialog';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { LoanFormData } from '@/components/fleet/FleetLoanForm';
import { useToast } from '@/hooks/use-toast';

const Fleet = () => {
  const { vehicles, isLoading, error } = useFleetVehicles();
  const { reservations } = useFleetReservations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [vehicleToLend, setVehicleToLend] = useState<FleetVehicle | null>(null);
  const { toast } = useToast();

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: FleetVehicle) => {
    setSelectedVehicle(vehicle);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedVehicle(null);
  };

  const handleLendVehicle = (vehicle: FleetVehicle) => {
    setVehicleToLend(vehicle);
    setIsLoanDialogOpen(true);
  };

  const handleLoanSubmit = (loanData: LoanFormData) => {
    console.log('Loan data:', loanData);
    toast({
      title: "Prêt enregistré",
      description: `Le véhicule ${vehicleToLend?.brand} ${vehicleToLend?.model} a été prêté avec succès.`
    });
  };

  const handleCloseLoanDialog = () => {
    setIsLoanDialogOpen(false);
    setVehicleToLend(null);
  };

  // Handlers for loan actions
  const handleViewLoanDetails = (loanId: string) => {
    console.log('Opening loan details for:', loanId);
    // TODO: Implement loan details dialog
    toast({
      title: "Détails du prêt",
      description: `Ouverture des détails pour le prêt ${loanId}`
    });
  };

  const handleReturnVehicle = (loanId: string) => {
    console.log('Processing vehicle return for:', loanId);
    // TODO: Implement vehicle return process
    toast({
      title: "Retour de véhicule",
      description: `Traitement du retour pour le prêt ${loanId}`
    });
  };

  const handleNewLoan = () => {
    console.log('Creating new loan');
    // TODO: Open new loan creation dialog
    toast({
      title: "Nouveau prêt",
      description: "Ouverture du formulaire de nouveau prêt"
    });
  };

  const handleViewLoan = (loanId: string) => {
    console.log('Viewing loan:', loanId);
    // TODO: Implement loan view dialog
    toast({
      title: "Consultation du prêt",
      description: `Consultation du prêt ${loanId}`
    });
  };

  // Convert reservations to current loans format
  const currentLoans = (reservations || [])
    .filter(reservation => reservation.status === 'active')
    .map(reservation => ({
      id: reservation.id,
      vehicle: `${reservation.fleet_vehicles?.brand || 'N/A'} ${reservation.fleet_vehicles?.model || 'N/A'} - ${reservation.fleet_vehicles?.license_plate || 'N/A'}`,
      client: `${reservation.clients?.first_name || ''} ${reservation.clients?.last_name || ''}`,
      startDate: new Date(reservation.start_date).toLocaleDateString('fr-FR'),
      expectedReturnDate: new Date(reservation.expected_return_date).toLocaleDateString('fr-FR')
    }));

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
            vehicles={vehicles || []}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onAddVehicle={handleAddVehicle}
            onViewVehicle={handleViewVehicle}
            onEditVehicle={handleEditVehicle}
            onLendVehicle={handleLendVehicle}
          />
          
          <FleetLoansHistory onViewLoan={handleViewLoan} />
        </div>
        
        <div className="space-y-6">
          <FleetCurrentLoans 
            currentLoans={currentLoans}
            onViewDetails={handleViewLoanDetails}
            onReturnVehicle={handleReturnVehicle}
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
        onSubmit={handleLoanSubmit}
      />
    </div>
  );
};

export default Fleet;
