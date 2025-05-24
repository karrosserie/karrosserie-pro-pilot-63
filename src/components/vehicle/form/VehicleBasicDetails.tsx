
import React from 'react';
import { Label } from '@/components/ui/label';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="clientId">
          Client <span className="text-red-500">*</span>
        </Label>
        <Select 
          disabled={isViewMode} 
          value={formData.clientId || ''} 
          onValueChange={(value) => onSelectChange('clientId', value)}
          required
        >
          <SelectTrigger id="clientId">
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            {clients?.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.first_name} {client.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">
          Marque <span className="text-red-500">*</span>
        </Label>
        <Select 
          disabled={isViewMode} 
          value={formData.brand || ''} 
          onValueChange={(value) => onSelectChange('brand', value)}
          required
        >
          <SelectTrigger id="brand">
            <SelectValue placeholder="Sélectionner une marque" />
          </SelectTrigger>
          <SelectContent>
            {carBrands.map(brand => (
              <SelectItem key={brand.id} value={brand.name}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model">
          Modèle <span className="text-red-500">*</span>
        </Label>
        <Select 
          disabled={isViewMode || !formData.brand} 
          value={formData.model || ''} 
          onValueChange={(value) => onSelectChange('model', value)}
          required
        >
          <SelectTrigger id="model">
            <SelectValue placeholder="Sélectionner un modèle" />
          </SelectTrigger>
          <SelectContent>
            {carModels.map(model => (
              <SelectItem key={model.id} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleBasicDetails;
