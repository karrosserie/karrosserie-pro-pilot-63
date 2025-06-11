
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FuelGauge from '@/components/vehicle/form/FuelGauge';
import MultipleVehicleImages from '@/components/vehicle/form/MultipleVehicleImages';

interface VehicleDetailsTabProps {
  vehicleId: string;
  mileage: number;
  fuelLevel: number;
  vehicleImages: string[];
  onMileageChange: (mileage: number) => void;
  onFuelLevelChange: (level: number) => void;
  onImageAdd: (url: string) => void;
  onImageRemove: (index: number) => void;
  onImageUpdate: (index: number, url: string) => void;
  isViewMode?: boolean;
}

const VehicleDetailsTab: React.FC<VehicleDetailsTabProps> = ({
  vehicleId,
  mileage,
  fuelLevel,
  vehicleImages,
  onMileageChange,
  onFuelLevelChange,
  onImageAdd,
  onImageRemove,
  onImageUpdate,
  isViewMode = false
}) => {
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onMileageChange(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="mileage">Kilométrage actuel *</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={mileage}
            onChange={handleMileageChange}
            placeholder="Ex: 45000"
            disabled={isViewMode}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label>Niveau de carburant</Label>
          <FuelGauge
            value={fuelLevel}
            onChange={onFuelLevelChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="space-y-4">
        <MultipleVehicleImages
          vehicleId={vehicleId}
          vehicleImages={vehicleImages}
          isViewMode={isViewMode}
          onImageAdd={onImageAdd}
          onImageRemove={onImageRemove}
          onImageUpdate={onImageUpdate}
        />
      </div>
    </div>
  );
};

export default VehicleDetailsTab;
