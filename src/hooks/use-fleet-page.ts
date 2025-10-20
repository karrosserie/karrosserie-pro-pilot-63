
import { useState, useMemo } from 'react';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { LoanFormData } from '@/components/fleet/FleetLoanForm';
import { useToast } from '@/hooks/use-toast';

export const useFleetPage = () => {
  const { vehicles, isLoading, error } = useFleetVehicles();
  const { reservations, deleteReservation } = useFleetReservations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [vehicleToLend, setVehicleToLend] = useState<FleetVehicle | null>(null);
  const [loanDialogMode, setLoanDialogMode] = useState<'create' | 'edit' | 'view' | 'return' | 'view_return'>('create');
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [isVehicleSelectionOpen, setIsVehicleSelectionOpen] = useState(false);
  const [showIntroStep, setShowIntroStep] = useState<'loans' | 'violations' | 'help' | null>(null);
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

  // Convert reservations to current loans format
  const currentLoans = (reservations || [])
    .filter(reservation => reservation.status === 'active')
    .map(reservation => {
      const vehicleDisplay = reservation.fleet_vehicles?.car_brands?.name && reservation.fleet_vehicles?.car_models?.name
        ? `${reservation.fleet_vehicles.car_brands.name} ${reservation.fleet_vehicles.car_models.name}`
        : 'Véhicule non spécifié';
      
      return {
        id: reservation.id,
        vehicle: `${vehicleDisplay} - ${reservation.fleet_vehicles?.license_plate || 'N/A'}`,
        client: `${reservation.clients?.first_name || ''} ${reservation.clients?.last_name || ''}`,
        startDate: new Date(reservation.start_date).toLocaleDateString('fr-FR'),
        expectedReturnDate: new Date(reservation.expected_return_date).toLocaleDateString('fr-FR')
      };
    });

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
    const vehicleDisplay = vehicleToLend?.car_brands?.name && vehicleToLend?.car_models?.name
      ? `${vehicleToLend.car_brands.name} ${vehicleToLend.car_models.name}`
      : 'le véhicule';
    toast({
      title: "Prêt enregistré",
      description: `Le véhicule ${vehicleDisplay} a été prêté avec succès.`
    });
    // Afficher la première étape d'introduction
    setShowIntroStep('loans');
  };

  const handleCloseLoanDialog = () => {
    setIsLoanDialogOpen(false);
    setVehicleToLend(null);
    setSelectedLoanId(null);
  };

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

  const handleViewReturn = (loanId: string) => {
    console.log('Viewing return details for:', loanId);
    setSelectedLoanId(loanId);
    setVehicleToLend(null);
    setLoanDialogMode('view_return');
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

  return {
    // Data
    vehicles: vehiclesWithUpdatedStatus,
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
    showIntroStep,
    
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
    handleViewReturn,
    handleDeleteLoan,
    handleCloseIntro: () => {
      if (showIntroStep === 'loans') {
        setShowIntroStep('violations');
      } else if (showIntroStep === 'violations') {
        setShowIntroStep('help');
      } else {
        setShowIntroStep(null);
      }
    }
  };
};
