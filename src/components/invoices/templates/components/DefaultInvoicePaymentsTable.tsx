import React from 'react';

interface DefaultInvoicePaymentsTableProps {
  clientData?: {
    notes?: string;
  };
}

const DefaultInvoicePaymentsTable = ({ clientData }: DefaultInvoicePaymentsTableProps) => {
  return (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-1 text-gray-800">Liste des paiements</h3>
        <table className="w-full text-base bg-white">
          <thead>
            <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white">
              <th className="p-3 text-left font-medium">Date</th>
              <th className="p-3 text-left font-medium">Mode de paiement</th>
              <th className="p-3 text-right font-medium">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3">10/07/2025</td>
              <td className="p-3">Virement</td>
              <td className="p-3 text-right">200,00 €</td>
            </tr>
            <tr>
              <td className="p-3">11/07/2025</td>
              <td className="p-3">Virement</td>
              <td className="p-3 text-right">175,00 €</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2 mr-2 flex justify-end">
          <div className="w-56">
            <div className="space-y-1 text-base">
              <div className="flex justify-between font-bold">
                <span>Total encaissé :</span>
                <span>375,00 €</span>
              </div>
              <div className="flex justify-between font-bold text-red-600">
                <span>Solde restant :</span>
                <span>719,78 €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {clientData?.notes && (
        <div className="mt-4">
          <p className="font-medium">Notes</p>
          <p>{clientData.notes}</p>
        </div>
      )}
    </>
  );
};

export default DefaultInvoicePaymentsTable;