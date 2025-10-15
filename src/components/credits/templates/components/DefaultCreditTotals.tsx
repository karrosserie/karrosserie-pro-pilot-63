import React from 'react';

interface DefaultCreditTotalsProps {
  totals: {
    subtotal?: string;
    vat?: string;
    total?: string;
  };
  clientData?: {
    notes?: string;
  };
}

const DefaultCreditTotals = ({ totals, clientData }: DefaultCreditTotalsProps) => {
  return (
    <>
      <div className="mt-3 sm:mt-4 mr-1 sm:mr-2 flex justify-end break-inside-avoid">
        <div className="w-48 sm:w-56">
          <div className="space-y-0.5 sm:space-y-1 text-sm sm:text-base">
            <div className="flex justify-between font-bold">
              <span>Sous-total</span>
              <span>{totals.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>TVA</span>
              <span>{totals.vat}</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-lg bg-blue-600 text-white p-1.5 sm:p-2">
              <span>TOTAL</span>
              <span>{totals.total}</span>
            </div>
          </div>
        </div>
      </div>
      {clientData?.notes && (
        <div className="mt-3 sm:mt-4">
          <p className="font-medium text-sm sm:text-base">Notes</p>
          <p className="text-xs sm:text-sm">{clientData.notes}</p>
        </div>
      )}
    </>
  );
};

export default DefaultCreditTotals;