
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CessionFormData, CessionFormErrors } from './types';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

interface CessionAssignmentSectionProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
  clientOptions: Client[];
  vehicleOptions: Vehicle[];
  isLoadingClients: boolean;
  isLoadingVehicles: boolean;
}

export const CessionAssignmentSection = ({
  formData,
  errors,
  onFieldChange,
  vehicleOptions,
  isLoadingVehicles
}: CessionAssignmentSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Assignation</h3>
      
      <div className="space-y-2">
        <Label htmlFor="vehicle_id">Véhicule *</Label>
        <Select 
          value={formData.vehicle_id || ''} 
          onValueChange={(value) => onFieldChange('vehicle_id', value || null)}
          disabled={isLoadingVehicles}
        >
          <SelectTrigger className={errors.vehicle_id ? 'border-red-500' : ''}>
            <SelectValue placeholder={isLoadingVehicles ? "Chargement..." : "Sélectionner un véhicule"} />
          </SelectTrigger>
          <SelectContent>
            {vehicleOptions.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.vehicle_id && (
          <p className="text-sm text-red-500">{errors.vehicle_id}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buyer_name">Nom de l'acheteur *</Label>
          <Input
            id="buyer_name"
            value={formData.buyer_name}
            onChange={(e) => onFieldChange('buyer_name', e.target.value)}
            placeholder="Nom de la compagnie d'assurance"
            className={errors.buyer_name ? 'border-red-500' : ''}
          />
          {errors.buyer_name && (
            <p className="text-sm text-red-500">{errors.buyer_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="buyer_contact">Contact acheteur *</Label>
          <Input
            id="buyer_contact"
            value={formData.buyer_contact}
            onChange={(e) => onFieldChange('buyer_contact', e.target.value)}
            placeholder="Email ou téléphone"
            className={errors.buyer_contact ? 'border-red-500' : ''}
          />
          {errors.buyer_contact && (
            <p className="text-sm text-red-500">{errors.buyer_contact}</p>
          )}
        </div>
      </div>
    </div>
  );
};
