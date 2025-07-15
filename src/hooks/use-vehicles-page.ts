
import { useState } from 'react';
import { useVehicles } from '@/hooks/use-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useNotification } from '@/hooks/use-notification';
import { carModelsService } from '@/services/supabase/car-models';

export function useVehiclesPage() {
  const { confirm } = useConfirmation();
  const { error: showError } = useNotification();
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
    const confirmed = await confirm({
      title: 'Supprimer le véhicule',
      description: 'Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      await deleteVehicle.mutateAsync(vehicleId);
    }
  };

  const handleVehicleSubmit = async (data: any) => {
    console.log('Vehicle submit with data:', data);
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    console.log('DEBUG - All form data fields:');
    console.log('- clientId:', data.clientId, typeof data.clientId);
    console.log('- brandId:', data.brandId, typeof data.brandId);
    console.log('- modelId:', data.modelId, typeof data.modelId);
    console.log('- insuranceCompanyId:', data.insuranceCompanyId, typeof data.insuranceCompanyId);

    try {
      const brandId = data.brandId;
      const modelId = data.modelId;

      if (!brandId) {
        console.error('Brand ID not provided');
        showError('Veuillez sélectionner une marque', 'Erreur');
        return;
      }

      if (!modelId) {
        console.error('Model ID not provided');
        showError('Veuillez sélectionner un modèle', 'Erreur');
        return;
      }

      // Prepare the vehicle data using IDs
      const vehicleData = {
        client_id: data.clientId || null, // Convert empty string to null
        vin: data.vin,
        brand_id: brandId,
        model_id: modelId,
        license_plate: data.licensePlate,
        engine_number: data.engineNumber,
        year: data.year ? parseInt(data.year) : null,
        color: data.color,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        insurance_company_id: data.insuranceCompanyId || null, // Convert empty string to null
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
        vehicle_images: (() => {
          const filteredImages = data.vehicleImages?.filter((img: any) => img.url && img.url.trim() !== '') || [];
          console.log('DEBUG - vehicleImages before saving:', filteredImages);
          return JSON.stringify(filteredImages);
        })(),
        user_id: user.id
      };

      console.log('DEBUG - vehicleData before submission:');
      console.log('- client_id:', vehicleData.client_id, typeof vehicleData.client_id);
      console.log('- brand_id:', vehicleData.brand_id, typeof vehicleData.brand_id);
      console.log('- model_id:', vehicleData.model_id, typeof vehicleData.model_id);
      console.log('- insurance_company_id:', vehicleData.insurance_company_id, typeof vehicleData.insurance_company_id);

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
