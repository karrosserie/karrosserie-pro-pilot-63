
import { useState } from 'react';
import { useVehicles } from './use-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { VehicleWithRelations } from '@/services/supabase/vehicles';

export function useVehiclesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithRelations | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { vehicles, isLoading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const { user } = useAuth();

  // Filter vehicles based on search query
  const filteredVehicles = vehicles?.filter(vehicle => {
    const searchLower = searchQuery.toLowerCase();
    const brandName = vehicle.car_brands?.name?.toLowerCase() || '';
    const modelName = vehicle.car_models?.name?.toLowerCase() || '';
    const licensePlate = vehicle.license_plate?.toLowerCase() || '';
    const clientName = vehicle.clients 
      ? `${vehicle.clients.first_name} ${vehicle.clients.last_name}`.toLowerCase()
      : '';

    return brandName.includes(searchLower) ||
           modelName.includes(searchLower) ||
           licensePlate.includes(searchLower) ||
           clientName.includes(searchLower);
  }) || [];

  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: VehicleWithRelations) => {
    setSelectedVehicle(vehicle);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleWithRelations) => {
    setSelectedVehicle(vehicle);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: VehicleWithRelations) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      deleteVehicle.mutate(vehicle.id);
    }
  };

  const handleVehicleSubmit = (data: any) => {
    if (dialogMode === 'create') {
      createVehicle.mutate({
        ...data,
        user_id: user?.id
      });
    } else if (dialogMode === 'edit' && selectedVehicle) {
      updateVehicle.mutate({
        id: selectedVehicle.id,
        data
      });
    }
    setDialogOpen(false);
  };

  return {
    dialogOpen,
    dialogMode,
    selectedVehicle,
    searchQuery,
    vehicles: filteredVehicles,
    isLoading,
    error,
    setDialogOpen,
    setSearchQuery,
    handleCreateVehicle,
    handleViewVehicle,
    handleEditVehicle,
    handleDeleteVehicle,
    handleVehicleSubmit,
  };
}
