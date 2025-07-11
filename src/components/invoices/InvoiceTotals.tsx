import React from 'react';
import { formatAmount } from '@/utils/invoiceCalculations';

interface InvoiceTotalsProps {
  subtotalAfterDiscount: number;
  totalVAT: number;
  totalDiscount: number;
  finalTotal: number;
}

const InvoiceTotals = ({ subtotalAfterDiscount, totalVAT, totalDiscount, finalTotal }: InvoiceTotalsProps) => {
  return (
    <div className="flex justify-end">
      <div className="w-80">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between font-bold">
            <span>Sous-total</span>
            <span>{formatAmount(subtotalAfterDiscount)}</span>
          </div>
          <div className="flex justify-between">
            <span>TVA</span>
            <span>{formatAmount(totalVAT)}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between bg-blue-600 text-white p-3 rounded font-bold">
              <span>TOTAL</span>
              <span>{formatAmount(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;