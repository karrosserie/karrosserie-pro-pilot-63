
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Détails du devis
        </CardTitle>
        <CardDescription>
          Notes et totaux du devis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
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

        {/* Totaux globaux */}
        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Totaux du devis</h4>
          <div className="flex justify-end space-x-8 text-sm">
            <div>Sous-total : <span className="font-medium">{globalTotals.subTotal.toFixed(2)} €</span></div>
            <div>TVA : <span className="font-medium">{globalTotals.totalVat.toFixed(2)} €</span></div>
            <div>Remises totales : <span className="font-medium">{globalTotals.totalDiscount.toFixed(2)} €</span></div>
          </div>
          <div className="flex justify-end text-lg font-bold">
            Total : <span className="ml-2">{globalTotals.total.toFixed(2)} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
