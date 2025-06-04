
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { CreditItem } from './types';

interface CreditTotalsSectionProps {
  items: CreditItem[];
}

export const CreditTotalsSection = ({ items }: CreditTotalsSectionProps) => {
  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const totalVat = items.reduce((sum, item) => {
      const subtotal = item.quantity * item.unit_price;
      const discountAmount = subtotal * (item.discount / 100);
      const afterDiscount = subtotal - discountAmount;
      return sum + (afterDiscount * (item.vat / 100));
    }, 0);
    const totalDiscount = items.reduce((sum, item) => {
      const subtotal = item.quantity * item.unit_price;
      return sum + (subtotal * (item.discount / 100));
    }, 0);
    const total = items.reduce((sum, item) => sum + item.total, 0);

    return { subTotal, totalVat, totalDiscount, total };
  };

  const totals = calculateTotals();

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Calculator className="h-5 w-5 mr-2" />
          Récapitulatif
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sous-total :</span>
            <span className="font-medium">{totals.subTotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remise totale :</span>
            <span className="font-medium">{totals.totalDiscount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>TVA :</span>
            <span className="font-medium">{totals.totalVat.toFixed(2)} €</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total :</span>
              <span>{totals.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
