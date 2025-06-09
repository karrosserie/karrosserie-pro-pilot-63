
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useVehicles } from '@/hooks/use-vehicles';

interface VehicleAssignmentFieldsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export const VehicleAssignmentFields = ({ formData, onChange }: VehicleAssignmentFieldsProps) => {
  const { vehicles } = useVehicles();

  // Prepare vehicle options for searchable select
  const vehicleOptions = vehicles?.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`
  })) || [];

  return (
    <div className="space-y-2">
      <Label htmlFor="vehicle_id">Véhicule (optionnel)</Label>
      <SearchableSelect
        options={vehicleOptions}
        value={formData.vehicle_id || ''}
        onValueChange={(value) => onChange('vehicle_id', value)}
        placeholder="Sélectionner un véhicule"
        searchPlaceholder="Rechercher un véhicule..."
      />
    </div>
  );
};
