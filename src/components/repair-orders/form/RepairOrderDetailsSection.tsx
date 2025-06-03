
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { GlobalTotals } from './types';

interface RepairOrderDetailsSectionProps {
  description: string;
  onFieldChange: (field: string, value: any) => void;
  globalTotals: GlobalTotals;
  isReadOnly?: boolean;
}

export const RepairOrderDetailsSection = ({ description, onFieldChange, globalTotals, isReadOnly }: RepairOrderDetailsSectionProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Détails de l'ordre de réparation
        </CardTitle>
        <CardDescription>
          Description et totaux de l'ordre de réparation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Description détaillée des travaux à effectuer..."
            rows={4}
            readOnly={isReadOnly}
          />
        </div>

        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Totaux de l'ordre de réparation</h4>
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
