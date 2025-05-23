
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VehicleSpecificationsProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const VehicleSpecifications: React.FC<VehicleSpecificationsProps> = ({
  formData,
  isViewMode,
  onInputChange
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="licensePlate">
          Plaque d'immatriculation <span className="text-red-500">*</span>
        </Label>
        <Input
          id="licensePlate"
          name="licensePlate"
          value={formData.licensePlate || ''}
          onChange={onInputChange}
          disabled={isViewMode}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">Année</Label>
        <Input
          id="year"
          name="year"
          type="number"
          min="1900"
          max={new Date().getFullYear() + 1}
          value={formData.year || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Couleur</Label>
        <Input
          id="color"
          name="color"
          value={formData.color || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mileage">Kilométrage</Label>
        <Input
          id="mileage"
          name="mileage"
          type="number"
          value={formData.mileage || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>
    </div>
  );
};

export default VehicleSpecifications;
