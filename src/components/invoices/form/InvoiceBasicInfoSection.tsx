
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvoiceBasicInfoSectionProps {
  formData: any;
  isViewMode: boolean;
  onChange: (field: string, value: any) => void;
}

export const InvoiceBasicInfoSection = ({ formData, isViewMode, onChange }: InvoiceBasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="reference" required>Numéro</Label>
        <Input
          id="reference"
          value={formData.reference || ''}
          onChange={(e) => onChange('reference', e.target.value)}
          placeholder="N° de facture"
          disabled={isViewMode}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" required>Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date || ''}
          onChange={(e) => onChange('date', e.target.value)}
          disabled={isViewMode}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Date d'échéance</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate || ''}
          onChange={(e) => onChange('dueDate', e.target.value)}
          disabled={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status || ''} 
          onValueChange={(value) => onChange('status', value)}
          disabled={isViewMode}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En attente de paiement">En attente de paiement</SelectItem>
            <SelectItem value="Paiement partiel">Paiement partiel</SelectItem>
            <SelectItem value="Payée">Payée</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
