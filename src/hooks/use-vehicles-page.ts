
import { useState } from 'react';
import { useVehicles } from '@/hooks/use-vehicles';
import { useAuth } from '@/contexts/AuthContext';

export function useVehiclesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { vehicles, isLoading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { user } = useAuth();

  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      deleteVehicle.mutate(vehicleId);
    }
  };

  const handleVehicleSubmit = (data: any) => {
    // Validate required fields on the frontend as well
    if (!data.clientId || !data.vin || !data.brand || !data.model || !data.licensePlate) {
      alert('Les champs Client, Numéro de série (VIN), Marque, Modèle et Plaque d\'immatriculation sont obligatoires.');
      return;
    }

    if (dialogMode === 'create') {
      createVehicle.mutate({
        client_id: data.clientId,
        vin: data.vin,
        brand: data.brand,
        model: data.model,
        license_plate: data.licensePlate,
        engine_number: data.engineNumber || null,
        year: data.year ? parseInt(data.year) : null,
        color: data.color || null,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        insurance_company: data.insuranceCompany || null,
        insurance_expiry_date: data.insuranceExpiryDate || null,
        start_date: data.startDate || null,
        arrival_date: data.arrivalDate || null,
        end_date: data.endDate || null,
        status: data.status || 'En attente',
        road_test: data.roadTest || null,
        road_test_notes: data.roadTestNotes || null,
        fuel_level: data.fuelLevel || 50,
        pre_accident_defects: data.preAccidentDefects || null,
        work_items: data.workItems || null,
        registration_document_front_url: data.registrationDocumentFrontUrl || null,
        registration_document_back_url: data.registrationDocumentBackUrl || null,
        vehicle_image_url: data.vehicleImageUrl || null,
        vehicle_images: data.vehicleImages || null,
        user_id: user ? user.id : null,
      });
    } else if (dialogMode === 'edit' && selectedVehicle) {
      updateVehicle.mutate({
        id: selectedVehicle.id,
        data: {
          client_id: data.clientId,
          vin: data.vin,
          brand: data.brand,
          model: data.model,
          license_plate: data.licensePlate,
          engine_number: data.engineNumber || null,
          year: data.year ? parseInt(data.year) : null,
          color: data.color || null,
          mileage: data.mileage ? parseInt(data.mileage) : null,
          insurance_company: data.insuranceCompany || null,
          insurance_expiry_date: data.insuranceExpiryDate || null,
          start_date: data.startDate || null,
          arrival_date: data.arrivalDate || null,
          end_date: data.endDate || null,
          status: data.status || 'En attente',
          road_test: data.roadTest || null,
          road_test_notes: data.roadTestNotes || null,
          fuel_level: data.fuelLevel || 50,
          pre_accident_defects: data.preAccidentDefects || null,
          work_items: data.workItems || null,
          registration_document_front_url: data.registrationDocumentFrontUrl || null,
          registration_document_back_url: data.registrationDocumentBackUrl || null,
          vehicle_image_url: data.vehicleImageUrl || null,
          vehicle_images: data.vehicleImages || null,
        }
      });
    }
    setDialogOpen(false);
  };

  // Filter vehicles based on status and search
  const filteredVehicles = vehicles?.filter(vehicle => {
    const vehicleStatus = vehicle.status || 'En attente';
    const matchesStatus = statusFilter === 'Tous' || vehicleStatus === statusFilter;
    const matchesSearch = searchQuery === '' || 
      vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.license_plate?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  return {
    // State
    dialogOpen,
    dialogMode,
    selectedVehicle,
    statusFilter,
    searchQuery,
    vehicles: filteredVehicles,
    isLoading,
    error,
    
    // Setters
    setDialogOpen,
    setStatusFilter,
    setSearchQuery,
    
    // Handlers
    handleCreateVehicle,
    handleViewVehicle,
    handleEditVehicle,
    handleDeleteVehicle,
    handleVehicleSubmit,
  };
}
