
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

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
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    color: '',
    fuel_type: '',
    transmission: '',
    mileage: 0,
    status: 'Disponible',
    insurance_company: '',
    insurance_policy: '',
    insurance_expiry: '',
    maintenance_notes: '',
    notes: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        license_plate: vehicle.license_plate || '',
        color: vehicle.color || '',
        fuel_type: vehicle.fuel_type || '',
        transmission: vehicle.transmission || '',
        mileage: vehicle.mileage || 0,
        status: vehicle.status || 'Disponible',
        insurance_company: vehicle.insurance_company || '',
        insurance_policy: vehicle.insurance_policy || '',
        insurance_expiry: vehicle.insurance_expiry || '',
        maintenance_notes: vehicle.maintenance_notes || '',
        notes: vehicle.notes || ''
      });
    }
  }, [vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' ? parseInt(value) || 0 : value
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
    
    try {
      if (mode === 'edit' && vehicle) {
        await updateVehicle.mutateAsync({
          id: vehicle.id,
          data: formData
        });
      } else if (mode === 'create') {
        await createVehicle.mutateAsync(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving fleet vehicle:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Marque *</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            disabled={isViewMode}
            required
          />
        </div>
        <div>
          <Label htmlFor="model">Modèle *</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            disabled={isViewMode}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
            disabled={isViewMode}
            min="1900"
            max={new Date().getFullYear() + 1}
          />
        </div>
        <div>
          <Label htmlFor="license_plate">Immatriculation *</Label>
          <Input
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleInputChange}
            disabled={isViewMode}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="fuel_type">Carburant</Label>
          <Select 
            value={formData.fuel_type} 
            onValueChange={(value) => handleSelectChange('fuel_type', value)}
            disabled={isViewMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essence">Essence</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Hybride">Hybride</SelectItem>
              <SelectItem value="Électrique">Électrique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="transmission">Transmission</Label>
          <Select 
            value={formData.transmission} 
            onValueChange={(value) => handleSelectChange('transmission', value)}
            disabled={isViewMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manuelle">Manuelle</SelectItem>
              <SelectItem value="Automatique">Automatique</SelectItem>
            </SelectContent>
          </Select>
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
            min="0"
          />
        </div>
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="insurance_company">Assurance</Label>
          <Input
            id="insurance_company"
            name="insurance_company"
            value={formData.insurance_company}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>
        <div>
          <Label htmlFor="insurance_policy">N° Police</Label>
          <Input
            id="insurance_policy"
            name="insurance_policy"
            value={formData.insurance_policy}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="insurance_expiry">Expiration assurance</Label>
        <Input
          id="insurance_expiry"
          name="insurance_expiry"
          type="date"
          value={formData.insurance_expiry}
          onChange={handleInputChange}
          disabled={isViewMode}
        />
      </div>

      <div>
        <Label htmlFor="maintenance_notes">Notes de maintenance</Label>
        <Textarea
          id="maintenance_notes"
          name="maintenance_notes"
          value={formData.maintenance_notes}
          onChange={handleInputChange}
          disabled={isViewMode}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes générales</Label>
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
