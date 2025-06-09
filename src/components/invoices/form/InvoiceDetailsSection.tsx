
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface InvoiceDetailsSectionProps {
  formData: any;
  isViewMode: boolean;
  onChange: (field: string, value: any) => void;
}

export const InvoiceDetailsSection = ({ formData, isViewMode, onChange }: InvoiceDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          placeholder="Notes supplémentaires..."
          disabled={isViewMode}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentDetails">Détails de paiement</Label>
        <Textarea
          id="paymentDetails"
          value={formData.paymentDetails || ''}
          onChange={(e) => onChange('paymentDetails', e.target.value)}
          placeholder="Détails concernant le paiement..."
          disabled={isViewMode}
          rows={3}
        />
      </div>
    </div>
  );
};
