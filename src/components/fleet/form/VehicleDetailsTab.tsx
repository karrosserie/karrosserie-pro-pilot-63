
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

  const handleImageAdd = (url: string) => {
    console.log('VehicleDetailsTab - Adding image:', url);
    console.log('Current images before add:', vehicleImages);
    onImageAdd(url);
  };

  const handleImageRemove = (index: number) => {
    console.log('VehicleDetailsTab - Removing image at index:', index);
    onImageRemove(index);
  };

  const handleImageUpdate = (index: number, url: string) => {
    console.log('VehicleDetailsTab - Updating image at index:', index, 'with url:', url);
    onImageUpdate(index, url);
  };

  // S'assurer qu'il y a au moins un slot vide pour ajouter une image
  const displayImages = vehicleImages.length === 0 ? [''] : vehicleImages;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column: Kilométrage et carburant - encore plus compacte */}
        <div className="space-y-6">
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
            <div className="flex justify-center">
              <FuelGauge
                value={fuelLevel}
                onChange={onFuelLevelChange}
                disabled={isViewMode}
              />
            </div>
          </div>
        </div>

        {/* Right column: Photos du véhicule - encore plus élargie */}
        <div className="lg:col-span-4 space-y-4">
          <MultipleVehicleImages
            vehicleId={vehicleId}
            vehicleImages={displayImages}
            isViewMode={isViewMode}
            onImageAdd={handleImageAdd}
            onImageRemove={handleImageRemove}
            onImageUpdate={handleImageUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsTab;
