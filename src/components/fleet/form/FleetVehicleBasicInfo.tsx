
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isValidVin } from '@/services/vin-decoder';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

interface FleetVehicleBasicInfoProps {
  formData: {
    vin: string;
    engine_number: string;
    brand_id: string;
    model_id: string;
    status: string;
  };
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBrandChange: (brandId: string) => void;
  onModelChange: (modelId: string) => void;
  onSelectChange: (name: string, value: string) => void;
}

const FleetVehicleBasicInfo: React.FC<FleetVehicleBasicInfoProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onBrandChange,
  onModelChange,
  onSelectChange
}) => {
  const { carBrands, isLoading: brandsLoading } = useCarBrands();
  const { carModels, isLoading: modelsLoading } = useCarModels(formData.brand_id);

  console.log('FleetVehicleBasicInfo - Render with:');
  console.log('  - carBrands count:', carBrands?.length || 0);
  console.log('  - formData.brand_id:', formData.brand_id);
  console.log('  - carModels count:', carModels?.length || 0);

  // Prepare brand options - use brand names instead of IDs
  const brandOptions = carBrands?.map(brand => ({
    value: brand.name, // Use name instead of ID
    label: brand.name
  })) || [];

  // Find brand ID for fetching models based on selected brand name
  const selectedBrand = carBrands?.find(brand => brand.name === formData.brand_id);
  const actualBrandId = selectedBrand?.id || '';

  // Use the actual brand ID for fetching models
  const { carModels: actualCarModels, isLoading: actualModelsLoading } = useCarModels(actualBrandId);

  // Prepare model options - use model names instead of IDs
  const modelOptions = actualCarModels?.map(model => ({
    value: model.name, // Use name instead of ID
    label: model.name
  })) || [];

  console.log('FleetVehicleBasicInfo - Prepared options:');
  console.log('  - brandOptions:', brandOptions);
  console.log('  - modelOptions:', modelOptions);
  console.log('  - selectedBrand:', selectedBrand);
  console.log('  - actualBrandId:', actualBrandId);

  const handleBrandChange = (brandName: string) => {
    console.log('FleetVehicleBasicInfo - Manual brand selection:', brandName);
    onBrandChange(brandName); // Pass brand name instead of ID
    onModelChange(''); // Reset model when brand changes
  };

  const handleModelChange = (modelName: string) => {
    console.log('FleetVehicleBasicInfo - Manual model selection:', modelName);
    onModelChange(modelName); // Pass model name instead of ID
  };

  if (brandsLoading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Chargement des marques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* VIN and Engine Number */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vin" required>
            Numéro de série (VIN)
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
              ✓ VIN valide - Marque et modèle détectés
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="engine_number">Numéro de moteur</Label>
          <Input
            id="engine_number"
            name="engine_number"
            value={formData.engine_number || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            placeholder="Entrez le numéro de moteur"
          />
        </div>
      </div>

      {/* Brand, Model and Status */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="brand_id" required>Marque</Label>
          <SearchableSelect
            options={brandOptions}
            value={formData.brand_id}
            onValueChange={handleBrandChange}
            placeholder="Sélectionner une marque"
            disabled={isViewMode || brandsLoading}
            searchPlaceholder="Rechercher une marque..."
          />
        </div>
        <div>
          <Label htmlFor="model_id" required>Modèle</Label>
          <SearchableSelect
            options={modelOptions}
            value={formData.model_id}
            onValueChange={handleModelChange}
            placeholder={
              !formData.brand_id 
                ? "Sélectionnez d'abord une marque" 
                : actualModelsLoading 
                ? "Chargement des modèles..."
                : "Sélectionner un modèle"
            }
            searchPlaceholder="Rechercher un modèle..."
            disabled={isViewMode || !formData.brand_id || actualModelsLoading}
          />
          {actualModelsLoading && formData.brand_id && (
            <p className="text-sm text-gray-500 mt-1">Chargement des modèles...</p>
          )}
        </div>
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
              <SelectItem value="En prêt">En prêt</SelectItem>
              <SelectItem value="En maintenance">En maintenance</SelectItem>
              <SelectItem value="Hors service">Hors service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FleetVehicleBasicInfo;
