
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';
import { SearchableSelect } from '@/components/ui/searchable-select';

interface FleetVehicleFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isViewMode?: boolean;
  onCancel: () => void;
}

const FleetVehicleForm: React.FC<FleetVehicleFormProps> = ({
  onSubmit,
  defaultValues = {},
  isViewMode = false,
  onCancel
}) => {
  const { carBrands } = useCarBrands();
  const [formData, setFormData] = useState({
    brand: defaultValues.brand || '',
    model: defaultValues.model || '',
    license_plate: defaultValues.license_plate || '',
    year: defaultValues.year?.toString() || '',
    color: defaultValues.color || '',
    mileage: defaultValues.mileage?.toString() || '',
    fuel_type: defaultValues.fuel_type || '',
    status: defaultValues.status || 'available',
    daily_rate: defaultValues.daily_rate?.toString() || '',
    notes: defaultValues.notes || ''
  });

  // Find brand ID based on brand name for fetching models
  const selectedBrand = carBrands.find(brand => brand.name === formData.brand);
  const { carModels } = useCarModels(selectedBrand?.id);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      // Reset model if brand changes
      if (name === 'brand') {
        return { ...prev, [name]: value, model: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.brand || !formData.model || !formData.license_plate) {
      alert('Les champs Marque, Modèle et Plaque d\'immatriculation sont obligatoires.');
      return;
    }

    const submitData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : null,
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      daily_rate: formData.daily_rate ? parseFloat(formData.daily_rate) : null
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">
            Marque <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            options={brandOptions}
            value={formData.brand}
            onValueChange={(value) => handleSelectChange('brand', value)}
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
            value={formData.model}
            onValueChange={(value) => handleSelectChange('model', value)}
            placeholder="Sélectionner un modèle"
            searchPlaceholder="Rechercher un modèle..."
            disabled={isViewMode || !formData.brand}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="license_plate">
            Plaque d'immatriculation <span className="text-red-500">*</span>
          </Label>
          <Input
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleInputChange}
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
            value={formData.year}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Kilométrage</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel_type">Type de carburant</Label>
          <Select 
            value={formData.fuel_type} 
            onValueChange={(value) => handleSelectChange('fuel_type', value)}
            disabled={isViewMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="essence">Essence</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="hybride">Hybride</SelectItem>
              <SelectItem value="electrique">Électrique</SelectItem>
              <SelectItem value="gpl">GPL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="daily_rate">Tarif journalier (€)</Label>
          <Input
            id="daily_rate"
            name="daily_rate"
            type="number"
            step="0.01"
            value={formData.daily_rate}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
          disabled={isViewMode}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="reserved">Réservé</SelectItem>
            <SelectItem value="rented">Loué</SelectItem>
            <SelectItem value="maintenance">En maintenance</SelectItem>
            <SelectItem value="out_of_service">Hors service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          disabled={isViewMode}
          rows={3}
        />
      </div>

      {!isViewMode && (
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {defaultValues.id ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default FleetVehicleForm;
