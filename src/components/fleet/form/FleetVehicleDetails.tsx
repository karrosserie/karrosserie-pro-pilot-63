
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FleetVehicleDetailsProps {
  formData: {
    year: number;
    license_plate: string;
    color: string;
  };
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const FleetVehicleDetails: React.FC<FleetVehicleDetailsProps> = ({
  formData,
  isViewMode,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      {/* License Plate, Year, Color */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="license_plate">
            Plaque d'immatriculation <span className="text-red-500">*</span>
          </Label>
          <Input
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            name="year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default FleetVehicleDetails;
