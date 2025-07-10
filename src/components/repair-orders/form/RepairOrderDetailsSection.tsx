
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { GlobalTotals } from './types';

interface RepairOrderDetailsSectionProps {
  onFieldChange: (field: string, value: any) => void;
  globalTotals: GlobalTotals;
  isReadOnly?: boolean;
}

export const RepairOrderDetailsSection = ({ onFieldChange, globalTotals, isReadOnly }: RepairOrderDetailsSectionProps) => {
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
      </CardContent>
    </Card>
  );
};
