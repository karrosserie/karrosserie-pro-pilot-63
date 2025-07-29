
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { GlobalTotals } from './types';

interface RepairOrderDetailsSectionProps {
  onFieldChange: (field: string, value: any) => void;
  globalTotals: GlobalTotals;
  notes: string;
  personalItems: string;
  isReadOnly?: boolean;
}

export const RepairOrderDetailsSection = ({ onFieldChange, globalTotals, notes, personalItems, isReadOnly }: RepairOrderDetailsSectionProps) => {
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

        <div className="border-t pt-4 space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              placeholder="Notes et observations concernant l'ordre de réparation..."
              rows={4}
              readOnly={isReadOnly}
            />
          </div>
          
          <div>
            <Label htmlFor="personal_items">Effets personnels (liste exhaustive)</Label>
            <Textarea
              id="personal_items"
              value={personalItems}
              onChange={(e) => onFieldChange('personal_items', e.target.value)}
              placeholder="Liste détaillée des effets personnels présents dans le véhicule..."
              rows={3}
              readOnly={isReadOnly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
