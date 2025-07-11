import React from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { formatAmount } from '@/utils/invoiceCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoicePaymentsTableProps {
  invoiceId: string;
  invoiceTotal: number;
}

const InvoicePaymentsTable = ({ invoiceId, invoiceTotal }: InvoicePaymentsTableProps) => {
  const { receipts } = useReceiptsData();
  
  // Filtrer et trier les encaissements pour cette facture par date croissante
  const invoicePayments = receipts?.filter(receipt => receipt.invoice_id === invoiceId)
    .sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()) || [];
  
  // Calculer le total encaissé et le solde restant
  const totalPaid = invoicePayments.reduce((total, payment) => total + (payment.amount || 0), 0);
  const remainingBalance = invoiceTotal - totalPaid;
  
  // Ne pas afficher le tableau s'il n'y a pas d'encaissements
  if (invoicePayments.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Liste des paiements</h3>
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
          <tr className="bg-transparent">
            <td colSpan={2} className="p-3 text-sm text-right font-medium">
              Total encaissé :
            </td>
            <td className="p-3 text-sm text-right font-bold">
              {formatAmount(totalPaid)}
            </td>
          </tr>
          <tr className="bg-transparent">
            <td colSpan={2} className="p-3 text-sm text-right font-medium">
              Solde restant :
            </td>
            <td className="p-3 text-sm text-right font-bold text-red-600">
              {formatAmount(remainingBalance)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default InvoicePaymentsTable;