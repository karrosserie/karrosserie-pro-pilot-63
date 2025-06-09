
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useClients } from '@/hooks/use-clients';
import { useVehicles } from '@/hooks/use-vehicles';

interface InvoiceAssignmentSectionProps {
  formData: any;
  isViewMode: boolean;
  onChange: (field: string, value: any) => void;
}

export const InvoiceAssignmentSection = ({ formData, isViewMode, onChange }: InvoiceAssignmentSectionProps) => {
  const { clients } = useClients();
  const { vehicles } = useVehicles();

  // Prepare client options for searchable select
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: `${client.first_name} ${client.last_name}`
  })) || [];

  // Filter vehicles by selected client if any
  const filteredVehicles = formData.clientId 
    ? vehicles?.filter(vehicle => vehicle.client_id === formData.clientId) || []
    : vehicles || [];

  // Prepare vehicle options for searchable select
  const vehicleOptions = filteredVehicles.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`
  }));

  const handleClientChange = (value: string) => {
    onChange('clientId', value);
    // Reset vehicle selection when client changes
    if (formData.vehicleId) {
      onChange('vehicleId', '');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="clientId" required>Client</Label>
        <SearchableSelect
          options={clientOptions}
          value={formData.clientId || ''}
          onValueChange={handleClientChange}
          placeholder="Sélectionner un client"
          searchPlaceholder="Rechercher un client..."
          disabled={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicleId" required>Véhicule</Label>
        <SearchableSelect
          options={vehicleOptions}
          value={formData.vehicleId || ''}
          onValueChange={(value) => onChange('vehicleId', value)}
          placeholder="Sélectionner un véhicule"
          searchPlaceholder="Rechercher un véhicule..."
          disabled={isViewMode || !formData.clientId}
        />
      </div>
    </div>
  );
};
