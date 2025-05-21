
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Search, Plus } from 'lucide-react';
import { useVehicles } from '@/hooks/use-vehicles';
import { Vehicle } from '@/services/supabase/vehicles';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import VehicleDialog from './VehicleDialog';

const VehicleList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const { vehicles, isLoading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles();

  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDialogMode('edit');
    setDialogOpen(true);
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
        user_id: 'user-id-placeholder', // Sera remplacé par auth.uid() côté serveur
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
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "license_plate",
      header: "Immatriculation",
    },
    {
      accessorKey: "brand",
      header: "Marque",
    },
    {
      accessorKey: "model",
      header: "Modèle",
    },
    {
      accessorKey: "year",
      header: "Année",
    },
    {
      accessorKey: "color",
      header: "Couleur",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.color && (
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: row.original.color }} 
            />
          )}
          {row.original.color}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="text-right space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewVehicle(row.original)}>
            Voir
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEditVehicle(row.original)}>
            Éditer
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <TableLoading />;
  
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="card-container animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Véhicules</h2>
        
        <div className="flex items-center mt-4 md:mt-0 w-full md:w-auto space-x-2">
          <Button className="btn-primary" onClick={handleCreateVehicle}>
            <Car className="h-4 w-4 mr-2" />
            Nouveau véhicule
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={vehicles || []}
        searchKey="license_plate"
        searchPlaceholder="Rechercher un véhicule..."
      />

      {/* Vehicle Dialog */}
      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          dialogMode === 'create' 
            ? 'Ajouter un véhicule' 
            : dialogMode === 'edit' 
            ? 'Modifier le véhicule' 
            : 'Détails du véhicule'
        }
        description={
          dialogMode === 'create' 
            ? 'Saisissez les informations du nouveau véhicule.'
            : dialogMode === 'edit'
            ? 'Modifiez les informations du véhicule.'
            : ''
        }
        defaultValues={selectedVehicle ? {
          brand: selectedVehicle.brand || '',
          model: selectedVehicle.model || '',
          year: selectedVehicle.year?.toString() || '',
          licensePlate: selectedVehicle.license_plate || '',
          color: selectedVehicle.color || '',
          vin: selectedVehicle.vin || '',
          mileage: selectedVehicle.mileage?.toString() || '',
          fuelType: selectedVehicle.fuel_type || '',
          clientId: selectedVehicle.client_id || '',
        } : {}}
        onSubmit={handleVehicleSubmit}
        mode={dialogMode}
      />
    </div>
  );
};

export default VehicleList;
