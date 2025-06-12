
import { useQuery } from '@tanstack/react-query';
import { useVehicles } from '@/hooks/use-vehicles';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { formatCurrency } from '@/lib/utils';

export const useDashboardData = () => {
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { clients, isLoading: clientsLoading } = useClients();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { quotes, isLoading: quotesLoading } = useQuotes();
  const { receipts, isLoading: receiptsLoading } = useReceiptsData();
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
          client: 'Client',
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

  // Activité récente basée sur les vraies données
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity', quotes, clients, vehicles, receipts],
    queryFn: () => {
      const activities = [];

      // Devis récents
      if (quotes) {
        quotes.slice(0, 2).forEach(quote => {
          let vehicleInfo = 'Véhicule non spécifié';
          
          // Chercher le véhicule correspondant
          if (quote.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === quote.vehicle_id);
            if (vehicle) {
              vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
            }
          }
          
          activities.push({
            id: `quote-${quote.id}`,
            icon: 'FileText',
            iconBackground: 'bg-blue-500',
            title: 'Devis créé',
            description: quote.clients ? 
              `${vehicleInfo} - ${quote.clients.first_name} ${quote.clients.last_name}` :
              `Devis ${quote.reference}`,
            time: new Date(quote.created_at).toLocaleDateString('fr-FR'),
            timestamp: new Date(quote.created_at).getTime()
          });
        });
      }

      // Nouveaux clients
      if (clients) {
        clients.slice(0, 2).forEach(client => {
          activities.push({
            id: `client-${client.id}`,
            icon: 'User',
            iconBackground: 'bg-green-500',
            title: 'Nouveau client',
            description: `${client.first_name} ${client.last_name}`,
            time: new Date(client.created_at).toLocaleDateString('fr-FR'),
            timestamp: new Date(client.created_at).getTime()
          });
        });
      }

      // Véhicules récemment mis à jour
      if (vehicles) {
        vehicles.slice(0, 1).forEach(vehicle => {
          activities.push({
            id: `vehicle-${vehicle.id}`,
            icon: 'Car',
            iconBackground: 'bg-purple-500',
            title: 'Véhicule mis à jour',
            description: `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`,
            time: new Date(vehicle.updated_at || vehicle.created_at).toLocaleDateString('fr-FR'),
            timestamp: new Date(vehicle.updated_at || vehicle.created_at).getTime()
          });
        });
      }

      // Paiements récents
      if (receipts) {
        receipts.slice(0, 1).forEach(receipt => {
          activities.push({
            id: `receipt-${receipt.id}`,
            icon: 'CreditCard',
            iconBackground: 'bg-amber-500',
            title: 'Paiement reçu',
            description: receipt.invoices ? 
              `Facture ${receipt.invoices.reference}` :
              `Encaissement de ${formatCurrency(receipt.amount)}`,
            time: new Date(receipt.date).toLocaleDateString('fr-FR'),
            timestamp: new Date(receipt.date).getTime()
          });
        });
      }

      // Trier par date (plus récent en premier) et prendre les 4 plus récents
      return activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 4);
    },
    enabled: !quotesLoading && !clientsLoading && !vehiclesLoading && !receiptsLoading
  });

  return {
    dashboardStats,
    recentVehicles,
    recentDocuments,
    recentActivity,
    isLoading: isLoading || vehiclesLoading || clientsLoading
  };
};
