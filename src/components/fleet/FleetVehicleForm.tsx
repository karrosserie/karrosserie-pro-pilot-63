
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useToast } from '@/hooks/use-toast';

interface FleetVehicleFormProps {
  vehicle?: any;
  onClose: () => void;
}

const FleetVehicleForm: React.FC<FleetVehicleFormProps> = ({ vehicle, onClose }) => {
  const { createVehicle, updateVehicle } = useFleetVehicles();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    license_plate: vehicle?.license_plate || '',
    fuel_type: vehicle?.fuel_type || '',
    mileage: vehicle?.mileage || '',
    status: vehicle?.status || 'Disponible',
    notes: vehicle?.notes || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (vehicle) {
        await updateVehicle.mutateAsync({ id: vehicle.id, data: formData });
        toast({
          title: "Véhicule modifié",
          description: "Le véhicule a été modifié avec succès."
        });
      } else {
        await createVehicle.mutateAsync(formData);
        toast({
          title: "Véhicule ajouté",
          description: "Le véhicule a été ajouté à la flotte avec succès."
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand" required>Marque</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" required>Modèle</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license_plate" required>Plaque d'immatriculation</Label>
          <Input
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel_type">Type de carburant</Label>
          <Select value={formData.fuel_type} onValueChange={(value) => handleSelectChange('fuel_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essence">Essence</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Hybride">Hybride</SelectItem>
              <SelectItem value="Électrique">Électrique</SelectItem>
              <SelectItem value="GPL">GPL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Kilométrage</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponible">Disponible</SelectItem>
              <SelectItem value="Réservé">Réservé</SelectItem>
              <SelectItem value="En maintenance">En maintenance</SelectItem>
              <SelectItem value="Indisponible">Indisponible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={createVehicle.isPending || updateVehicle.isPending}>
          {vehicle ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default FleetVehicleForm;
