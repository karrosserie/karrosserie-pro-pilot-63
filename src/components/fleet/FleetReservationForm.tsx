
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
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useClients } from '@/hooks/use-clients';
import { useFleetVehicles } from '@/hooks/use-fleet-vehicles';
import { useRepairOrders } from '@/hooks/use-repair-orders';

interface FleetReservationFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isViewMode?: boolean;
  onCancel: () => void;
}

const FleetReservationForm: React.FC<FleetReservationFormProps> = ({
  onSubmit,
  defaultValues = {},
  isViewMode = false,
  onCancel
}) => {
  const { clients } = useClients();
  const { fleetVehicles } = useFleetVehicles();
  const { repairOrders } = useRepairOrders();

  const [formData, setFormData] = useState({
    client_id: defaultValues.client_id || '',
    fleet_vehicle_id: defaultValues.fleet_vehicle_id || '',
    repair_order_id: defaultValues.repair_order_id || '',
    start_date: defaultValues.start_date || '',
    end_date: defaultValues.end_date || '',
    status: defaultValues.status || 'reserved',
    daily_rate: defaultValues.daily_rate?.toString() || '',
    total_cost: defaultValues.total_cost?.toString() || '',
    pickup_location: defaultValues.pickup_location || '',
    return_location: defaultValues.return_location || '',
    notes: defaultValues.notes || ''
  });

  // Prepare options for searchable selects
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: `${client.first_name} ${client.last_name}`
  })) || [];

  const vehicleOptions = fleetVehicles?.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`
  })) || [];

  const repairOrderOptions = repairOrders?.map(order => ({
    value: order.id,
    label: `${order.reference} - ${order.clients?.first_name} ${order.clients?.last_name}`
  })) || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotalCost = () => {
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const dailyRate = parseFloat(formData.daily_rate) || 0;
    
    if (startDate && endDate && dailyRate > 0) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalCost = diffDays * dailyRate;
      
      setFormData(prev => ({ ...prev, total_cost: totalCost.toString() }));
    }
  };

  React.useEffect(() => {
    if (formData.start_date && formData.end_date && formData.daily_rate) {
      calculateTotalCost();
    }
  }, [formData.start_date, formData.end_date, formData.daily_rate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.client_id || !formData.fleet_vehicle_id || !formData.start_date || !formData.end_date) {
      alert('Les champs Client, Véhicule, Date de début et Date de fin sont obligatoires.');
      return;
    }

    const submitData = {
      ...formData,
      daily_rate: formData.daily_rate ? parseFloat(formData.daily_rate) : null,
      total_cost: formData.total_cost ? parseFloat(formData.total_cost) : null
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_id">
            Client <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            options={clientOptions}
            value={formData.client_id}
            onValueChange={(value) => handleSelectChange('client_id', value)}
            placeholder="Sélectionner un client"
            searchPlaceholder="Rechercher un client..."
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fleet_vehicle_id">
            Véhicule de courtoisie <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            options={vehicleOptions}
            value={formData.fleet_vehicle_id}
            onValueChange={(value) => handleSelectChange('fleet_vehicle_id', value)}
            placeholder="Sélectionner un véhicule"
            searchPlaceholder="Rechercher un véhicule..."
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="repair_order_id">Ordre de réparation associé</Label>
        <SearchableSelect
          options={repairOrderOptions}
          value={formData.repair_order_id}
          onValueChange={(value) => handleSelectChange('repair_order_id', value)}
          placeholder="Sélectionner un ordre de réparation (optionnel)"
          searchPlaceholder="Rechercher un ordre..."
          disabled={isViewMode}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">
            Date de début <span className="text-red-500">*</span>
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleInputChange}
            disabled={isViewMode}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">
            Date de fin <span className="text-red-500">*</span>
          </Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleInputChange}
            disabled={isViewMode}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="total_cost">Coût total (€)</Label>
          <Input
            id="total_cost"
            name="total_cost"
            type="number"
            step="0.01"
            value={formData.total_cost}
            onChange={handleInputChange}
            disabled={true}
            className="bg-gray-50"
          />
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
              <SelectItem value="reserved">Réservé</SelectItem>
              <SelectItem value="active">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pickup_location">Lieu de récupération</Label>
          <Input
            id="pickup_location"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="return_location">Lieu de retour</Label>
          <Input
            id="return_location"
            name="return_location"
            value={formData.return_location}
            onChange={handleInputChange}
            disabled={isViewMode}
          />
        </div>
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

export default FleetReservationForm;
