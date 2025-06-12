
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
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

  // Préparer les options pour SearchableSelect
  const vehicleOptions = (vehicles || []).map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate}`
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status" required>Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => onChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Validé">Validé</SelectItem>
              <SelectItem value="Payé">Payé</SelectItem>
              <SelectItem value="Refusé">Refusé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="assign_to_vehicle"
            checked={formData.assign_to_vehicle}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="assign_to_vehicle">Affecter à un véhicule existant ?</Label>
        </div>
      </div>

      {formData.assign_to_vehicle && (
        <div>
          <Label htmlFor="vehicle_id" required>Véhicule</Label>
          <SearchableSelect
            options={vehicleOptions}
            value={formData.vehicle_id || ''}
            onValueChange={(value) => onChange('vehicle_id', value)}
            placeholder={isLoading ? "Chargement..." : "Sélectionner un véhicule"}
            searchPlaceholder="Rechercher un véhicule..."
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  );
};
