
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useClients } from '@/hooks/use-clients';
import { useVehicles } from '@/hooks/use-vehicles';

interface QuoteAssignmentSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  clientOptions?: any[];
  isLoadingClients?: boolean;
}

export const QuoteAssignmentSection = ({ formData, onChange, clientOptions, isLoadingClients }: QuoteAssignmentSectionProps) => {
  const { clients } = useClients();
  const { vehicles } = useVehicles();

  // Use provided clientOptions or fallback to hook data
  const availableClientOptions = clientOptions || clients?.map(client => ({
    value: client.id,
    label: `${client.first_name} ${client.last_name}`
  })) || [];

  // Filter vehicles by selected client if any
  const filteredVehicles = formData.client_id 
    ? vehicles?.filter(vehicle => vehicle.client_id === formData.client_id) || []
    : vehicles || [];

  // Prepare vehicle options for searchable select
  const vehicleOptions = filteredVehicles.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`
  }));

  const handleClientChange = (value: string) => {
    onChange('client_id', value);
    // Reset vehicle selection when client changes
    if (formData.vehicle_id) {
      onChange('vehicle_id', '');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="client_id" required>Client</Label>
        <SearchableSelect
          options={availableClientOptions}
          value={formData.client_id || ''}
          onValueChange={handleClientChange}
          placeholder="Sélectionner un client"
          searchPlaceholder="Rechercher un client..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicle_id" required>Véhicule</Label>
        <SearchableSelect
          options={vehicleOptions}
          value={formData.vehicle_id || ''}
          onValueChange={(value) => onChange('vehicle_id', value)}
          placeholder="Sélectionner un véhicule"
          searchPlaceholder="Rechercher un véhicule..."
          disabled={!formData.client_id}
        />
      </div>
    </div>
  );
};
