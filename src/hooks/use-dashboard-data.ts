import { useQuery } from '@tanstack/react-query';
import { useVehicles } from '@/hooks/use-vehicles';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useCredits } from '@/hooks/use-credits';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useExpenses } from '@/hooks/use-expenses';
import { formatCurrency } from '@/lib/utils';

export const useDashboardData = () => {
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { clients, isLoading: clientsLoading } = useClients();
  const { invoices, isLoading: invoicesLoading } = useInvoices();
  const { quotes, isLoading: quotesLoading } = useQuotes();
  const { orders: repairOrders, isLoading: ordersLoading } = useRepairOrders();
  const { reports: expertiseReports, isLoading: expertiseLoading } = useExpertiseReports();
  const { credits, isLoading: creditsLoading } = useCredits();
  const { receipts, isLoading: receiptsLoading } = useReceiptsData();
  const { expenses, isLoading: expensesLoading } = useExpenses();
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

  const { data: recentVehicles } = useQuery({
    queryKey: ['recent-vehicles', vehicles, clients],
    queryFn: () => {
      if (!vehicles) return [];
      
      return vehicles
        .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
        .slice(0, 3)
        .map(vehicle => {
          // Trouver le client associé
          const client = clients?.find(c => c.id === vehicle.client_id);
          const clientName = client ? `${client.first_name} ${client.last_name}` : 'Client non assigné';
          
          return {
            id: vehicle.id,
            model: `${vehicle.brand || ''} ${vehicle.model || ''}`.trim() || 'Véhicule',
            licensePlate: vehicle.license_plate || 'N/A',
            client: clientName,
            status: vehicle.status || 'En attente',
            lastUpdate: new Date(vehicle.updated_at || vehicle.created_at).toLocaleDateString('fr-FR'),
            vehicleData: vehicle // Garder les données complètes pour les actions
          };
        });
    },
    enabled: !!vehicles && !!clients
  });

  const { data: recentDocuments } = useQuery({
    queryKey: ['recent-documents', invoices, quotes, repairOrders, expertiseReports, credits, vehicles, clients],
    queryFn: () => {
      const documents = [];
      
      // Factures
      if (invoices) {
        invoices.forEach(invoice => {
          const createdDate = new Date(invoice.created_at);
          const clientName = invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client non spécifié';
          
          // Trouver le véhicule associé
          let vehicleInfo = 'Véhicule non spécifié';
          if (invoice.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === invoice.vehicle_id);
            if (vehicle) {
              vehicleInfo = `${vehicle.brand || ''} ${vehicle.model || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
            }
          }
          
          documents.push({
            id: `invoice-${invoice.id}`,
            title: `Facture`,
            client: clientName,
            description: `Client: ${clientName} | Véhicule: ${vehicleInfo}`,
            date: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            type: 'invoice',
            timestamp: createdDate.getTime()
          });
        });
      }
      
      // Devis
      if (quotes) {
        quotes.forEach(quote => {
          const createdDate = new Date(quote.created_at);
          const clientName = quote.clients ? `${quote.clients.first_name} ${quote.clients.last_name}` : 'Client non spécifié';
          
          // Trouver le véhicule associé
          let vehicleInfo = 'Véhicule non spécifié';
          if (quote.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === quote.vehicle_id);
            if (vehicle) {
              vehicleInfo = `${vehicle.brand || ''} ${vehicle.model || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
            }
          }
          
          documents.push({
            id: `quote-${quote.id}`,
            title: `Devis`,
            client: clientName,
            description: `Client: ${clientName} | Véhicule: ${vehicleInfo}`,
            date: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            type: 'quote',
            timestamp: createdDate.getTime()
          });
        });
      }

      // Ordres de réparation
      if (repairOrders) {
        repairOrders.forEach(order => {
          const createdDate = new Date(order.created_at);
          const clientName = order.clients ? `${order.clients.first_name} ${order.clients.last_name}` : 'Client non spécifié';
          
          // Trouver le véhicule associé
          let vehicleInfo = 'Véhicule non spécifié';
          if (order.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === order.vehicle_id);
            if (vehicle) {
              vehicleInfo = `${vehicle.brand || ''} ${vehicle.model || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
            }
          }
          
          documents.push({
            id: `order-${order.id}`,
            title: `Ordre de réparation`,
            client: clientName,
            description: `Client: ${clientName} | Véhicule: ${vehicleInfo}`,
            date: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            type: 'order',
            timestamp: createdDate.getTime()
          });
        });
      }

      // Rapports d'expertise
      if (expertiseReports) {
        expertiseReports.forEach(report => {
          const createdDate = new Date(report.created_at);
          const clientName = report.clients ? `${report.clients.first_name} ${report.clients.last_name}` : 'Client non spécifié';
          
          // Trouver le véhicule associé
          let vehicleInfo = 'Véhicule non spécifié';
          if (report.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === report.vehicle_id);
            if (vehicle) {
              vehicleInfo = `${vehicle.brand || ''} ${vehicle.model || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
            }
          }
          
          documents.push({
            id: `expertise-${report.id}`,
            title: `Rapport d'expertise`,
            client: clientName,
            description: `Client: ${clientName} | Véhicule: ${vehicleInfo}`,
            date: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            type: 'expertise',
            timestamp: createdDate.getTime()
          });
        });
      }

      // Avoirs
      if (credits) {
        credits.forEach(credit => {
          const createdDate = new Date(credit.created_at);
          const clientName = credit.clients ? `${credit.clients.first_name} ${credit.clients.last_name}` : 'Client non spécifié';
          
          // Trouver le véhicule associé
          let vehicleInfo = 'Véhicule non spécifié';
          if (credit.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === credit.vehicle_id);
            if (vehicle) {
              vehicleInfo = `${vehicle.brand || ''} ${vehicle.model || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
            }
          }
          
          documents.push({
            id: `credit-${credit.id}`,
            title: `Avoir`,
            client: clientName,
            description: `Client: ${clientName} | Véhicule: ${vehicleInfo}`,
            date: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            type: 'credit',
            timestamp: createdDate.getTime()
          });
        });
      }
      
      // Trier par date et prendre les 4 plus récents
      return documents
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 4);
    },
    enabled: !!invoices || !!quotes || !!repairOrders || !!expertiseReports || !!credits
  });

  // Activité récente complète avec tous les types d'activités
  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity', quotes, clients, vehicles, receipts, invoices, repairOrders, expertiseReports, credits, expenses],
    queryFn: () => {
      const activities = [];

      // Nouveaux clients créés
      if (clients) {
        clients.forEach(client => {
          const createdDate = new Date(client.created_at);
          activities.push({
            id: `client-${client.id}`,
            icon: 'User',
            iconBackground: 'bg-green-500',
            title: 'Nouveau client créé',
            description: `${client.first_name} ${client.last_name}`,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });
        });
      }

      // Paiements reçus
      if (receipts && invoices) {
        receipts.forEach(receipt => {
          const receiptDate = new Date(receipt.date);
          let description = `Encaissement de ${formatCurrency(receipt.amount)}`;
          
          // Trouver la facture associée
          if (receipt.invoice_id) {
            const invoice = invoices.find(inv => inv.id === receipt.invoice_id);
            if (invoice && invoice.reference) {
              const clientName = invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client';
              description = `Facture n°${invoice.reference} - ${clientName} (${formatCurrency(receipt.amount)})`;
            }
          }
          
          activities.push({
            id: `receipt-${receipt.id}`,
            icon: 'CreditCard',
            iconBackground: 'bg-amber-500',
            title: 'Paiement reçu',
            description,
            time: `${receiptDate.toLocaleDateString('fr-FR')} à ${receiptDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: receiptDate.getTime()
          });
        });
      }

      // Dépenses enregistrées
      if (expenses) {
        expenses.forEach(expense => {
          const expenseDate = new Date(expense.date);
          let description = `${expense.supplier || 'Dépense'} - ${formatCurrency(expense.total_amount)}`;
          
          if (expense.vehicle && vehicles) {
            const vehicle = vehicles.find(v => v.id === expense.vehicle_id);
            if (vehicle) {
              description += ` (${vehicle.brand} ${vehicle.model})`;
            }
          }
          
          activities.push({
            id: `expense-${expense.id}`,
            icon: 'Receipt',
            iconBackground: 'bg-red-500',
            title: 'Dépense enregistrée',
            description,
            time: `${expenseDate.toLocaleDateString('fr-FR')} à ${expenseDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: expenseDate.getTime()
          });
        });
      }

      // Rapports d'expertise importés
      if (expertiseReports) {
        expertiseReports.forEach(report => {
          const createdDate = new Date(report.created_at);
          let vehicleInfo = 'Véhicule non spécifié';
          
          if (report.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === report.vehicle_id);
            if (vehicle && vehicle.brand && vehicle.model) {
              vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
            }
          }
          
          let description = `Rapport d'expertise - ${vehicleInfo}`;
          if (report.clients) {
            description += ` - ${report.clients.first_name} ${report.clients.last_name}`;
          }
          
          activities.push({
            id: `expertise-${report.id}`,
            icon: 'ClipboardCheck',
            iconBackground: 'bg-blue-500',
            title: 'Rapport d\'expertise importé',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });
        });
      }

      // Devis créés
      if (quotes) {
        quotes.forEach(quote => {
          const createdDate = new Date(quote.created_at);
          let vehicleInfo = 'Véhicule non spécifié';
          
          if (quote.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === quote.vehicle_id);
            if (vehicle && vehicle.brand && vehicle.model) {
              vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
            }
          }
          
          let description = `Devis n°${quote.reference || 'N/A'} - ${vehicleInfo}`;
          if (quote.clients) {
            description += ` - ${quote.clients.first_name} ${quote.clients.last_name}`;
          }
          
          activities.push({
            id: `quote-${quote.id}`,
            icon: 'FileText',
            iconBackground: 'bg-blue-500',
            title: 'Devis créé',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });
        });
      }

      // Ordres de réparation créés
      if (repairOrders) {
        repairOrders.forEach(order => {
          const createdDate = new Date(order.created_at);
          let vehicleInfo = 'Véhicule non spécifié';
          
          if (order.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === order.vehicle_id);
            if (vehicle && vehicle.brand && vehicle.model) {
              vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
            }
          }
          
          let description = `Ordre n°${order.reference || 'N/A'} - ${vehicleInfo}`;
          if (order.clients) {
            description += ` - ${order.clients.first_name} ${order.clients.last_name}`;
          }
          
          activities.push({
            id: `order-${order.id}`,
            icon: 'Wrench',
            iconBackground: 'bg-orange-500',
            title: 'Ordre de réparation créé',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });
        });
      }

      // Factures créées
      if (invoices) {
        invoices.forEach(invoice => {
          const createdDate = new Date(invoice.created_at);
          let vehicleInfo = 'Véhicule non spécifié';
          
          if (invoice.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === invoice.vehicle_id);
            if (vehicle && vehicle.brand && vehicle.model) {
              vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
            }
          }
          
          let description = `Facture n°${invoice.reference || 'N/A'} - ${vehicleInfo}`;
          if (invoice.clients) {
            description += ` - ${invoice.clients.first_name} ${invoice.clients.last_name}`;
          }
          
          activities.push({
            id: `invoice-${invoice.id}`,
            icon: 'Receipt',
            iconBackground: 'bg-purple-500',
            title: 'Facture créée',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });
        });
      }

      // Avoirs créés
      if (credits) {
        credits.forEach(credit => {
          const createdDate = new Date(credit.created_at);
          let vehicleInfo = 'Véhicule non spécifié';
          
          if (credit.vehicle_id && vehicles) {
            const vehicle = vehicles.find(v => v.id === credit.vehicle_id);
            if (vehicle && vehicle.brand && vehicle.model) {
              vehicleInfo = `${vehicle.brand} ${vehicle.model}`;
            }
          }
          
          let description = `Avoir n°${credit.reference || 'N/A'} - ${vehicleInfo}`;
          if (credit.clients) {
            description += ` - ${credit.clients.first_name} ${credit.clients.last_name}`;
          }
          
          activities.push({
            id: `credit-${credit.id}`,
            icon: 'RotateCcw',
            iconBackground: 'bg-red-500',
            title: 'Avoir créé',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });
        });
      }

      // Véhicules créés
      if (vehicles) {
        vehicles.forEach(vehicle => {
          const createdDate = new Date(vehicle.created_at);
          let vehicleDescription = 'Véhicule';
          if (vehicle.brand && vehicle.model && vehicle.license_plate) {
            vehicleDescription = `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`;
          } else if (vehicle.license_plate) {
            vehicleDescription = `Véhicule ${vehicle.license_plate}`;
          }
          
          activities.push({
            id: `vehicle-${vehicle.id}`,
            icon: 'Car',
            iconBackground: 'bg-purple-500',
            title: 'Véhicule créé',
            description: vehicleDescription,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });
        });
      }

      // Trier par date (plus récent en premier) et prendre les 10 plus récents
      return activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 20);
    },
    enabled: !quotesLoading && !clientsLoading && !vehiclesLoading && !receiptsLoading && !invoicesLoading && !ordersLoading && !expertiseLoading && !creditsLoading && !expensesLoading
  });

  return {
    dashboardStats,
    recentVehicles,
    recentDocuments,
    recentActivity,
    isLoading: isLoading || vehiclesLoading || clientsLoading
  };
};
