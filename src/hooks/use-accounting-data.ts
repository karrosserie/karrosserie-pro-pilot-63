
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

      // Ajouter les encaissements
      if (receipts && clients) {
        receipts.forEach(receipt => {
          let clientName = 'Client non spécifié';
          let invoiceRef = 'Sans facture';

          // Récupérer la référence de la facture
          if (receipt.invoices) {
            invoiceRef = receipt.invoices.reference;
            
            // Trouver le client associé à cette facture
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
            status: receipt.status
          });
        });
      }

      // Ajouter les dépenses
      if (expenses) {
        expenses.forEach(expense => {
          allTransactions.push({
            id: expense.id,
            date: new Date(expense.date).toLocaleDateString('fr-FR'),
            description: `${expense.type} - ${expense.supplier}`,
            type: 'Dépense',
            method: 'Fournisseur',
            amount: formatCurrency(expense.total_amount),
            client: expense.vehicle?.license_plate ? `Véhicule ${expense.vehicle.license_plate}` : 'Non assigné',
            status: expense.status
          });
        });
      }

      // Trier par date (plus récent en premier)
      return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    enabled: !invoicesLoading && !receiptsLoading && !expensesLoading && !clientsLoading
  });

  const totalReceipts = receipts?.reduce((sum, receipt) => sum + receipt.amount, 0) || 0;
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.total_amount, 0) || 0;
  const balance = totalReceipts - totalExpenses;

  return {
    transactions,
    isLoading: isLoading || invoicesLoading || receiptsLoading || expensesLoading || clientsLoading,
    totalReceipts,
    totalExpenses,
    balance
  };
};
