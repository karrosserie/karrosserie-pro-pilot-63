
import { useQuery } from '@tanstack/react-query';
import { useVehicles } from '@/hooks/use-vehicles';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useAccountingData } from '@/hooks/use-accounting-data';

export const useDashboardData = () => {
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { clients, isLoading: clientsLoading } = useClients();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { quotes, isLoading: quotesLoading } = useQuotes();
  const { totalReceipts } = useAccountingData();

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', vehicles, clients, invoices, quotes],
    queryFn: () => {
      const vehiclesInRepair = vehicles?.filter(v => v.status === 'en_reparation').length || 0;
      const activeClients = clients?.length || 0;
      const pendingQuotes = quotes?.filter(q => q.status === 'draft').length || 0;
      
      return {
        vehiclesInRepair,
        activeClients,
        pendingQuotes,
        revenue: totalReceipts
      };
    },
    enabled: !vehiclesLoading && !clientsLoading && !invoicesLoading && !quotesLoading
  });

  const { data: recentVehicles } = useQuery({
    queryKey: ['recent-vehicles', vehicles],
    queryFn: () => {
      if (!vehicles) return [];
      
      return vehicles
        .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
        .slice(0, 3)
        .map(vehicle => ({
          id: vehicle.id,
          model: `${vehicle.brand} ${vehicle.model}`,
          licensePlate: vehicle.license_plate,
          client: 'Client', // On pourrait enrichir avec les données client
          status: vehicle.status,
          lastUpdate: new Date(vehicle.updated_at || vehicle.created_at).toLocaleDateString('fr-FR')
        }));
    },
    enabled: !!vehicles
  });

  const { data: recentDocuments } = useQuery({
    queryKey: ['recent-documents', invoices, quotes],
    queryFn: () => {
      const documents = [];
      
      if (invoices) {
        invoices.slice(0, 2).forEach(invoice => {
          documents.push({
            id: invoice.id,
            title: `Facture - ${invoice.reference}`,
            client: invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client',
            date: new Date(invoice.created_at).toLocaleDateString('fr-FR'),
            type: 'invoice'
          });
        });
      }
      
      if (quotes) {
        quotes.slice(0, 2).forEach(quote => {
          documents.push({
            id: quote.id,
            title: `Devis - ${quote.reference}`,
            client: quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : 'Client',
            date: new Date(quote.created_at).toLocaleDateString('fr-FR'),
            type: 'quote'
          });
        });
      }
      
      return documents.slice(0, 4);
    },
    enabled: !!invoices || !!quotes
  });

  return {
    dashboardStats,
    recentVehicles,
    recentDocuments,
    isLoading: isLoading || vehiclesLoading || clientsLoading
  };
};
