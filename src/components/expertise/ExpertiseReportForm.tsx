
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClients } from '@/hooks/use-clients';
import { useVehicles } from '@/hooks/use-vehicles';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

interface ExpertiseReportFormProps {
  report?: ExpertiseReport | null;
  onSubmit: (formData: Partial<ExpertiseReport>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ExpertiseReportForm = ({
  report,
  onSubmit,
  onCancel,
  isSubmitting
}: ExpertiseReportFormProps) => {
  const { toast } = useToast();
  const { clients, isLoading: isLoadingClients } = useClients();
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  
  const [formData, setFormData] = useState<Partial<ExpertiseReport>>({
    reference: '',
    client_id: null,
    vehicle_id: null,
    expert_name: '',
    amount: null,
    status: 'Importé',
    notes: ''
  });

  useEffect(() => {
    if (report) {
      setFormData({
        reference: report.reference,
        client_id: report.client_id,
        vehicle_id: report.vehicle_id,
        expert_name: report.expert_name || '',
        amount: report.amount,
        status: report.status || 'Importé',
        notes: report.notes || '',
      });
    }
  }, [report]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(formData);
      toast({
        title: "Succès",
        description: `Le rapport d'expertise a été ${report ? 'mis à jour' : 'créé'} avec succès.`
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de ${report ? 'mettre à jour' : 'créer'} le rapport d'expertise: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const clientOptions = clients?.filter(client => !!client) || [];
  const vehicleOptions = vehicles?.filter(vehicle => !!vehicle) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="reference">Référence</Label>
        <Input
          id="reference"
          value={formData.reference}
          onChange={(e) => handleChange('reference', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="client">Client</Label>
        <Select
          value={formData.client_id || ''}
          onValueChange={(value) => handleChange('client_id', value)}
        >
          <SelectTrigger id="client">
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Aucun client</SelectItem>
            {clientOptions.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.first_name} {client.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="vehicle">Véhicule</Label>
        <Select
          value={formData.vehicle_id || ''}
          onValueChange={(value) => handleChange('vehicle_id', value)}
        >
          <SelectTrigger id="vehicle">
            <SelectValue placeholder="Sélectionner un véhicule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Aucun véhicule</SelectItem>
            {vehicleOptions.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="expert_name">Nom de l'expert</Label>
        <Input
          id="expert_name"
          value={formData.expert_name || ''}
          onChange={(e) => handleChange('expert_name', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="amount">Montant (€)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount || ''}
          onChange={(e) => handleChange('amount', parseFloat(e.target.value) || null)}
        />
      </div>

      <div>
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status || 'Importé'}
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Importé">Importé</SelectItem>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="Validé">Validé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : report ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};
