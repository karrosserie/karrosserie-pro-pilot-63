import React from 'react';
import { formatAmount } from '@/utils/invoiceCalculations';

interface InvoiceTotalsProps {
  subtotalAfterDiscount: number;
  totalVAT: number;
  totalDiscount: number;
  finalTotal: number;
  template?: string;
}

const InvoiceTotals = ({ subtotalAfterDiscount, totalVAT, totalDiscount, finalTotal, template = 'default' }: InvoiceTotalsProps) => {
  const isAlternative = template === 'alternative';
  
  return (
    <div className="flex justify-end">
      <div className="w-80">
        <div className={`space-y-2 text-sm ${isAlternative ? 'p-4' : ''}`}>
          <div className={`flex justify-between font-bold ${isAlternative ? 'border-b-2 border-black pb-2' : ''}`}>
            <span>Sous-total</span>
            <span>{formatAmount(subtotalAfterDiscount)}</span>
          </div>
          <div className={`flex justify-between ${isAlternative ? 'border-b-2 border-black pb-2' : ''}`}>
            <span>TVA</span>
            <span>{formatAmount(totalVAT)}</span>
          </div>
          <div>
            <div className={`flex justify-between p-3 font-bold ${isAlternative ? 'bg-gray-200 border-2 border-black' : 'bg-blue-600 text-white'}`}>
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