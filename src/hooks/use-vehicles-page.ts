
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
    if (dialogMode === 'create') {
      createVehicle.mutate({
        brand: data.brand,
        model: data.model,
        year: data.year ? parseInt(data.year) : null,
        license_plate: data.licensePlate,
        color: data.color,
        vin: data.vin,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        fuel_type: data.fuelType,
        client_id: data.clientId,
        user_id: user ? user.id : null,
      });
    } else if (dialogMode === 'edit' && selectedVehicle) {
      updateVehicle.mutate({
        id: selectedVehicle.id,
        data: {
          brand: data.brand,
          model: data.model,
          year: data.year ? parseInt(data.year) : null,
          license_plate: data.licensePlate,
          color: data.color,
          vin: data.vin,
          mileage: data.mileage ? parseInt(data.mileage) : null,
          fuel_type: data.fuelType,
          client_id: data.clientId,
        }
      });
    }
    setDialogOpen(false);
  };

  // Filter vehicles based on status and search - fix the status issue
  const filteredVehicles = vehicles?.filter(vehicle => {
    // Set default status since it doesn't exist in database
    const vehicleStatus = 'En attente'; // Default status for all vehicles
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
