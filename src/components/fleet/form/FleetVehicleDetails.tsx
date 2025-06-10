
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
      {/* Year and License Plate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">
            Année <span className="text-red-500">*</span>
          </Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={onInputChange}
            disabled={isViewMode}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>
        
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
            placeholder="XX-XXX-XX"
            style={{
              textTransform: 'uppercase'
            }}
          />
        </div>
      </div>

      {/* Color field - kept for UI but not saved to DB */}
      <div>
        <Label htmlFor="color">Couleur</Label>
        <Input
          id="color"
          name="color"
          value={formData.color}
          onChange={onInputChange}
          disabled={isViewMode}
          placeholder="Couleur du véhicule"
        />
        <p className="text-xs text-gray-500 mt-1">
          Cette information est utilisée uniquement pour l'affichage
        </p>
      </div>
    </div>
  );
};

export default FleetVehicleDetails;
