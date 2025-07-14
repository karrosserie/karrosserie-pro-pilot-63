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
  
  if (isAlternative) {
    // Modèle alternatif - tableau horizontal avec bordures
    return (
      <div className="flex justify-end">
        <div className="border-2 border-black rounded-lg overflow-hidden">
          <table className="text-sm border-collapse">
            <tbody>
              <tr>
                <td className="border-r-2 border-black p-2 font-bold text-center">Total HT</td>
                <td className="border-r-2 border-black p-2 font-bold text-center">Total TVA</td>
                <td className="border-r-2 border-black p-2 font-bold text-center">Total Remise</td>
                <td className="p-2 font-bold text-center">Total TTC</td>
              </tr>
              <tr>
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{formatAmount(subtotalAfterDiscount)}</td>
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{formatAmount(totalVAT)}</td>
                <td className="border-r-2 border-black border-t-2 border-black p-2 font-bold">{formatAmount(totalDiscount)}</td>
                <td className="border-t-2 border-black p-2 font-bold">{formatAmount(finalTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  // Modèle par défaut - vertical
  return (
    <div className="mt-4 flex justify-end">
      <div className="w-56">
        <div className="space-y-1 text-base">
          <div className="flex justify-between font-bold">
            <span>Sous-total</span>
            <span>{formatAmount(subtotalAfterDiscount)}</span>
          </div>
          <div className="flex justify-between">
            <span>TVA</span>
            <span>{formatAmount(totalVAT)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg bg-blue-600 text-white p-2">
            <span>TOTAL</span>
            <span>{formatAmount(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;