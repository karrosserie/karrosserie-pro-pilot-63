
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoanFormData } from '../FleetLoanForm';

interface ClientInfoTabProps {
  formData: LoanFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isViewMode?: boolean;
}

const ClientInfoTab: React.FC<ClientInfoTabProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isViewMode = false
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nom du client *</Label>
          <Input
            id="clientName"
            name="clientName"
            type="text"
            value={formData.clientName}
            onChange={onInputChange}
            placeholder="Nom complet du client"
            required
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone">Téléphone *</Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            type="tel"
            value={formData.clientPhone}
            onChange={onInputChange}
            placeholder="06 12 34 56 78"
            required
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={onInputChange}
            placeholder="client@example.com"
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={onInputChange}
            required
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedReturnDate">Date de retour prévue *</Label>
          <Input
            id="expectedReturnDate"
            name="expectedReturnDate"
            type="date"
            value={formData.expectedReturnDate}
            onChange={onInputChange}
            required
            disabled={isViewMode}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={onInputChange}
            placeholder="Informations complémentaires..."
            rows={3}
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isViewMode ? "Fermer" : "Annuler"}
        </Button>
        {!isViewMode && (
          <Button type="submit" className="btn-primary">
            Confirmer le prêt
          </Button>
        )}
      </div>
    </form>
  );
};

export default ClientInfoTab;
