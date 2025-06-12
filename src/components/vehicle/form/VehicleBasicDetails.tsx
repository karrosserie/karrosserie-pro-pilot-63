
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
  const { carBrands } = useCarBrands();
  
  // Find brand ID based on brand name for fetching models
  const selectedBrand = carBrands.find(brand => brand.name === formData.brand);
  const { carModels } = useCarModels(selectedBrand?.id);

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
          onValueChange={(value) => onSelectChange('brand', value)}
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
          onValueChange={(value) => onSelectChange('model', value)}
          placeholder="Sélectionner un modèle"
          searchPlaceholder="Rechercher un modèle..."
          disabled={isViewMode || !formData.brand}
        />
      </div>
    </div>
  );
};

export default VehicleBasicDetails;
