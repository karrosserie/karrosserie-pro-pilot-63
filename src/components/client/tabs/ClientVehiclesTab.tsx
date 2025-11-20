
import React, { useState } from 'react';
import { useVehicles } from '@/hooks/use-vehicles';
import { useConfirmation } from '@/hooks/use-confirmation';
import VehicleCardAdapter from '@/components/vehicle/VehicleCardAdapter';
import VehicleDetailsDialog from '@/components/vehicle/VehicleDetailsDialog';
import VehicleDocumentDialogs from '@/components/vehicle/VehicleDocumentDialogs';

import { Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClientVehiclesTabProps {
  clientId: string;
}

const ClientVehiclesTab: React.FC<ClientVehiclesTabProps> = ({ clientId }) => {
  const { vehicles, isLoading, deleteVehicle } = useVehicles();
  const { confirm } = useConfirmation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'create'>('view');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  
  const [selectedVehicleForDocument, setSelectedVehicleForDocument] = useState<any>(null);

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
    setSelectedVehicle(vehicle);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteVehicle = async (vehicle: any) => {
    const confirmed = await confirm({
      title: 'Supprimer le véhicule',
      description: `Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.license_plate} ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      deleteVehicle.mutate(vehicle.id);
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


  const handleVehicleSubmit = (data: any) => {
    // This will be handled by the VehicleDialog component
    setDialogOpen(false);
  };

  return (
    <>
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

      <VehicleDetailsDialog
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
        defaultValues={
          dialogMode === 'create' 
            ? { client_id: clientId }
            : selectedVehicle || {}
        }
        onSubmit={handleVehicleSubmit}
        mode={dialogMode}
      />

      <VehicleDocumentDialogs
        quoteDialogOpen={quoteDialogOpen}
        setQuoteDialogOpen={setQuoteDialogOpen}
        invoiceDialogOpen={invoiceDialogOpen}
        setInvoiceDialogOpen={setInvoiceDialogOpen}
        selectedVehicleForDocument={selectedVehicleForDocument}
        setSelectedVehicleForDocument={setSelectedVehicleForDocument}
      />

    </>
  );
};

export default ClientVehiclesTab;
