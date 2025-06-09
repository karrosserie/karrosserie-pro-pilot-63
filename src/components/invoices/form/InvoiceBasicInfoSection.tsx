
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvoiceBasicInfoSectionProps {
  formData: any;
  errors?: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  claimNumber?: string;
  currentMileage?: string;
  onClaimNumberChange?: (value: string) => void;
  onCurrentMileageChange?: (value: string) => void;
}

export const InvoiceBasicInfoSection = ({ 
  formData, 
  errors,
  onFieldChange,
  claimNumber,
  currentMileage,
  onClaimNumberChange,
  onCurrentMileageChange
}: InvoiceBasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="reference" required>Numéro</Label>
        <Input
          id="reference"
          value={formData.reference || ''}
          onChange={(e) => onFieldChange('reference', e.target.value)}
          placeholder="N° de facture"
          required
        />
        {errors?.reference && (
          <p className="text-sm text-red-500">{errors.reference}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" required>Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date || ''}
          onChange={(e) => onFieldChange('date', e.target.value)}
          required
        />
        {errors?.date && (
          <p className="text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Date d'échéance</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate || ''}
          onChange={(e) => onFieldChange('dueDate', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select 
          value={formData.status || ''} 
          onValueChange={(value) => onFieldChange('status', value)}
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
