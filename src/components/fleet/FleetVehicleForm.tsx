
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';
import { useAuth } from '@/contexts/AuthContext';
import { isValidVin, decodeVin } from '@/services/vin-decoder';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

interface FleetVehicleFormProps {
  vehicle?: FleetVehicle | null;
  mode: 'create' | 'edit' | 'view';
  onSuccess: () => void;
  onCancel: () => void;
}

const FleetVehicleForm: React.FC<FleetVehicleFormProps> = ({
  vehicle,
  mode,
  onSuccess,
  onCancel
}) => {
  const { createVehicle, updateVehicle } = useFleetVehicles();
  const { user } = useAuth();
  const { carBrands } = useCarBrands();
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState({
    vin: '',
    engine_number: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    color: '',
    mileage: '',
    status: 'Disponible',
    notes: ''
  });

  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const { carModels } = useCarModels(selectedBrandId);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin || '',
        engine_number: vehicle.engine_number || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        license_plate: vehicle.license_plate || '',
        color: vehicle.color || '',
        mileage: vehicle.mileage?.toString() || '',
        status: vehicle.status || 'Disponible',
        notes: vehicle.notes || ''
      });

      // Trouver l'ID de la marque correspondante
      if (vehicle.brand && carBrands.length > 0) {
        const matchingBrand = carBrands.find(brand => brand.name === vehicle.brand);
        if (matchingBrand) {
          setSelectedBrandId(matchingBrand.id);
        }
      }
    }
  }, [vehicle, carBrands]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vin') {
      const upperValue = value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        [name]: upperValue
      }));

      // Décoder automatiquement le VIN si valide
      if (isValidVin(upperValue)) {
        const vinInfo = decodeVin(upperValue);
        console.log('VIN décodé:', vinInfo);
        
        if (vinInfo.brand) {
          // Trouver la marque correspondante
          const matchingBrand = carBrands.find(brand => 
            brand.name.toLowerCase() === vinInfo.brand?.toLowerCase()
          );
          
          if (matchingBrand) {
            setSelectedBrandId(matchingBrand.id);
            setFormData(prev => ({
              ...prev,
              brand: matchingBrand.name,
              model: vinInfo.model || prev.model,
              year: vinInfo.year || prev.year
            }));
          }
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'year' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleBrandChange = (brandId: string) => {
    const selectedBrand = carBrands.find(brand => brand.id === brandId);
    if (selectedBrand) {
      setSelectedBrandId(brandId);
      setFormData(prev => ({
        ...prev,
        brand: selectedBrand.name,
        model: '' // Reset model when brand changes
      }));
    }
  };

  const handleModelChange = (modelName: string) => {
    setFormData(prev => ({
      ...prev,
      model: modelName
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    try {
      const submissionData = {
        vin: formData.vin,
        engine_number: formData.engine_number,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        license_plate: formData.license_plate,
        color: formData.color,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        status: formData.status,
        notes: formData.notes
      };

      if (mode === 'edit' && vehicle) {
        await updateVehicle.mutateAsync({
          id: vehicle.id,
          data: submissionData
        });
      } else if (mode === 'create') {
        await createVehicle.mutateAsync({
          ...submissionData,
          user_id: user.id
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving fleet vehicle:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* VIN and Engine Number */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vin">
              Numéro de série (VIN) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              disabled={isViewMode}
            />
          </div>
        </div>
      </div>

      {/* Brand and Model */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Marque *</Label>
          <Select
            value={selectedBrandId}
            onValueChange={handleBrandChange}
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
            onValueChange={handleModelChange}
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

      {/* License Plate, Year, Color, and Mileage */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
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
        
        <div>
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

        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>
        
        <div>
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
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
          disabled={isViewMode}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Disponible">Disponible</SelectItem>
            <SelectItem value="Loué">Loué</SelectItem>
            <SelectItem value="En maintenance">En maintenance</SelectItem>
            <SelectItem value="Hors service">Hors service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div>
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

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isViewMode ? "Fermer" : "Annuler"}
        </Button>
        {!isViewMode && (
          <Button 
            type="submit" 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            disabled={createVehicle.isPending || updateVehicle.isPending}
          >
            {createVehicle.isPending || updateVehicle.isPending 
              ? "Enregistrement..." 
              : (mode === 'edit' ? "Mettre à jour" : "Enregistrer")
            }
          </Button>
        )}
      </div>
    </form>
  );
};

export default FleetVehicleForm;
