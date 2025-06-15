
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

// Données de simulation pour développer les onglets
const mockTransactions: Transaction[] = [
  // Encaissements
  {
    id: 'enc-001',
    date: new Date('2024-06-10').toLocaleDateString('fr-FR'),
    description: 'Encaissement - F-2024-001',
    type: 'Encaissement',
    method: 'Virement bancaire',
    amount: formatCurrency(2500),
    client: 'Jean Dupont',
    status: 'Validé'
  },
  {
    id: 'enc-002',
    date: new Date('2024-06-08').toLocaleDateString('fr-FR'),
    description: 'Encaissement - F-2024-002',
    type: 'Encaissement',
    method: 'Carte bancaire',
    amount: formatCurrency(1850),
    client: 'Marie Martin',
    status: 'Validé'
  },
  {
    id: 'enc-003',
    date: new Date('2024-06-05').toLocaleDateString('fr-FR'),
    description: 'Encaissement - F-2024-003',
    type: 'Encaissement',
    method: 'Chèque',
    amount: formatCurrency(3200),
    client: 'Pierre Bernard',
    status: 'Validé'
  },
  {
    id: 'enc-004',
    date: new Date('2024-06-03').toLocaleDateString('fr-FR'),
    description: 'Encaissement - F-2024-004',
    type: 'Encaissement',
    method: 'Espèces',
    amount: formatCurrency(650),
    client: 'Sophie Leroy',
    status: 'Validé'
  },
  // Dépenses
  {
    id: 'dep-001',
    date: new Date('2024-06-12').toLocaleDateString('fr-FR'),
    description: 'Achat pièces automobiles - Fournisseur Auto',
    type: 'Dépense',
    method: 'Virement',
    amount: formatCurrency(1200),
    client: 'Fournisseur Auto Parts',
    status: 'Payé'
  },
  {
    id: 'dep-002',
    date: new Date('2024-06-11').toLocaleDateString('fr-FR'),
    description: 'Carburant véhicule atelier',
    type: 'Dépense',
    method: 'Carte bancaire',
    amount: formatCurrency(85),
    client: 'Station Total',
    status: 'Payé'
  },
  {
    id: 'dep-003',
    date: new Date('2024-06-09').toLocaleDateString('fr-FR'),
    description: 'Outillage professionnel',
    type: 'Dépense',
    method: 'Virement',
    amount: formatCurrency(450),
    client: 'Outillage Pro',
    status: 'Payé'
  },
  {
    id: 'dep-004',
    date: new Date('2024-06-07').toLocaleDateString('fr-FR'),
    description: 'Frais de transport - Livraison pièces',
    type: 'Dépense',
    method: 'Carte bancaire',
    amount: formatCurrency(35),
    client: 'Transport Express',
    status: 'Payé'
  },
  // Impayés
  {
    id: 'imp-001',
    date: new Date('2024-05-28').toLocaleDateString('fr-FR'),
    description: 'Encaissement - F-2024-015',
    type: 'Encaissement',
    method: 'Virement bancaire',
    amount: formatCurrency(1750),
    client: 'Antoine Moreau',
    status: 'En attente'
  },
  {
    id: 'imp-002',
    date: new Date('2024-05-25').toLocaleDateString('fr-FR'),
    description: 'Encaissement - F-2024-012',
    type: 'Encaissement',
    method: 'Chèque',
    amount: formatCurrency(2400),
    client: 'Isabelle Dubois',
    status: 'En attente'
  },
  {
    id: 'imp-003',
    date: new Date('2024-05-20').toLocaleDateString('fr-FR'),
    description: 'Encaissement - F-2024-008',
    type: 'Encaissement',
    method: 'Virement bancaire',
    amount: formatCurrency(980),
    client: 'François Rousseau',
    status: 'En attente'
  }
];

export const useAccountingData = () => {
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { receipts, isLoading: receiptsLoading } = useReceiptsData();
  const { expenses, isLoading: expensesLoading } = useExpenses();
  const { clients, isLoading: clientsLoading } = useClients();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['accounting-transactions', invoices, receipts, expenses, clients],
    queryFn: () => {
      const allTransactions: Transaction[] = [...mockTransactions];

      // Ajouter les vraies données si disponibles
      if (receipts && clients) {
        receipts.forEach(receipt => {
          let clientName = 'Client non spécifié';
          let invoiceRef = 'Sans facture';

          if (receipt.invoices) {
            invoiceRef = receipt.invoices.reference;
            
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

  // Calculer les totaux avec les données simulées
  const mockReceiptsTotal = mockTransactions
    .filter(t => t.type === 'Encaissement' && t.status !== 'En attente')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^\d,]/g, '').replace(',', '.')), 0);
  
  const mockExpensesTotal = mockTransactions
    .filter(t => t.type === 'Dépense')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^\d,]/g, '').replace(',', '.')), 0);

  const realReceiptsTotal = receipts?.reduce((sum, receipt) => sum + receipt.amount, 0) || 0;
  const realExpensesTotal = expenses?.reduce((sum, expense) => sum + expense.total_amount, 0) || 0;

  const totalReceipts = mockReceiptsTotal + realReceiptsTotal;
  const totalExpenses = mockExpensesTotal + realExpensesTotal;
  const balance = totalReceipts - totalExpenses;

  return {
    transactions,
    isLoading: isLoading || invoicesLoading || receiptsLoading || expensesLoading || clientsLoading,
    totalReceipts,
    totalExpenses,
    balance
  };
};
