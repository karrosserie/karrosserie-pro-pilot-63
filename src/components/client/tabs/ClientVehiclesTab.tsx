
import React from 'react';
import { useVehicles } from '@/hooks/use-vehicles';
import VehicleCardAdapter from '@/components/vehicle/VehicleCardAdapter';
import { Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientVehiclesTabProps {
  clientId: string;
}

const ClientVehiclesTab: React.FC<ClientVehiclesTabProps> = ({ clientId }) => {
  const { vehicles, isLoading, deleteVehicle } = useVehicles();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const clientVehicles = vehicles?.filter(vehicle => vehicle.client_id === clientId) || [];

  if (clientVehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun véhicule</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de véhicule enregistré.</p>
      </div>
    );
  }

  const handleViewVehicle = (vehicle: any) => {
    console.log('Viewing vehicle:', vehicle);
    toast({
      title: "Fonctionnalité à implémenter",
      description: `Affichage du véhicule ${vehicle.license_plate}`,
    });
  };

  const handleEditVehicle = (vehicle: any) => {
    console.log('Editing vehicle:', vehicle);
    toast({
      title: "Fonctionnalité à implémenter",
      description: `Édition du véhicule ${vehicle.license_plate}`,
    });
  };

  const handleDeleteVehicle = (vehicle: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.license_plate} ?`)) {
      deleteVehicle.mutate(vehicle.id);
    }
  };

  const handleCreateQuote = (vehicle: any) => {
    console.log('Creating quote for vehicle:', vehicle);
    toast({
      title: "Fonctionnalité à implémenter",
      description: `Création d'un devis pour le véhicule ${vehicle.license_plate}`,
    });
  };

  const handleCreateInvoice = (vehicle: any) => {
    console.log('Creating invoice for vehicle:', vehicle);
    toast({
      title: "Fonctionnalité à implémenter",
      description: `Création d'une facture pour le véhicule ${vehicle.license_plate}`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clientVehicles.map((vehicle) => (
        <VehicleCardAdapter
          key={vehicle.id}
          vehicle={vehicle}
          onView={() => handleViewVehicle(vehicle)}
          onEdit={() => handleEditVehicle(vehicle)}
          onDelete={() => handleDeleteVehicle(vehicle)}
          onCreateQuote={() => handleCreateQuote(vehicle)}
          onCreateInvoice={() => handleCreateInvoice(vehicle)}
        />
      ))}
    </div>
  );
};

export default ClientVehiclesTab;
