
import { useQuery } from '@tanstack/react-query';
import { useInvoices } from '@/hooks/use-invoices';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useExpenses } from '@/hooks/use-expenses';
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

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['accounting-transactions', invoices, receipts, expenses],
    queryFn: () => {
      const allTransactions: Transaction[] = [];

      // Ajouter les encaissements
      if (receipts) {
        receipts.forEach(receipt => {
          allTransactions.push({
            id: receipt.id,
            date: new Date(receipt.date).toLocaleDateString('fr-FR'),
            description: `Encaissement - ${receipt.invoice || 'Sans facture'}`,
            type: 'Encaissement',
            method: receipt.payment_method || 'Non spécifié',
            amount: formatCurrency(receipt.amount),
            client: receipt.invoices?.clients ? `${receipt.invoices.clients.first_name} ${receipt.invoices.clients.last_name}` : 'Client non spécifié'
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
    enabled: !invoicesLoading && !receiptsLoading && !expensesLoading
  });

  const totalReceipts = receipts?.reduce((sum, receipt) => sum + receipt.amount, 0) || 0;
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.total_amount, 0) || 0;
  const balance = totalReceipts - totalExpenses;

  const statsCards = [
    {
      title: 'Encaissements du mois',
      value: formatCurrency(totalReceipts),
      period: 'Ce mois',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Dépenses du mois',
      value: formatCurrency(totalExpenses),
      period: 'Ce mois',
      trend: '+8%',
      trendUp: false
    },
    {
      title: 'Bénéfice net',
      value: formatCurrency(balance),
      period: 'Ce mois',
      trend: balance >= 0 ? '+15%' : '-5%',
      trendUp: balance >= 0
    },
    {
      title: 'Nombre de transactions',
      value: transactions.length.toString(),
      period: 'Ce mois',
      trend: '+22%',
      trendUp: true
    }
  ];

  return {
    transactions,
    statsCards,
    isLoading: isLoading || invoicesLoading || receiptsLoading || expensesLoading,
    totalReceipts,
    totalExpenses,
    balance
  };
};
