import React, { useMemo } from 'react';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useCredits } from '@/hooks/use-credits';
import { formatAmount } from '@/utils/invoiceCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoicePaymentsTableProps {
  invoiceId: string;
  invoiceTotal: number;
}

const InvoicePaymentsTable = ({ invoiceId, invoiceTotal }: InvoicePaymentsTableProps) => {
  const { receipts } = useReceiptsData();
  const { credits } = useCredits();
  
  // Fusionner et trier les paiements (receipts + avoirs)
  const allPayments = useMemo(() => {
    const receiptPayments = (receipts?.filter(r => r.invoice_id === invoiceId) || [])
      .map(r => ({
        id: r.id,
        date: r.created_at,
        payment_method: r.payment_method || '-',
        amount: r.amount || 0,
        type: 'receipt' as const
      }));
    
    const creditPayments = (credits?.filter(c => c.invoice_id === invoiceId) || [])
      .map(c => ({
        id: c.id,
        date: c.created_at,
        payment_method: `Avoir ${c.reference}${c.is_franchise_credit ? ' (Franchise)' : ''}`,
        amount: c.amount || 0,
        type: 'credit' as const
      }));
    
    return [...receiptPayments, ...creditPayments]
      .sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime());
  }, [receipts, credits, invoiceId]);
  
  // Calculer le total encaissé et le solde restant
  const totalPaid = allPayments.reduce((total, payment) => total + payment.amount, 0);
  const remainingBalance = Math.max(0, invoiceTotal - totalPaid);
  
  // Ne pas afficher le tableau s'il n'y a pas de paiements
  if (allPayments.length === 0) {
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
          {allPayments.map((payment) => (
            <tr key={payment.id} className="bg-transparent">
              <td className="p-3 text-sm">
                {payment.date ? format(new Date(payment.date), 'dd/MM/yyyy', { locale: fr }) : '-'}
              </td>
              <td className={`p-3 text-sm ${payment.type === 'credit' ? 'text-green-600 font-medium' : ''}`}>
                {payment.payment_method}
              </td>
              <td className={`p-3 text-sm text-right font-medium ${payment.type === 'credit' ? 'text-green-600' : ''}`}>
                {formatAmount(payment.amount)}
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
            <td colSpan={2} className="p-3 text-sm text-right font-medium text-red-600">
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
