import React from 'react';
import { formatAmount } from '@/utils/invoiceCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Payment {
  id: string;
  date?: string;
  payment_method?: string;
  amount?: number;
  type?: 'receipt' | 'credit';
}

interface DefaultInvoicePaymentsTableProps {
  clientData?: {
    notes?: string;
  };
  invoiceData?: {
    payment_details?: string;
  };
  payments?: Payment[];
  totalPaidAmount?: number;
  remainingAmount?: number;
}

const DefaultInvoicePaymentsTable = ({ 
  clientData, 
  invoiceData, 
  payments = [], 
  totalPaidAmount = 0, 
  remainingAmount = 0 
}: DefaultInvoicePaymentsTableProps) => {
  if (payments.length === 0) {
    return (
      <>
        <div>
          <h3 className="text-lg font-semibold mb-1 text-gray-800">Liste des paiements</h3>
          <p className="text-gray-500 text-sm">Aucun paiement enregistré pour cette facture.</p>
        </div>
        {clientData?.notes && (
          <div className="mt-4">
            <p className="font-medium">Notes</p>
            <p>{clientData.notes}</p>
          </div>
        )}
        {invoiceData?.payment_details && (
          <div className="mt-4">
            <p className="font-medium">Détails de paiement</p>
            <p>{invoiceData.payment_details}</p>
          </div>
        )}
      </>
    );
  }

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
            {payments.map((payment, index) => (
              <tr key={payment.id || index}>
                <td className="p-3">
                  {payment.date ? format(new Date(payment.date), 'dd/MM/yyyy', { locale: fr }) : '-'}
                </td>
                <td className={`p-3 ${payment.type === 'credit' ? 'text-green-600 font-medium' : ''}`}>
                  {payment.payment_method || '-'}
                </td>
                <td className={`p-3 text-right ${payment.type === 'credit' ? 'text-green-600 font-medium' : ''}`}>
                  {formatAmount(payment.amount || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 mr-2 flex justify-end">
          <div className="w-56">
            <div className="space-y-1 text-base">
              <div className="flex justify-between font-bold">
                <span>Total encaissé :</span>
                <span>{formatAmount(totalPaidAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-red-600">
                <span>Solde restant :</span>
                <span>{formatAmount(remainingAmount)}</span>
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
      {invoiceData?.payment_details && (
        <div className="mt-4">
          <p className="font-medium">Détails de paiement</p>
          <p>{invoiceData.payment_details}</p>
        </div>
      )}
    </>
  );
};

export default DefaultInvoicePaymentsTable;
