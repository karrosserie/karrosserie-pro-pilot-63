
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isValidVin } from '@/services/vin-decoder';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

interface FleetVehicleBasicInfoProps {
  formData: {
    vin: string;
    engine_number: string;
    brand: string;
    model: string;
  };
  selectedBrandId: string;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBrandChange: (brandId: string) => void;
  onModelChange: (modelName: string) => void;
}

const FleetVehicleBasicInfo: React.FC<FleetVehicleBasicInfoProps> = ({
  formData,
  selectedBrandId,
  isViewMode,
  onInputChange,
  onBrandChange,
  onModelChange
}) => {
  const { carBrands } = useCarBrands();
  const { carModels } = useCarModels(selectedBrandId);

  return (
    <div className="space-y-4">
      {/* VIN and Engine Number */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vin">
            Numéro de série (VIN) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={onInputChange}
            disabled={isViewMode}
            required
            placeholder="17 caractères"
            maxLength={17}
            style={{
              textTransform: 'uppercase'
            }}
          />
          {formData.vin && !isValidVin(formData.vin) && (
            <p className="text-sm text-red-500 mt-1">
              Le VIN doit contenir exactement 17 caractères alphanumériques (sans I, O, Q)
            </p>
          )}
          {formData.vin && isValidVin(formData.vin) && (
            <p className="text-sm text-green-600 mt-1">
              ✓ VIN valide
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="engine_number">Numéro de moteur</Label>
          <Input
            id="engine_number"
            name="engine_number"
            value={formData.engine_number}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Brand and Model */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Marque *</Label>
          <Select
            value={selectedBrandId}
            onValueChange={onBrandChange}
            disabled={isViewMode}
          >
            <SelectTrigger id="brand">
              <SelectValue placeholder="Sélectionner une marque" />
            </SelectTrigger>
            <SelectContent>
              {carBrands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="model">Modèle *</Label>
          <Select
            value={formData.model}
            onValueChange={onModelChange}
            disabled={isViewMode || !selectedBrandId}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder="Sélectionner un modèle" />
            </SelectTrigger>
            <SelectContent>
              {carModels.map((model) => (
                <SelectItem key={model.id} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FleetVehicleBasicInfo;
