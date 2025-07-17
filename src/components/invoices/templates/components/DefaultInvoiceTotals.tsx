import React from 'react';

interface DefaultInvoiceTotalsProps {
  totals: {
    subtotal?: string;
    vat?: string;
    total?: string;
  };
  clientData?: {
    notes?: string;
    paymentDetails?: string;
  };
}

const DefaultInvoiceTotals = ({ totals, clientData }: DefaultInvoiceTotalsProps) => {
  return (
    <div className="mt-4">
      {/* Notes section */}
      {clientData?.notes && (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2">Notes :</h3>
          <div className="text-sm whitespace-pre-wrap border p-2 bg-gray-50">
            {clientData.notes}
          </div>
        </div>
      )}

      {/* Détails de paiement section */}
      {clientData?.paymentDetails && (
        <div className="mb-4">
          <h3 className="font-bold text-sm mb-2">Détails de paiement :</h3>
          <div className="text-sm whitespace-pre-wrap border p-2 bg-gray-50">
            {clientData.paymentDetails}
          </div>
        </div>
      )}

      {/* Totals section */}
      <div className="mr-2 flex justify-end">
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
    </div>
  );
};

export default DefaultInvoiceTotals;