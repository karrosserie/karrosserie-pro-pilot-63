
import React, { useState } from 'react';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import FleetVehicleDialog from '@/components/fleet/FleetVehicleDialog';
import FleetVehiclesTable from '@/components/fleet/FleetVehiclesTable';
import FleetLoansHistory from '@/components/fleet/FleetLoansHistory';
import FleetCurrentLoans from '@/components/fleet/FleetCurrentLoans';
import FleetViolations from '@/components/fleet/FleetViolations';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

// Données mockées pour les prêts en cours
const currentLoans = [
  {
    id: '1',
    vehicle: 'Renault Clio - CC-222-DD',
    client: 'Marie Martin',
    startDate: '15/05/2023',
    expectedReturnDate: '22/05/2023'
  },
  {
    id: '2',
    vehicle: 'Toyota Yaris - GG-444-HH',
    client: 'Pierre Durand',
    startDate: '12/05/2023',
    expectedReturnDate: '19/05/2023'
  }
];

const Fleet = () => {
  const { vehicles, isLoading, error } = useFleetVehicles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [searchTerm, setSearchTerm] = useState('');

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
          />
          
          <FleetLoansHistory />
        </div>
        
        <div className="space-y-6">
          <FleetCurrentLoans currentLoans={currentLoans} />
          <FleetViolations />
        </div>
      </div>

      <FleetVehicleDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        vehicle={selectedVehicle}
        mode={dialogMode}
      />
    </div>
  );
};

export default Fleet;
