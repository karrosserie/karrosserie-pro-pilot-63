
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';
import { GlobalTotals } from './types';

interface QuoteDetailsSectionProps {
  formData: Partial<Quote>;
  onFieldChange: (field: string, value: any) => void;
  globalTotals: GlobalTotals;
}

export const QuoteDetailsSection = ({ formData, onFieldChange, globalTotals }: QuoteDetailsSectionProps) => {
  const isReadOnly = formData.status === 'Accepté' || formData.status === 'Refusé';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Détails du devis
        </CardTitle>
        <CardDescription>
          Description et totaux du devis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Description détaillée des travaux à effectuer..."
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
            <div>Remise TTC : <span className="font-medium">{globalTotals.totalDiscount.toFixed(2)} €</span></div>
          </div>
          <div className="flex justify-end text-lg font-bold">
            Total : <span className="ml-2">{globalTotals.total.toFixed(2)} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
