import React from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { formatAmount } from '@/utils/invoiceCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoicePaymentsTableProps {
  invoiceId: string;
}

const InvoicePaymentsTable = ({ invoiceId }: InvoicePaymentsTableProps) => {
  const { receipts } = useReceiptsData();
  
  // Filtrer les encaissements pour cette facture
  const invoicePayments = receipts?.filter(receipt => receipt.invoice_id === invoiceId) || [];
  
  // Ne pas afficher le tableau s'il n'y a pas d'encaissements
  if (invoicePayments.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Encaissements</h3>
      <table className="w-full bg-white">
        <thead>
          <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white">
            <th className="p-3 text-left text-sm font-medium">Date</th>
            <th className="p-3 text-left text-sm font-medium">Mode de paiement</th>
            <th className="p-3 text-right text-sm font-medium">Montant</th>
          </tr>
        </thead>
        <tbody>
          {invoicePayments.map((payment, index) => (
            <tr key={payment.id} className="bg-transparent">
              <td className="p-3 text-sm">
                {payment.created_at ? format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: fr }) : '-'}
              </td>
              <td className="p-3 text-sm">{payment.payment_method || '-'}</td>
              <td className="p-3 text-sm text-right font-medium">
                {formatAmount(payment.amount || 0)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: 'rgba(64,67,72,255)' }} className="text-white font-medium">
            <td colSpan={2} className="p-3 text-sm text-right">
              Total encaissé :
            </td>
            <td className="p-3 text-sm text-right font-bold">
              {formatAmount(invoicePayments.reduce((total, payment) => total + (payment.amount || 0), 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default InvoicePaymentsTable;