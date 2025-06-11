
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import MultipleVehicleImages from '@/components/vehicle/form/MultipleVehicleImages';

interface VehicleDetailsTabProps {
  vehicleId: string;
  mileage: number;
  fuelLevel: number;
  vehicleImages: string[];
  onMileageChange: (mileage: number) => void;
  onFuelLevelChange: (fuelLevel: number) => void;
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
  return (
    <div className="space-y-6">
      {/* Kilométrage */}
      <div className="space-y-2">
        <Label htmlFor="mileage">Kilométrage de retour</Label>
        <Input
          id="mileage"
          type="number"
          value={mileage}
          onChange={(e) => onMileageChange(Number(e.target.value))}
          disabled={isViewMode}
          className="max-w-xs"
        />
      </div>

      {/* Niveau de carburant */}
      <div className="space-y-4">
        <Label>Niveau de carburant (%)</Label>
        <div className="space-y-2">
          <Slider
            value={[fuelLevel]}
            onValueChange={(value) => onFuelLevelChange(value[0])}
            max={100}
            step={5}
            className="w-full max-w-md"
            disabled={isViewMode}
          />
          <div className="text-sm text-gray-600">{fuelLevel}%</div>
        </div>
      </div>

      {/* Photos du véhicule */}
      <div className="space-y-4">
        <Label>Photos du véhicule au retour</Label>
        <MultipleVehicleImages
          vehicleId={vehicleId}
          vehicleImages={vehicleImages}
          onImageAdd={onImageAdd}
          onImageRemove={onImageRemove}
          onImageUpdate={onImageUpdate}
          isViewMode={isViewMode}
        />
        {isViewMode && vehicleImages.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune photo disponible</p>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailsTab;
