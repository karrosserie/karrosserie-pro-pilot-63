
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Switch } from '@/components/ui/switch';
import { useVehicles } from '@/hooks/use-vehicles';
import { Expense } from './types';

interface VehicleAssignmentFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const VehicleAssignmentFields = ({ formData, onChange }: VehicleAssignmentFieldsProps) => {
  const { vehicles, isLoading } = useVehicles();

  const vehicleOptions = (vehicles || []).map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate || 'Sans plaque'}`
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="assign_to_vehicle"
          checked={formData.assign_to_vehicle}
          onCheckedChange={(checked) => {
            onChange('assign_to_vehicle', checked);
            if (!checked) {
              onChange('vehicle_id', undefined);
            }
          }}
        />
        <Label htmlFor="assign_to_vehicle">Assigner à un véhicule</Label>
      </div>

      {formData.assign_to_vehicle && (
        <div>
          <Label htmlFor="vehicle_id">Véhicule</Label>
          <SearchableSelect
            options={vehicleOptions}
            value={formData.vehicle_id || ''}
            onValueChange={(value) => onChange('vehicle_id', value || undefined)}
            placeholder={isLoading ? "Chargement..." : "Sélectionner un véhicule"}
            searchPlaceholder="Rechercher un véhicule..."
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};
