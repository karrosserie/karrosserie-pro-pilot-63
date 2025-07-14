import React from 'react';

interface DefaultInvoiceTotalsProps {
  totals: {
    subtotal?: string;
    vat?: string;
    total?: string;
  };
}

const DefaultInvoiceTotals = ({ totals }: DefaultInvoiceTotalsProps) => {
  return (
    <div className="mt-4 flex justify-end">
      <div className="w-56">
        <div className="space-y-1 text-base">
          <div className="flex justify-between font-bold">
            <span>Sous-total</span>
            <span>{totals.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>TVA</span>
            <span>{totals.vat}</span>
          </div>
          <div className="flex justify-between font-bold text-lg bg-blue-600 text-white p-2">
            <span>TOTAL</span>
            <span>{totals.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultInvoiceTotals;