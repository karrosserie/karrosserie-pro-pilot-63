
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useVehicles } from '@/hooks/use-vehicles';
import { Expense } from './types';

interface VehicleAssignmentFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const VehicleAssignmentFields = ({ formData, onChange }: VehicleAssignmentFieldsProps) => {
  const { vehicles } = useVehicles();
  const hasProofUploaded = formData.proof_url && formData.proof_url.trim() !== '';

  // Prepare vehicle options for searchable select
  const vehicleOptions = vehicles?.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`
  })) || [];

  return (
    <div className="space-y-2">
      <Label htmlFor="vehicle">Véhicule associé</Label>
      <SearchableSelect
        options={vehicleOptions}
        value={formData.vehicle_id || ''}
        onValueChange={(value) => onChange('vehicle_id', value)}
        placeholder="Sélectionner un véhicule (optionnel)"
        searchPlaceholder="Rechercher un véhicule..."
        disabled={!hasProofUploaded}
        className={!hasProofUploaded ? 'bg-gray-100 cursor-not-allowed' : ''}
      />
    </div>
  );
};
