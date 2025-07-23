
import { useQuery } from '@tanstack/react-query';
import { useInvoices } from '@/hooks/use-invoices';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useExpenses } from '@/hooks/use-expenses';
import { useClients } from '@/hooks/use-clients';
import { formatCurrency } from '@/lib/utils';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'Encaissement' | 'Dépense';
  method: string;
  amount: string;
  client: string;
  status?: string;
}


export const useAccountingData = () => {
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { receipts, isLoading: receiptsLoading } = useReceiptsData();
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { clients, isLoading: clientsLoading } = useClients();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['accounting-transactions', invoices, receipts, expenses, clients],
    queryFn: () => {
      const allTransactions: Transaction[] = [];

      // Ajouter les encaissements (reçus)
      if (receipts && clients) {
        receipts.forEach(receipt => {
          let clientName = 'Client non spécifié';
          let invoiceRef = 'Sans facture';

          if (receipt.invoices) {
            invoiceRef = `F-${receipt.invoices.reference}`;
            
            if (receipt.invoices.client_id) {
              const client = clients.find(c => c.id === receipt.invoices!.client_id);
              if (client) {
                clientName = `${client.first_name} ${client.last_name}`;
              }
            }
          }

          allTransactions.push({
            id: receipt.id,
            date: new Date(receipt.date).toLocaleDateString('fr-FR'),
            description: `Encaissement - ${invoiceRef}`,
            type: 'Encaissement',
            method: receipt.payment_method || 'Non spécifié',
            amount: formatCurrency(receipt.amount),
            client: clientName,
            status: receipt.status || 'Validé'
          });
        });
      }

      // Ajouter les dépenses
      if (expenses) {
        expenses.forEach(expense => {
          let vehicleInfo = 'Non assigné';
          if (expense.vehicle?.license_plate) {
            const brandName = expense.vehicle.car_brands?.name || '';
            const modelName = expense.vehicle.car_models?.name || '';
            vehicleInfo = `${expense.vehicle.license_plate} ${brandName} ${modelName}`.trim();
          }

          allTransactions.push({
            id: expense.id,
            date: new Date(expense.date).toLocaleDateString('fr-FR'),
            description: `${expense.category} - ${expense.supplier}`,
            type: 'Dépense',
            method: 'Fournisseur',
            amount: formatCurrency(expense.total_amount),
            client: vehicleInfo,
            status: expense.status || 'Payé'
          });
        });
      }

      // Ajouter les factures impayées comme transactions en attente
      if (invoices && clients) {
        invoices
          .filter(invoice => invoice.status === 'En attente de paiement' || invoice.status === 'Paiement partiel')
          .forEach(invoice => {
            let clientName = 'Client non spécifié';
            
            if (invoice.client_id) {
              const client = clients.find(c => c.id === invoice.client_id);
              if (client) {
                clientName = `${client.first_name} ${client.last_name}`;
              }
            }

            // Calculer le montant encore dû
            const totalPaid = receipts?.filter(r => r.invoice_id === invoice.id)
              .reduce((sum, r) => sum + r.amount, 0) || 0;
            const amountDue = invoice.amount - totalPaid;

            if (amountDue > 0) {
              allTransactions.push({
                id: `invoice-${invoice.id}`,
                date: new Date(invoice.due_date || invoice.date || invoice.created_at).toLocaleDateString('fr-FR'),
                description: `Facture impayée - F-${invoice.reference}`,
                type: 'Encaissement',
                method: 'À encaisser',
                amount: formatCurrency(amountDue),
                client: clientName,
                status: 'En attente'
              });
            }
          });
      }

      // Trier par date (plus récent en premier)
      return allTransactions.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
    },
    enabled: !invoicesLoading && !receiptsLoading && !expensesLoading && !clientsLoading
  });

  // Calculer les totaux avec les vraies données uniquement
  const realReceiptsTotal = receipts?.filter(r => r.status === 'Encaissé').reduce((sum, receipt) => sum + receipt.amount, 0) || 0;
  const realExpensesTotal = expenses?.reduce((sum, expense) => sum + expense.total_amount, 0) || 0;

  const totalReceipts = realReceiptsTotal;
  const totalExpenses = realExpensesTotal;
  const balance = totalReceipts - totalExpenses;

  return {
    transactions,
    isLoading: isLoading || invoicesLoading || receiptsLoading || expensesLoading || clientsLoading,
    totalReceipts,
    totalExpenses,
    balance
  };
};
