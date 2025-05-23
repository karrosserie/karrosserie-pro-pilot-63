
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VehicleIdentificationFieldsProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const VehicleIdentificationFields: React.FC<VehicleIdentificationFieldsProps> = ({
  formData,
  isViewMode,
  onInputChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="vin">
          Numéro de série (VIN) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="vin"
          name="vin"
          value={formData.vin || ''}
          onChange={onInputChange}
          disabled={isViewMode}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="engineNumber">Numéro de moteur</Label>
        <Input
          id="engineNumber"
          name="engineNumber"
          value={formData.engineNumber || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>
    </div>
  );
};

export default VehicleIdentificationFields;
