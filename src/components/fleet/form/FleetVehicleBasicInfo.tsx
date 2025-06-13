
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
  const { carModels, isLoading: modelsLoading } = useCarModels(formData.brand_id || undefined);

  console.log('FleetVehicleBasicInfo - carBrands count:', carBrands?.length || 0);
  console.log('FleetVehicleBasicInfo - brandsLoading:', brandsLoading);
  console.log('FleetVehicleBasicInfo - formData.brand_id:', formData.brand_id);
  console.log('FleetVehicleBasicInfo - carModels count:', carModels?.length || 0);
  console.log('FleetVehicleBasicInfo - modelsLoading:', modelsLoading);

  const brandOptions = carBrands?.map(brand => ({
    value: brand.id,
    label: brand.name
  })) || [];

  const modelOptions = carModels?.map(model => ({
    value: model.id,
    label: model.name
  })) || [];

  const handleBrandChange = (brandId: string) => {
    console.log('FleetVehicleBasicInfo - Brand changed to:', brandId);
    onBrandChange(brandId);
  };

  const handleModelChange = (modelId: string) => {
    console.log('FleetVehicleBasicInfo - Model changed to:', modelId);
    onModelChange(modelId);
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
            value={formData.engine_number}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Brand, Model and Status */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="brand_id" required>Marque</Label>
          <SearchableSelect
            options={brandOptions}
            value={formData.brand_id || ''}
            onValueChange={handleBrandChange}
            placeholder="Sélectionner une marque"
            disabled={isViewMode}
            searchPlaceholder="Rechercher une marque..."
          />
        </div>
        <div>
          <Label htmlFor="model_id" required>Modèle</Label>
          {formData.brand_id ? (
            <SearchableSelect
              options={modelOptions}
              value={formData.model_id || ''}
              onValueChange={handleModelChange}
              placeholder={modelsLoading ? "Chargement..." : "Sélectionner un modèle"}
              disabled={isViewMode || modelsLoading}
              searchPlaceholder="Rechercher un modèle..."
            />
          ) : (
            <div className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center text-gray-500 text-sm">
              Sélectionnez d'abord une marque
            </div>
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
