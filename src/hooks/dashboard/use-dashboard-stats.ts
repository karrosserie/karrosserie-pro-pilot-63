
import { useQuery } from '@tanstack/react-query';
import { useVehicles } from '@/hooks/use-vehicles';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { useReceipts } from '@/hooks/use-receipts';
import { parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

export const useDashboardStats = () => {
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { clients, isLoading: clientsLoading } = useClients();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { quotes, isLoading: quotesLoading } = useQuotes();
  const { receipts } = useReceipts();
  const { transactions } = useAccountingData();

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', vehicles, clients, invoices, quotes, receipts, transactions],
    queryFn: () => {
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      // Calculer les statistiques actuelles
      const vehiclesInRepair = vehicles?.filter(v => v.status === 'En cours').length || 0;
      const activeClients = clients?.length || 0;
      const pendingQuotes = quotes?.filter(q => q.status === 'En attente').length || 0;

      // Calculer le chiffre d'affaires du mois actuel et du mois précédent
      const currentMonthRevenue = receipts?.filter(receipt => {
        const receiptDate = new Date(receipt.date);
        return receipt.status === 'Encaissé' && 
               isWithinInterval(receiptDate, { start: currentMonthStart, end: currentMonthEnd });
      }).reduce((sum, receipt) => sum + Number(receipt.amount), 0) || 0;

      const lastMonthRevenue = receipts?.filter(receipt => {
        const receiptDate = new Date(receipt.date);
        return receipt.status === 'Encaissé' && 
               isWithinInterval(receiptDate, { start: lastMonthStart, end: lastMonthEnd });
      }).reduce((sum, receipt) => sum + Number(receipt.amount), 0) || 0;

      // Calculer la variation du CA
      let revenueChange = 0;
      let revenueChangeText = '';
      if (lastMonthRevenue > 0) {
        revenueChange = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        revenueChangeText = `${revenueChange >= 0 ? '+' : ''}${Math.round(revenueChange)}%`;
      } else if (currentMonthRevenue > 0) {
        revenueChangeText = '+100%';
        revenueChange = 100;
      }

      // Calculer le nombre de clients ce mois vs mois dernier
      const currentMonthClients = clients?.filter(client => {
        const clientDate = new Date(client.created_at);
        return isWithinInterval(clientDate, { start: currentMonthStart, end: currentMonthEnd });
      }).length || 0;

      const lastMonthClients = clients?.filter(client => {
        const clientDate = new Date(client.created_at);
        return isWithinInterval(clientDate, { start: lastMonthStart, end: lastMonthEnd });
      }).length || 0;

      // Calculer la variation des clients
      let clientsChange = 0;
      let clientsChangeText = '';
      if (lastMonthClients > 0) {
        clientsChange = ((currentMonthClients - lastMonthClients) / lastMonthClients) * 100;
        clientsChangeText = `${clientsChange >= 0 ? '+' : ''}${Math.round(clientsChange)}%`;
      } else if (currentMonthClients > 0) {
        clientsChangeText = '+100%';
        clientsChange = 100;
      }

      // Calculer le CA carrosserie et mécanique (basé sur les transactions)
      const currentMonthCarBodyRevenue = transactions?.filter(transaction => {
        if (!transaction.date) return false;
        const transactionDate = parseISO(transaction.date.split('/').reverse().join('-'));
        return transaction.type === 'Encaissement' && 
               transaction.description.toLowerCase().includes('carrosserie') &&
               isWithinInterval(transactionDate, { start: currentMonthStart, end: currentMonthEnd });
      }).reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0) || 0;

      const currentMonthMechanicRevenue = transactions?.filter(transaction => {
        if (!transaction.date) return false;
        const transactionDate = parseISO(transaction.date.split('/').reverse().join('-'));
        return transaction.type === 'Encaissement' && 
               (transaction.description.toLowerCase().includes('mécanique') || 
                transaction.description.toLowerCase().includes('mecanique')) &&
               isWithinInterval(transactionDate, { start: currentMonthStart, end: currentMonthEnd });
      }).reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0) || 0;

      const lastMonthCarBodyRevenue = transactions?.filter(transaction => {
        if (!transaction.date) return false;
        const transactionDate = parseISO(transaction.date.split('/').reverse().join('-'));
        return transaction.type === 'Encaissement' && 
               transaction.description.toLowerCase().includes('carrosserie') &&
               isWithinInterval(transactionDate, { start: lastMonthStart, end: lastMonthEnd });
      }).reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0) || 0;

      const lastMonthMechanicRevenue = transactions?.filter(transaction => {
        if (!transaction.date) return false;
        const transactionDate = parseISO(transaction.date.split('/').reverse().join('-'));
        return transaction.type === 'Encaissement' && 
               (transaction.description.toLowerCase().includes('mécanique') || 
                transaction.description.toLowerCase().includes('mecanique')) &&
               isWithinInterval(transactionDate, { start: lastMonthStart, end: lastMonthEnd });
      }).reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0) || 0;

      // Calculer les variations pour carrosserie et mécanique
      let carBodyChange = 0;
      let carBodyChangeText = '';
      if (lastMonthCarBodyRevenue > 0) {
        carBodyChange = ((currentMonthCarBodyRevenue - lastMonthCarBodyRevenue) / lastMonthCarBodyRevenue) * 100;
        carBodyChangeText = `${carBodyChange >= 0 ? '+' : ''}${Math.round(carBodyChange)}%`;
      } else if (currentMonthCarBodyRevenue > 0) {
        carBodyChangeText = '+100%';
        carBodyChange = 100;
      }

      let mechanicChange = 0;
      let mechanicChangeText = '';
      if (lastMonthMechanicRevenue > 0) {
        mechanicChange = ((currentMonthMechanicRevenue - lastMonthMechanicRevenue) / lastMonthMechanicRevenue) * 100;
        mechanicChangeText = `${mechanicChange >= 0 ? '+' : ''}${Math.round(mechanicChange)}%`;
      } else if (currentMonthMechanicRevenue > 0) {
        mechanicChangeText = '+100%';
        mechanicChange = 100;
      }

      console.log('Dashboard stats calculation:', {
        currentMonthRevenue,
        lastMonthRevenue,
        revenueChange,
        currentMonthClients,
        lastMonthClients,
        clientsChange,
        currentMonthCarBodyRevenue,
        lastMonthCarBodyRevenue,
        carBodyChange,
        currentMonthMechanicRevenue,
        lastMonthMechanicRevenue,
        mechanicChange
      });
      
      return {
        vehiclesInRepair,
        activeClients,
        pendingQuotes,
        revenue: currentMonthRevenue,
        revenueChange: revenueChangeText,
        revenueIsPositive: revenueChange >= 0,
        clientsChange: clientsChangeText,
        clientsIsPositive: clientsChange >= 0,
        carBodyRevenue: currentMonthCarBodyRevenue,
        carBodyChange: carBodyChangeText,
        carBodyIsPositive: carBodyChange >= 0,
        mechanicRevenue: currentMonthMechanicRevenue,
        mechanicChange: mechanicChangeText,
        mechanicIsPositive: mechanicChange >= 0
      };
    },
    enabled: !vehiclesLoading && !clientsLoading && !invoicesLoading && !quotesLoading
  });

  return {
    dashboardStats,
    isLoading: isLoading || vehiclesLoading || clientsLoading
  };
};
