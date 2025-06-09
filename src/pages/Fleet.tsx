
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Car, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FleetReservationList } from '@/components/fleet/FleetReservationList';
import FleetVehicleDialog from '@/components/fleet/FleetVehicleDialog';
import FleetVehicleCard from '@/components/fleet/FleetVehicleCard';
import FleetReservationDialog from '@/components/fleet/FleetReservationDialog';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

const Fleet = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const { vehicles: fleetVehicles, isLoading: vehiclesLoading, error: vehiclesError } = useFleetVehicles();
  const { reservations, isLoading: reservationsLoading, error: reservationsError } = useFleetReservations();

  const filteredVehicles = fleetVehicles?.filter(vehicle =>
    vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.license_plate?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setVehicleDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setVehicleDialogOpen(true);
  };

  const handleCreateReservation = () => {
    setSelectedReservation(null);
    setReservationDialogOpen(true);
  };

  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation);
    setReservationDialogOpen(true);
  };

  if (vehiclesLoading || reservationsLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (vehiclesError || reservationsError) {
    return (
      <div className="page-container">
        <ErrorMessage message="Erreur lors du chargement des données de la flotte" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Véhicules de courtoisie</h1>
        <p className="text-gray-600 mt-1">
          Gérez votre flotte de véhicules de courtoisie et leurs réservations.
        </p>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-6">
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un véhicule..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={handleCreateVehicle}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <FleetVehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={() => handleEditVehicle(vehicle)}
                onReserve={() => {
                  setSelectedReservation({ vehicle_id: vehicle.id });
                  setReservationDialogOpen(true);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-6">
          <div className="flex justify-end">
            <Button
              className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
              onClick={handleCreateReservation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle réservation
            </Button>
          </div>

          <FleetReservationList
            reservations={reservations || []}
            onEdit={handleEditReservation}
          />
        </TabsContent>
      </Tabs>

      <FleetVehicleDialog
        vehicle={selectedVehicle}
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
      />

      <FleetReservationDialog
        reservation={selectedReservation}
        open={reservationDialogOpen}
        onOpenChange={setReservationDialogOpen}
      />
    </div>
  );
};

export default Fleet;
