
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Car, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import FleetVehiclesGrid from '@/components/fleet/FleetVehiclesGrid';
import FleetVehicleDialog from '@/components/fleet/FleetVehicleDialog';
import FleetReservationDialog from '@/components/fleet/FleetReservationDialog';
import FleetReservationList from '@/components/fleet/FleetReservationList';
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

const Fleet = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  const { 
    vehicles, 
    isLoading: vehiclesLoading, 
    error: vehiclesError, 
    createVehicle, 
    updateVehicle, 
    deleteVehicle 
  } = useFleetVehicles();

  const { 
    createReservation, 
    updateReservation, 
    deleteReservation 
  } = useFleetReservations();

  // Vehicle handlers
  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setDialogMode('create');
    setVehicleDialogOpen(true);
  };

  const handleViewVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDialogMode('view');
    setVehicleDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDialogMode('edit');
    setVehicleDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule de courtoisie ?')) {
      deleteVehicle.mutate(vehicleId);
    }
  };

  const handleReserveVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setSelectedReservation({ fleet_vehicle_id: vehicle.id });
    setDialogMode('create');
    setReservationDialogOpen(true);
  };

  const handleVehicleSubmit = (data: any) => {
    if (dialogMode === 'create') {
      createVehicle.mutate(data);
    } else if (dialogMode === 'edit' && selectedVehicle) {
      updateVehicle.mutate({ id: selectedVehicle.id, data });
    }
  };

  // Reservation handlers
  const handleCreateReservation = () => {
    setSelectedReservation(null);
    setDialogMode('create');
    setReservationDialogOpen(true);
  };

  const handleReservationSubmit = (data: any) => {
    if (dialogMode === 'create') {
      createReservation.mutate(data);
    } else if (dialogMode === 'edit' && selectedReservation) {
      updateReservation.mutate({ id: selectedReservation.id, data });
    }
  };

  // Filter vehicles based on search
  const filteredVehicles = vehicles?.filter(vehicle => 
    searchQuery === '' || 
    vehicle.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.license_plate?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (vehiclesLoading) return <TableLoading />;
  if (vehiclesError) return <ErrorMessage message={vehiclesError.message} />;

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Véhicules de courtoisie</h1>
        <p className="text-gray-600 mt-1">
          Gérez votre flotte de véhicules de courtoisie et leurs réservations.
        </p>
      </div>

      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vehicles">
            <Car className="h-4 w-4 mr-2" />
            Véhicules
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <Calendar className="h-4 w-4 mr-2" />
            Réservations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-6">
          {/* Vehicles Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Rechercher un véhicule..." 
                className="pl-10 bg-white border border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={handleCreateVehicle}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau véhicule
            </Button>
          </div>

          {/* Vehicles Grid */}
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'Aucun véhicule trouvé' : 'Aucun véhicule de courtoisie'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? 'Essayez de modifier votre recherche'
                  : 'Commencez par ajouter votre premier véhicule de courtoisie'
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateVehicle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un véhicule
                </Button>
              )}
            </div>
          ) : (
            <FleetVehiclesGrid
              vehicles={filteredVehicles}
              onViewVehicle={handleViewVehicle}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onReserveVehicle={handleReserveVehicle}
            />
          )}
        </TabsContent>

        <TabsContent value="reservations" className="space-y-6">
          {/* Reservations Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Réservations</h2>
            <Button 
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={handleCreateReservation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réservation
            </Button>
          </div>

          {/* Reservations List */}
          <FleetReservationList />
        </TabsContent>
      </Tabs>

      {/* Vehicle Dialog */}
      <FleetVehicleDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        title={
          dialogMode === 'create' 
            ? 'Ajouter un véhicule de courtoisie' 
            : dialogMode === 'edit' 
            ? 'Modifier le véhicule' 
            : 'Détails du véhicule'
        }
        description={
          dialogMode === 'create' 
            ? 'Ajoutez un nouveau véhicule à votre flotte de courtoisie.'
            : dialogMode === 'edit'
            ? 'Modifiez les informations du véhicule.'
            : ''
        }
        defaultValues={selectedVehicle || {}}
        onSubmit={handleVehicleSubmit}
        mode={dialogMode}
      />

      {/* Reservation Dialog */}
      <FleetReservationDialog
        open={reservationDialogOpen}
        onOpenChange={setReservationDialogOpen}
        title={
          dialogMode === 'create' 
            ? 'Nouvelle réservation' 
            : dialogMode === 'edit' 
            ? 'Modifier la réservation' 
            : 'Détails de la réservation'
        }
        description={
          dialogMode === 'create' 
            ? 'Créez une nouvelle réservation de véhicule de courtoisie.'
            : dialogMode === 'edit'
            ? 'Modifiez les informations de la réservation.'
            : ''
        }
        defaultValues={selectedReservation || {}}
        onSubmit={handleReservationSubmit}
        mode={dialogMode}
      />
    </div>
  );
};

export default Fleet;
