
import { useState } from 'react';
import { useVehicles } from '@/hooks/use-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useCarBrands } from '@/hooks/use-car-brands';

export function useVehiclesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedVehicleForDocument, setSelectedVehicleForDocument] = useState<any>(null);

  const { vehicles, isLoading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { user } = useAuth();
  const { carBrands } = useCarBrands();

  // Filter vehicles based on search query
  const filteredVehicles = vehicles?.filter(vehicle => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      vehicle.license_plate?.toLowerCase().includes(searchLower) ||
      vehicle.car_brands?.name?.toLowerCase().includes(searchLower) ||
      vehicle.car_models?.name?.toLowerCase().includes(searchLower) ||
      vehicle.clients?.first_name?.toLowerCase().includes(searchLower) ||
      vehicle.clients?.last_name?.toLowerCase().includes(searchLower) ||
      vehicle.vin?.toLowerCase().includes(searchLower)
    );
  }) || [];

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

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      await deleteVehicle.mutateAsync(vehicleId);
    }
  };

  const handleVehicleSubmit = async (data: any) => {
    console.log('Vehicle submit with data:', data);
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      // Find brand ID from name if needed
      let brandId = data.brandId;
      if (!brandId && data.brand) {
        const selectedBrand = carBrands.find(brand => brand.name === data.brand);
        brandId = selectedBrand?.id;
        console.log('Found brand ID for', data.brand, ':', brandId);
      }

      // Use model ID if available, otherwise use modelId field
      let modelId = data.modelId;
      if (!modelId && data.model) {
        // If we only have model name, we need the modelId field that should be set
        modelId = data.modelId;
        console.log('Using modelId:', modelId);
      }

      if (!brandId) {
        console.error('Brand ID not found for brand:', data.brand);
        alert('Erreur: Impossible de trouver l\'ID de la marque');
        return;
      }

      if (!modelId) {
        console.error('Model ID not found for model:', data.model);
        alert('Erreur: Impossible de trouver l\'ID du modèle');
        return;
      }

      // Prepare the vehicle data using IDs
      const vehicleData = {
        client_id: data.clientId,
        vin: data.vin,
        brand_id: brandId,
        model_id: modelId,
        license_plate: data.licensePlate,
        engine_number: data.engineNumber,
        year: data.year ? parseInt(data.year) : null,
        color: data.color,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        insurance_company_id: data.insuranceCompanyId,
        insurance_expiry_date: data.insuranceExpiryDate || null,
        start_date: data.startDate || null,
        arrival_date: data.arrivalDate || null,
        end_date: data.endDate || null,
        status: data.status || 'En attente',
        road_test: data.roadTest,
        road_test_notes: data.roadTestNotes,
        fuel_level: data.fuelLevel || 50,
        pre_accident_defects: data.preAccidentDefects,
        work_items: JSON.stringify(data.workItems?.filter((item: string) => item.trim() !== '') || []),
        registration_document_front_url: data.registrationDocumentFrontUrl,
        registration_document_back_url: data.registrationDocumentBackUrl,
        vehicle_image_url: data.vehicleImageUrl,
        vehicle_images: JSON.stringify(data.vehicleImages?.filter((img: string) => img.trim() !== '') || []),
        user_id: user.id
      };

      console.log('Prepared vehicle data for submission:', vehicleData);

      if (dialogMode === 'create') {
        await createVehicle.mutateAsync(vehicleData);
      } else if (dialogMode === 'edit' && selectedVehicle) {
        const { user_id, ...updateData } = vehicleData;
        await updateVehicle.mutateAsync({
          id: selectedVehicle.id,
          data: updateData
        });
      }

      setDialogOpen(false);
    } catch (error) {
      console.error('Error submitting vehicle:', error);
    }
  };

  const handleCreateQuote = (vehicle: any) => {
    setSelectedVehicleForDocument(vehicle);
    setQuoteDialogOpen(true);
  };

  const handleCreateInvoice = (vehicle: any) => {
    setSelectedVehicleForDocument(vehicle);
    setInvoiceDialogOpen(true);
  };

  return {
    dialogOpen,
    dialogMode,
    selectedVehicle,
    searchQuery,
    vehicles: filteredVehicles,
    isLoading,
    error,
    quoteDialogOpen,
    setQuoteDialogOpen,
    invoiceDialogOpen,
    setInvoiceDialogOpen,
    selectedVehicleForDocument,
    setSelectedVehicleForDocument,
    setDialogOpen,
    setSearchQuery,
    handleCreateVehicle,
    handleViewVehicle,
    handleEditVehicle,
    handleDeleteVehicle,
    handleVehicleSubmit,
    handleCreateQuote,
    handleCreateInvoice,
  };
}
