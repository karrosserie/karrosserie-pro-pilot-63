
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface InvoiceDetailsSectionProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
  globalTotals?: any;
  isReadOnly?: boolean;
}

export const InvoiceDetailsSection = ({ formData, onFieldChange, globalTotals, isReadOnly }: InvoiceDetailsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => onFieldChange('notes', e.target.value)}
          placeholder="Notes supplémentaires..."
          disabled={isReadOnly}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentDetails">Détails de paiement</Label>
        <Textarea
          id="paymentDetails"
          value={formData.paymentDetails || ''}
          onChange={(e) => onFieldChange('paymentDetails', e.target.value)}
          placeholder="Détails concernant le paiement..."
          disabled={isReadOnly}
          rows={3}
        />
      </div>
    </div>
  );
};
