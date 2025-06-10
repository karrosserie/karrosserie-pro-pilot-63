
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FleetVehicleDetailsProps {
  formData: {
    year: number;
    license_plate: string;
    color: string;
    mileage: string;
    status: string;
    notes: string;
  };
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const FleetVehicleDetails: React.FC<FleetVehicleDetailsProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange
}) => {
  return (
    <div className="space-y-4">
      {/* License Plate, Year, Color, and Mileage */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        
        <div>
          <Label htmlFor="mileage">Kilométrage</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => onSelectChange('status', value)}
          disabled={isViewMode}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Disponible">Disponible</SelectItem>
            <SelectItem value="Loué">Loué</SelectItem>
            <SelectItem value="En maintenance">En maintenance</SelectItem>
            <SelectItem value="Hors service">Hors service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={onInputChange}
          disabled={isViewMode}
          rows={3}
        />
      </div>
    </div>
  );
};

export default FleetVehicleDetails;
