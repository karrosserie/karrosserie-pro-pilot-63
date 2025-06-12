
import { useQuery } from '@tanstack/react-query';
import { useVehicles } from '@/hooks/use-vehicles';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useAccountingData } from '@/hooks/use-accounting-data';

export const useDashboardStats = () => {
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { clients, isLoading: clientsLoading } = useClients();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { quotes, isLoading: quotesLoading } = useQuotes();
  const { totalReceipts } = useAccountingData();

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', vehicles, clients, invoices, quotes],
    queryFn: () => {
      // Véhicules en réparation = statut "En cours"
      const vehiclesInRepair = vehicles?.filter(v => v.status === 'En cours').length || 0;
      const activeClients = clients?.length || 0;
      // Devis en attente = statut "En attente"
      const pendingQuotes = quotes?.filter(q => q.status === 'En attente').length || 0;
      
      console.log('Dashboard stats calculation:', {
        totalVehicles: vehicles?.length || 0,
        vehiclesInRepair,
        vehicleStatuses: vehicles?.map(v => ({ id: v.id, status: v.status })) || [],
        totalQuotes: quotes?.length || 0,
        pendingQuotes,
        quoteStatuses: quotes?.map(q => ({ id: q.id, status: q.status })) || []
      });
      
      return {
        vehiclesInRepair,
        activeClients,
        pendingQuotes,
        revenue: totalReceipts
      };
    },
    enabled: !vehiclesLoading && !clientsLoading && !invoicesLoading && !quotesLoading
  });

  return {
    dashboardStats,
    isLoading: isLoading || vehiclesLoading || clientsLoading
  };
};
