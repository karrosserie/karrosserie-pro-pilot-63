
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClients } from '@/hooks/use-clients';

interface VehicleBasicInfoFormProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const VehicleBasicInfoForm: React.FC<VehicleBasicInfoFormProps> = ({
  formData,
  isViewMode,
  onInputChange,
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

  const statusOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Diagnostic', label: 'Diagnostic' },
    { value: 'En réparation', label: 'En réparation' },
    { value: 'Terminé', label: 'Terminé' }
  ];

  const insuranceCompanies = [
    'AXA', 'Allianz', 'Generali', 'Zurich', 'Bâloise', 'Helvetia', 
    'Mobilière', 'Vaudoise', 'CSS', 'Sympany', 'Autre'
  ];

  return (
    <div className="space-y-4">
      {/* VIN and Engine Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vin">
            Numéro de série (VIN) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="engineNumber">Numéro de moteur</Label>
          <Input
            id="engineNumber"
            name="engineNumber"
            value={formData.engineNumber || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Client, Brand and Model on the same line */}
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
      
      {/* License plate, Year, Color, and Mileage on the same line */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licensePlate">
            Plaque d'immatriculation <span className="text-red-500">*</span>
          </Label>
          <Input
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            name="year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            name="color"
            value={formData.color || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">Kilométrage</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Insurance information */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-4 space-y-2">
          <Label htmlFor="insuranceCompany">Compagnie d'assurance</Label>
          <Select 
            disabled={isViewMode} 
            value={formData.insuranceCompany || ''} 
            onValueChange={(value) => onSelectChange('insuranceCompany', value)}
          >
            <SelectTrigger id="insuranceCompany">
              <SelectValue placeholder="Sélectionner une compagnie" />
            </SelectTrigger>
            <SelectContent>
              {insuranceCompanies.map(company => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceExpiryDate">Date d'expiration</Label>
          <Input
            id="insuranceExpiryDate"
            name="insuranceExpiryDate"
            type="date"
            value={formData.insuranceExpiryDate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Date d'arrivée, Date de début, Date de fin, Statut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="arrivalDate">Date d'arrivée</Label>
          <Input
            id="arrivalDate"
            name="arrivalDate"
            type="datetime-local"
            value={formData.arrivalDate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            disabled={isViewMode} 
            value={formData.status || 'En attente'} 
            onValueChange={(value) => onSelectChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default VehicleBasicInfoForm;

