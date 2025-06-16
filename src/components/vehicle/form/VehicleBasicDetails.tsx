
import React from 'react';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClients } from '@/hooks/use-clients';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

interface VehicleBasicDetailsProps {
  formData: any;
  isViewMode: boolean;
  onSelectChange: (name: string, value: string) => void;
}

const VehicleBasicDetails: React.FC<VehicleBasicDetailsProps> = ({
  formData,
  isViewMode,
  onSelectChange
}) => {
  const { clients } = useClients();
  const { carBrands, isLoading: brandsLoading } = useCarBrands();
  
  // Find brand ID based on brand name for fetching models
  const selectedBrand = carBrands.find(brand => brand.name === formData.brand);
  const selectedBrandId = selectedBrand?.id || '';
  
  console.log('VehicleBasicDetails - formData.brand:', formData.brand);
  console.log('VehicleBasicDetails - selectedBrand:', selectedBrand);
  console.log('VehicleBasicDetails - selectedBrandId:', selectedBrandId);
  console.log('VehicleBasicDetails - carBrands:', carBrands);
  
  const { carModels, isLoading: modelsLoading } = useCarModels(selectedBrandId);
  console.log('VehicleBasicDetails - carModels for brand ID', selectedBrandId, ':', carModels);

  // Prepare client options for searchable select
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: `${client.first_name} ${client.last_name}`
  })) || [];

  // Prepare brand options for searchable select
  const brandOptions = carBrands.map(brand => ({
    value: brand.name,
    label: brand.name
  }));

  // Prepare model options for searchable select
  const modelOptions = carModels.map(model => ({
    value: model.name,
    label: model.name
  }));

  console.log('VehicleBasicDetails - brandOptions:', brandOptions);
  console.log('VehicleBasicDetails - modelOptions:', modelOptions);

  const handleBrandChange = (brandName: string) => {
    console.log('VehicleBasicDetails - Brand changed to:', brandName);
    onSelectChange('brand', brandName);
    // Reset model when brand changes
    onSelectChange('model', '');
    onSelectChange('modelId', '');
  };

  const handleModelChange = (modelName: string) => {
    console.log('VehicleBasicDetails - Model changed to:', modelName);
    // Find the model ID for storage
    const selectedModel = carModels.find(model => model.name === modelName);
    console.log('VehicleBasicDetails - Selected model object:', selectedModel);
    
    if (selectedModel) {
      onSelectChange('model', selectedModel.name);
      onSelectChange('modelId', selectedModel.id);
    }
  };

  // Show loading state for brands
  if (brandsLoading) {
    return <div>Chargement des marques...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="clientId">
          Client <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={clientOptions}
          value={formData.clientId || ''}
          onValueChange={(value) => onSelectChange('clientId', value)}
          placeholder="Sélectionner un client"
          searchPlaceholder="Rechercher un client..."
          disabled={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">
          Marque <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={brandOptions}
          value={formData.brand || ''}
          onValueChange={handleBrandChange}
          placeholder="Sélectionner une marque"
          searchPlaceholder="Rechercher une marque..."
          disabled={isViewMode}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">
          Modèle <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={modelOptions}
          value={formData.model || ''}
          onValueChange={handleModelChange}
          placeholder={
            !formData.brand 
              ? "Sélectionnez d'abord une marque" 
              : modelsLoading 
              ? "Chargement des modèles..."
              : "Sélectionner un modèle"
          }
          searchPlaceholder="Rechercher un modèle..."
          disabled={isViewMode || !formData.brand || modelsLoading}
        />
      </div>
    </div>
  );
};

export default VehicleBasicDetails;
