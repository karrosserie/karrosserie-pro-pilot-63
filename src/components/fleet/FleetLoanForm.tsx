
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FleetVehicle } from '@/services/supabase/fleet-vehicles';

interface FleetLoanFormProps {
  vehicle: FleetVehicle;
  onSubmit: (loanData: LoanFormData) => void;
  onCancel: () => void;
}

export interface LoanFormData {
  vehicleId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startDate: string;
  expectedReturnDate: string;
  notes?: string;
}

const FleetLoanForm: React.FC<FleetLoanFormProps> = ({
  vehicle,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<LoanFormData>({
    vehicleId: vehicle.id,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    startDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Prêt du véhicule: {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientName">Nom du client *</Label>
          <Input
            id="clientName"
            name="clientName"
            type="text"
            value={formData.clientName}
            onChange={handleInputChange}
            placeholder="Nom complet du client"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone">Téléphone *</Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            type="tel"
            value={formData.clientPhone}
            onChange={handleInputChange}
            placeholder="06 12 34 56 78"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleInputChange}
            placeholder="client@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedReturnDate">Date de retour prévue *</Label>
          <Input
            id="expectedReturnDate"
            name="expectedReturnDate"
            type="date"
            value={formData.expectedReturnDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Informations complémentaires..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="btn-primary">
          Confirmer le prêt
        </Button>
      </div>
    </form>
  );
};

export default FleetLoanForm;
