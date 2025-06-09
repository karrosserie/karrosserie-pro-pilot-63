
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useClients } from '@/hooks/use-clients';
import { useVehicles } from '@/hooks/use-vehicles';

interface InvoiceAssignmentSectionProps {
  formData: any;
  errors?: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  clientOptions?: any[];
  isLoadingClients?: boolean;
}

export const InvoiceAssignmentSection = ({ formData, errors, onFieldChange, clientOptions, isLoadingClients }: InvoiceAssignmentSectionProps) => {
  const { clients } = useClients();
  const { vehicles } = useVehicles();

  // Use provided clientOptions or fallback to hook data
  const availableClientOptions = clientOptions || clients?.map(client => ({
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
    onFieldChange('clientId', value);
    // Reset vehicle selection when client changes
    if (formData.vehicleId) {
      onFieldChange('vehicleId', '');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="clientId" required>Client</Label>
        <SearchableSelect
          options={availableClientOptions}
          value={formData.clientId || ''}
          onValueChange={handleClientChange}
          placeholder="Sélectionner un client"
          searchPlaceholder="Rechercher un client..."
        />
        {errors?.clientId && (
          <p className="text-sm text-red-500">{errors.clientId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicleId" required>Véhicule</Label>
        <SearchableSelect
          options={vehicleOptions}
          value={formData.vehicleId || ''}
          onValueChange={(value) => onFieldChange('vehicleId', value)}
          placeholder="Sélectionner un véhicule"
          searchPlaceholder="Rechercher un véhicule..."
          disabled={!formData.clientId}
        />
        {errors?.vehicleId && (
          <p className="text-sm text-red-500">{errors.vehicleId}</p>
        )}
      </div>
    </div>
  );
};
