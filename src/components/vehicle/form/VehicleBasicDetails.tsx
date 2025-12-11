
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
import { supabase } from '@/integrations/supabase/client';

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
  
  // Use brand ID directly for fetching models
  const selectedBrandId = formData.brandId || '';
  
  console.log('VehicleBasicDetails - formData.brandId:', formData.brandId);
  console.log('VehicleBasicDetails - selectedBrandId:', selectedBrandId);
  console.log('VehicleBasicDetails - carBrands:', carBrands);
  
  const { carModels, isLoading: modelsLoading } = useCarModels(selectedBrandId);
  console.log('VehicleBasicDetails - carModels for brand ID', selectedBrandId, ':', carModels);

  // Effect pour sélectionner automatiquement le modèle une fois les modèles chargés
  React.useEffect(() => {
    // Si on a un VIN, qu'une marque est sélectionnée, que les modèles sont chargés 
    // et qu'aucun modèle n'est encore sélectionné
    if (formData.vin && 
        formData.vin.length === 17 && 
        selectedBrandId && 
        carModels.length > 0 && 
        !formData.modelId && 
        !modelsLoading) {
      
      // Appeler l'API pour décoder le VIN et obtenir le modèle
      const decodeModelFromVin = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('vin-decoder', {
            body: { vin: formData.vin }
          });

          if (!error && data.success && data.data.model) {
            const detectedModel = data.data.model;
            console.log('Modèle détecté via VIN:', detectedModel);
            
            // Chercher le modèle correspondant dans la liste
            const matchingModel = carModels.find(model => 
              model.name.toLowerCase().includes(detectedModel.toLowerCase()) ||
              detectedModel.toLowerCase().includes(model.name.toLowerCase())
            );
            
            if (matchingModel) {
              onSelectChange('modelId', matchingModel.id);
              console.log('Modèle sélectionné automatiquement:', matchingModel.name, 'ID:', matchingModel.id);
            }
          }
        } catch (error) {
          console.error('Erreur lors du décodage du modèle via VIN:', error);
        }
      };
      
      decodeModelFromVin();
    }
  }, [formData.vin, selectedBrandId, carModels, formData.modelId, modelsLoading, onSelectChange]);

  // Prepare client options for searchable select
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: `${client.first_name} ${client.last_name}`
  })) || [];

  // Prepare brand options for searchable select
  const brandOptions = carBrands.map(brand => ({
    value: brand.id,
    label: brand.name
  }));

  // Prepare model options for searchable select
  const modelOptions = carModels.map(model => ({
    value: model.id,
    label: model.name
  }));

  console.log('VehicleBasicDetails - brandOptions:', brandOptions);
  console.log('VehicleBasicDetails - modelOptions:', modelOptions);

  const handleBrandChange = (brandId: string) => {
    console.log('VehicleBasicDetails - Brand changed to ID:', brandId);
    onSelectChange('brandId', brandId);
    // Reset model when brand changes
    onSelectChange('model', '');
    onSelectChange('modelId', '');
  };

  const handleModelChange = (modelId: string) => {
    console.log('VehicleBasicDetails - Model changed to ID:', modelId);
    onSelectChange('modelId', modelId);
  };

  // Show loading state for brands
  if (brandsLoading) {
    return <div>Chargement des marques...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      <div className="space-y-2">
        <Label htmlFor="clientId" className="text-sm">
          Client <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={clientOptions}
          value={formData.clientId || ''}
          onValueChange={(value) => onSelectChange('clientId', value)}
          placeholder="Sélectionner un client"
          searchPlaceholder="Rechercher un client..."
          disabled={isViewMode || !!formData.clientId}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand" className="text-sm">
          Marque <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={brandOptions}
          value={formData.brandId || ''}
          onValueChange={handleBrandChange}
          placeholder="Sélectionner une marque"
          searchPlaceholder="Rechercher une marque..."
          disabled={isViewMode}
        />
      </div>
      
      <div className="space-y-2 sm:col-span-2 md:col-span-1">
        <Label htmlFor="model" className="text-sm">
          Modèle <span className="text-red-500">*</span>
        </Label>
        <SearchableSelect
          options={modelOptions}
          value={formData.modelId || ''}
          onValueChange={handleModelChange}
          placeholder={
            !formData.brandId 
              ? "Sélectionnez d'abord une marque" 
              : modelsLoading 
              ? "Chargement des modèles..."
              : "Sélectionner un modèle"
          }
          searchPlaceholder="Rechercher un modèle..."
          disabled={isViewMode || !formData.brandId || modelsLoading}
        />
        {modelsLoading && formData.brandId && (
          <p className="text-xs text-gray-500">Chargement des modèles...</p>
        )}
      </div>
    </div>
  );
};

export default VehicleBasicDetails;
