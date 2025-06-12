
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
    console.log('Submitting vehicle data:', data);
    
    // Validate required fields on the frontend as well
    if (!data.clientId || !data.vin || !data.brand || !data.model || !data.licensePlate) {
      alert('Les champs Client, Numéro de série (VIN), Marque, Modèle et Plaque d\'immatriculation sont obligatoires.');
      return;
    }

    // Process work items - ensure it's an array and filter out empty items
    let processedWorkItems = [];
    if (data.workItems) {
      if (Array.isArray(data.workItems)) {
        processedWorkItems = data.workItems.filter((item: string) => item && item.trim() !== '');
      } else if (typeof data.workItems === 'string') {
        try {
          const parsed = JSON.parse(data.workItems);
          processedWorkItems = Array.isArray(parsed) ? parsed.filter((item: string) => item && item.trim() !== '') : [];
        } catch {
          processedWorkItems = data.workItems.trim() !== '' ? [data.workItems] : [];
        }
      }
    }

    // Process vehicle images
    let processedVehicleImages = [];
    if (data.vehicleImages) {
      if (Array.isArray(data.vehicleImages)) {
        processedVehicleImages = data.vehicleImages.filter((url: string) => url && url.trim() !== '');
      } else if (typeof data.vehicleImages === 'string') {
        try {
          const parsed = JSON.parse(data.vehicleImages);
          processedVehicleImages = Array.isArray(parsed) ? parsed.filter((url: string) => url && url.trim() !== '') : [];
        } catch {
          processedVehicleImages = data.vehicleImages.trim() !== '' ? [data.vehicleImages] : [];
        }
      }
    }

    const vehicleData = {
      client_id: data.clientId,
      vin: data.vin,
      engine_number: data.engineNumber || null,
      brand: data.brand,
      model: data.model,
      license_plate: data.licensePlate,
      year: data.year ? parseInt(data.year) : null,
      color: data.color || null,
      mileage: data.mileage ? parseInt(data.mileage) : null,
      insurance_company: data.insuranceCompany || null,
      insurance_expiry_date: data.insuranceExpiryDate || null,
      arrival_date: data.arrivalDate || null,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      status: data.status || 'En attente',
      road_test: data.roadTest || null,
      road_test_notes: data.roadTestNotes || null,
      fuel_level: data.fuelLevel || null,
      pre_accident_defects: data.preAccidentDefects || null,
      work_items: processedWorkItems.length > 0 ? JSON.stringify(processedWorkItems) : null,
      registration_document_front_url: data.registrationDocumentFrontUrl || null,
      registration_document_back_url: data.registrationDocumentBackUrl || null,
      vehicle_image_url: data.vehicleImageUrl || null,
      vehicle_images: processedVehicleImages.length > 0 ? JSON.stringify(processedVehicleImages) : null,
      fuel_type: data.fuelType || null,
      user_id: user ? user.id : null,
    };

    console.log('Processed vehicle data:', vehicleData);

    if (dialogMode === 'create') {
      createVehicle.mutate(vehicleData);
    } else if (dialogMode === 'edit' && selectedVehicle) {
      console.log('Updating vehicle with ID:', selectedVehicle.id);
      updateVehicle.mutate({
        id: selectedVehicle.id,
        data: vehicleData
      });
    }
    setDialogOpen(false);
  };

  // Filter vehicles based on search only (no status filter since status doesn't exist in DB)
  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = searchQuery === '' || 
      vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.license_plate?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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
