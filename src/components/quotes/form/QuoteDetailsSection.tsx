
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from '@/services/supabase/quotes';
import { GlobalTotals } from './types';

interface QuoteDetailsSectionProps {
  notes: string;
  onFieldChange: (field: string, value: any) => void;
  globalTotals: GlobalTotals;
  isReadOnly?: boolean;
}

export const QuoteDetailsSection = ({ notes, onFieldChange, globalTotals, isReadOnly }: QuoteDetailsSectionProps) => {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {/* Totaux globaux */}
        <div className="space-y-2">
          <div className="flex justify-end space-x-8 text-sm">
            <div>Sous-total : <span className="font-medium">{globalTotals.subTotal.toFixed(2)} €</span></div>
            <div>TVA : <span className="font-medium">{globalTotals.totalVat.toFixed(2)} €</span></div>
            <div>Remises totales : <span className="font-medium">{globalTotals.totalDiscount.toFixed(2)} €</span></div>
          </div>
          <div className="flex justify-end text-lg font-bold">
            Total : <span className="ml-2">{globalTotals.total.toFixed(2)} €</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
            placeholder="Notes et observations concernant le devis..."
            rows={4}
            readOnly={isReadOnly}
          />
        </div>
      </CardContent>
    </Card>
  );
};
