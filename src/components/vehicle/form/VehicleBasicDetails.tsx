
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

  const carBrands = [
    'Audi', 'BMW', 'Citroën', 'Ford', 'Mercedes-Benz', 'Nissan', 'Opel', 
    'Peugeot', 'Renault', 'Toyota', 'Volkswagen', 'Volvo', 'Autre'
  ];

  const carModels: { [key: string]: string[] } = {
    'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'],
    'BMW': ['Série 1', 'Série 2', 'Série 3', 'Série 4', 'Série 5', 'Série 6', 'Série 7', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'],
    'Citroën': ['C1', 'C3', 'C4', 'C5', 'C6', 'Berlingo', 'Picasso', 'Jumpy'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Mustang', 'Transit'],
    'Mercedes-Benz': ['Classe A', 'Classe B', 'Classe C', 'Classe E', 'Classe S', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS'],
    'Nissan': ['Micra', 'Note', 'Juke', 'Qashqai', 'X-Trail', 'Leaf'],
    'Opel': ['Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland'],
    'Peugeot': ['108', '208', '308', '508', '2008', '3008', '5008'],
    'Renault': ['Twingo', 'Clio', 'Mégane', 'Talisman', 'Captur', 'Kadjar', 'Koleos'],
    'Toyota': ['Yaris', 'Corolla', 'Camry', 'Prius', 'RAV4', 'Highlander'],
    'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'T-Roc'],
    'Volvo': ['V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
    'Autre': ['Autre modèle']
  };

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
              <SelectItem key={brand} value={brand}>
                {brand}
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
            {formData.brand && carModels[formData.brand]?.map(model => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VehicleBasicDetails;
