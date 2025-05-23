
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VehicleDetailsFormProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  formData,
  isViewMode,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vin">Numéro de série (VIN)</Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="engineNumber">Numéro de moteur</Label>
          <Input
            id="engineNumber"
            name="engineNumber"
            value={formData.engineNumber}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsForm;
