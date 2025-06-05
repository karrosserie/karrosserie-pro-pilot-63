
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicles } from '@/hooks/use-vehicles';
import { Expense } from './types';

interface VehicleAssignmentFieldsProps {
  formData: Expense;
  onChange: (field: keyof Expense, value: any) => void;
}

export const VehicleAssignmentFields = ({ formData, onChange }: VehicleAssignmentFieldsProps) => {
  const { vehicles, isLoading } = useVehicles();

  const handleSwitchChange = (checked: boolean) => {
    onChange('assign_to_vehicle', checked);
    if (!checked) {
      onChange('vehicle_id', '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="assign_to_vehicle"
          checked={formData.assign_to_vehicle}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="assign_to_vehicle">Affecter à un véhicule existant ?</Label>
      </div>

      {formData.assign_to_vehicle && (
        <div>
          <Label htmlFor="vehicle_id" required>Véhicule</Label>
          <Select 
            value={formData.vehicle_id || ''} 
            onValueChange={(value) => onChange('vehicle_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un véhicule" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="" disabled>Chargement...</SelectItem>
              ) : vehicles && vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>Aucun véhicule disponible</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
