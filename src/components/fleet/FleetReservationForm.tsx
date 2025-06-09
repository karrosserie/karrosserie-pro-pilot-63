
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Textarea } from '@/components/ui/textarea';
import { useFleetReservations } from '@/hooks/use-fleet-reservations';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useClients } from '@/hooks/use-clients';
import { useToast } from '@/hooks/use-toast';

interface FleetReservationFormProps {
  reservation?: any;
  onClose: () => void;
}

const FleetReservationForm: React.FC<FleetReservationFormProps> = ({ reservation, onClose }) => {
  const { createReservation, updateReservation } = useFleetReservations();
  const { vehicles } = useFleetVehicles();
  const { clients } = useClients();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    client_id: reservation?.client_id || '',
    vehicle_id: reservation?.vehicle_id || '',
    start_date: reservation?.start_date || '',
    end_date: reservation?.end_date || '',
    status: reservation?.status || 'Confirmée',
    notes: reservation?.notes || ''
  });

  // Prepare options for select components
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: `${client.first_name} ${client.last_name}`
  })) || [];

  const vehicleOptions = vehicles?.filter(v => v.status === 'Disponible' || v.id === formData.vehicle_id)
    .map(vehicle => ({
      value: vehicle.id,
      label: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`
    })) || [];

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
      if (reservation?.id) {
        await updateReservation.mutateAsync({ id: reservation.id, data: formData });
        toast({
          title: "Réservation modifiée",
          description: "La réservation a été modifiée avec succès."
        });
      } else {
        await createReservation.mutateAsync(formData);
        toast({
          title: "Réservation créée",
          description: "La réservation a été créée avec succès."
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
          <Label htmlFor="client_id" required>Client</Label>
          <SearchableSelect
            options={clientOptions}
            value={formData.client_id}
            onValueChange={(value) => handleSelectChange('client_id', value)}
            placeholder="Sélectionner un client"
            searchPlaceholder="Rechercher un client..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicle_id" required>Véhicule</Label>
          <SearchableSelect
            options={vehicleOptions}
            value={formData.vehicle_id}
            onValueChange={(value) => handleSelectChange('vehicle_id', value)}
            placeholder="Sélectionner un véhicule"
            searchPlaceholder="Rechercher un véhicule..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date" required>Date de début</Label>
          <Input
            id="start_date"
            name="start_date"
            type="datetime-local"
            value={formData.start_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date" required>Date de fin</Label>
          <Input
            id="end_date"
            name="end_date"
            type="datetime-local"
            value={formData.end_date}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Confirmée">Confirmée</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
            <SelectItem value="Annulée">Annulée</SelectItem>
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
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={createReservation.isPending || updateReservation.isPending}>
          {reservation?.id ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default FleetReservationForm;
