import React, { useState, useMemo } from 'react';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import FleetVehicleDialog from '@/components/fleet/FleetVehicleDialog';
import FleetVehiclesTable from '@/components/fleet/FleetVehiclesTable';
import FleetLoansHistory from '@/components/fleet/FleetLoansHistory';
import FleetCurrentLoans from '@/components/fleet/FleetCurrentLoans';
import FleetViolations from '@/components/fleet/FleetViolations';
import FleetLoanDialog from '@/components/fleet/FleetLoanDialog';
import VehicleSelectionDialog from '@/components/fleet/VehicleSelectionDialog';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { LoanFormData } from '@/components/fleet/FleetLoanForm';
import { useToast } from '@/hooks/use-toast';

const Fleet = () => {
  const { vehicles, isLoading, error } = useFleetVehicles();
  const { reservations, deleteReservation } = useFleetReservations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [vehicleToLend, setVehicleToLend] = useState<FleetVehicle | null>(null);
  const [loanDialogMode, setLoanDialogMode] = useState<'create' | 'edit' | 'view' | 'return'>('create');
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [isVehicleSelectionOpen, setIsVehicleSelectionOpen] = useState(false);
  const { toast } = useToast();

  // Update vehicle statuses based on active loans
  const vehiclesWithUpdatedStatus = useMemo(() => {
    if (!vehicles || !reservations) return vehicles || [];
    
    const activeReservations = reservations.filter(r => r.status === 'active');
    
    return vehicles.map(vehicle => {
      const hasActiveLoan = activeReservations.some(r => r.fleet_vehicle_id === vehicle.id);
      return {
        ...vehicle,
        status: hasActiveLoan ? 'En prêt' : (vehicle.status || 'Disponible')
      };
    });
  }, [vehicles, reservations]);

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
    console.log('Lending vehicle:', vehicle);
    setVehicleToLend(vehicle);
    setSelectedLoanId(null);
    setLoanDialogMode('create');
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
    setSelectedLoanId(null);
  };

  // Handlers for loan actions
  const handleViewLoanDetails = (loanId: string) => {
    console.log('Opening loan details for modification:', loanId);
    setSelectedLoanId(loanId);
    setVehicleToLend(null);
    setLoanDialogMode('edit');
    setIsLoanDialogOpen(true);
  };

  const handleReturnVehicle = (loanId: string) => {
    console.log('Processing vehicle return for:', loanId);
    setSelectedLoanId(loanId);
    setVehicleToLend(null);
    setLoanDialogMode('return');
    setIsLoanDialogOpen(true);
  };

  const handleNewLoan = () => {
    console.log('Opening vehicle selection for new loan');
    setIsVehicleSelectionOpen(true);
  };

  const handleVehicleSelected = (vehicle: FleetVehicle) => {
    console.log('Vehicle selected for new loan:', vehicle);
    setVehicleToLend(vehicle);
    setSelectedLoanId(null);
    setLoanDialogMode('create');
    setIsVehicleSelectionOpen(false);
    setIsLoanDialogOpen(true);
  };

  const handleViewLoan = (loanId: string) => {
    console.log('Viewing loan in read-only mode:', loanId);
    setSelectedLoanId(loanId);
    setVehicleToLend(null);
    setLoanDialogMode('view');
    setIsLoanDialogOpen(true);
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

  const handleDeleteLoan = async (loanId: string) => {
    try {
      await deleteReservation.mutateAsync(loanId);
      toast({
        title: "Prêt supprimé",
        description: "Le prêt a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Error deleting loan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le prêt.",
        variant: "destructive"
      });
    }
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
            vehicles={vehiclesWithUpdatedStatus}
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

export default Fleet;
