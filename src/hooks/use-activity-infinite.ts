import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useVehicles } from '@/hooks/use-vehicles';
import { useClients } from '@/hooks/use-clients';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useCredits } from '@/hooks/use-credits';
import { useReceiptsData } from '@/hooks/use-receipts-data';
import { useExpenses } from '@/hooks/use-expenses';
import { formatCurrency } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

export const useActivityInfinite = () => {
  const [page, setPage] = useState(1);
  const { vehicles } = useVehicles();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { quotes } = useQuotes();
  const { orders: repairOrders } = useRepairOrders();
  const { reports: expertiseReports } = useExpertiseReports();
  const { credits } = useCredits();
  const { receipts } = useReceiptsData();
  const { expenses } = useExpenses();

  const { data: allActivities } = useQuery({
    queryKey: ['all-activities', quotes, clients, vehicles, receipts, invoices, repairOrders, expertiseReports, credits, expenses],
    queryFn: () => {
      const activities = [];

      // Helper function to check if an item was updated (not just created)
      const isUpdated = (createdAt: string, updatedAt?: string) => {
        if (!updatedAt) return false;
        const created = new Date(createdAt).getTime();
        const updated = new Date(updatedAt).getTime();
        return updated > created + 1000; // 1 second tolerance
      };

      // Clients créés et mis à jour
      if (clients) {
        clients.forEach(client => {
          const createdDate = new Date(client.created_at);
          const updatedDate = client.updated_at ? new Date(client.updated_at) : null;
          
          // Client créé
          activities.push({
            id: `client-created-${client.id}`,
            icon: 'User',
            iconBackground: 'bg-green-500',
            title: 'Nouveau client créé',
            description: `${client.first_name} ${client.last_name}`,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });

          // Client mis à jour (si différent de la création)
          if (updatedDate && isUpdated(client.created_at, client.updated_at)) {
            activities.push({
              id: `client-updated-${client.id}`,
              icon: 'User',
              iconBackground: 'bg-blue-500',
              title: 'Client mis à jour',
              description: `${client.first_name} ${client.last_name}`,
              time: `${updatedDate.toLocaleDateString('fr-FR')} à ${updatedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
              timestamp: updatedDate.getTime()
            });
          }
        });
      }

      // Copy all the activity generation logic from use-recent-activity.ts
      // This includes: receipts, expenses, expertise reports, quotes, repair orders, invoices, credits, vehicles

      // Paiements reçus et mis à jour
      if (receipts && invoices) {
        receipts.forEach(receipt => {
          const receiptDate = new Date(receipt.date);
          const updatedDate = receipt.updated_at ? new Date(receipt.updated_at) : null;
          let description = `Encaissement de ${formatCurrency(receipt.amount)}`;
          
          // Trouver la facture associée
          if (receipt.invoice_id) {
            const invoice = invoices.find(inv => inv.id === receipt.invoice_id);
            if (invoice && invoice.reference) {
              const clientName = invoice.clients ? `${invoice.clients.first_name} ${invoice.clients.last_name}` : 'Client';
              description = `Facture n°${invoice.reference} - ${clientName} (${formatCurrency(receipt.amount)})`;
            }
          }
          
          // Paiement reçu
          activities.push({
            id: `receipt-created-${receipt.id}`,
            icon: 'CreditCard',
            iconBackground: 'bg-amber-500',
            title: 'Paiement reçu',
            description,
            time: `${receiptDate.toLocaleDateString('fr-FR')} à ${receiptDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: receiptDate.getTime()
          });

          // Paiement mis à jour
          if (updatedDate && isUpdated(receipt.created_at, receipt.updated_at)) {
            activities.push({
              id: `receipt-updated-${receipt.id}`,
              icon: 'CreditCard',
              iconBackground: 'bg-orange-500',
              title: 'Paiement mis à jour',
              description,
              time: `${updatedDate.toLocaleDateString('fr-FR')} à ${updatedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
              timestamp: updatedDate.getTime()
            });
          }
        });
      }

      // Dépenses enregistrées et mises à jour
      if (expenses) {
        expenses.forEach(expense => {
          const expenseDate = new Date(expense.date);
          const updatedDate = expense.updated_at ? new Date(expense.updated_at) : null;
          let description = `${expense.supplier || 'Dépense'} - ${formatCurrency(expense.total_amount)}`;
          
          if (expense.vehicle && vehicles) {
            const vehicle = vehicles.find(v => v.id === expense.vehicle_id);
            if (vehicle) {
              description += ` (${vehicle.brand} ${vehicle.model})`;
            }
          }
          
          // Dépense enregistrée
          activities.push({
            id: `expense-created-${expense.id}`,
            icon: 'Receipt',
            iconBackground: 'bg-red-500',
            title: 'Dépense enregistrée',
            description,
            time: `${expenseDate.toLocaleDateString('fr-FR')} à ${expenseDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: expenseDate.getTime()
          });

          // Dépense mise à jour
          if (updatedDate && isUpdated(expense.created_at, expense.updated_at)) {
            activities.push({
              id: `expense-updated-${expense.id}`,
              icon: 'Receipt',
              iconBackground: 'bg-pink-500',
              title: 'Dépense mise à jour',
              description,
              time: `${updatedDate.toLocaleDateString('fr-FR')} à ${updatedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
              timestamp: updatedDate.getTime()
            });
          }
        });
      }

      // Rapports d'expertise importés et mis à jour
      if (expertiseReports) {
        expertiseReports.forEach(report => {
          const createdDate = new Date(report.created_at);
          const updatedDate = report.updated_at ? new Date(report.updated_at) : null;
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
          
          // Rapport d'expertise importé
          activities.push({
            id: `expertise-created-${report.id}`,
            icon: 'ClipboardCheck',
            iconBackground: 'bg-blue-500',
            title: 'Rapport d\'expertise importé',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });

          // Rapport d'expertise mis à jour
          if (updatedDate && isUpdated(report.created_at, report.updated_at)) {
            activities.push({
              id: `expertise-updated-${report.id}`,
              icon: 'ClipboardCheck',
              iconBackground: 'bg-indigo-500',
              title: 'Rapport d\'expertise mis à jour',
              description,
              time: `${updatedDate.toLocaleDateString('fr-FR')} à ${updatedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
              timestamp: updatedDate.getTime()
            });
          }
        });
      }

      // Devis créés et mis à jour
      if (quotes) {
        quotes.forEach(quote => {
          const createdDate = new Date(quote.created_at);
          const updatedDate = quote.updated_at ? new Date(quote.updated_at) : null;
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
          
          // Devis créé
          activities.push({
            id: `quote-created-${quote.id}`,
            icon: 'FileText',
            iconBackground: 'bg-blue-500',
            title: 'Devis créé',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });

          // Devis mis à jour
          if (updatedDate && isUpdated(quote.created_at, quote.updated_at)) {
            activities.push({
              id: `quote-updated-${quote.id}`,
              icon: 'FileText',
              iconBackground: 'bg-sky-500',
              title: 'Devis mis à jour',
              description,
              time: `${updatedDate.toLocaleDateString('fr-FR')} à ${updatedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
              timestamp: updatedDate.getTime()
            });
          }
        });
      }

      // Ordres de réparation créés et mis à jour
      if (repairOrders) {
        repairOrders.forEach(order => {
          const createdDate = new Date(order.created_at);
          const updatedDate = order.updated_at ? new Date(order.updated_at) : null;
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
          
          // Ordre de réparation créé
          activities.push({
            id: `order-created-${order.id}`,
            icon: 'Wrench',
            iconBackground: 'bg-orange-500',
            title: 'Ordre de réparation créé',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });

          // Ordre de réparation mis à jour
          if (updatedDate && isUpdated(order.created_at, order.updated_at)) {
            activities.push({
              id: `order-updated-${order.id}`,
              icon: 'Wrench',
              iconBackground: 'bg-yellow-500',
              title: 'Ordre de réparation mis à jour',
              description,
              time: `${updatedDate.toLocaleDateString('fr-FR')} à ${updatedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
              timestamp: updatedDate.getTime()
            });
          }
        });
      }

      // Factures créées et mises à jour
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
          
          // Facture créée
          activities.push({
            id: `invoice-created-${invoice.id}`,
            icon: 'Receipt',
            iconBackground: 'bg-purple-500',
            title: 'Facture créée',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });
        });
      }

      // Avoirs créés et mis à jour
      if (credits) {
        credits.forEach(credit => {
          const createdDate = new Date(credit.created_at);
          const updatedDate = credit.updated_at ? new Date(credit.updated_at) : null;
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
          
          // Avoir créé
          activities.push({
            id: `credit-created-${credit.id}`,
            icon: 'RotateCcw',
            iconBackground: 'bg-red-500',
            title: 'Avoir créé',
            description,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });

          // Avoir mis à jour
          if (updatedDate && isUpdated(credit.created_at, credit.updated_at)) {
            activities.push({
              id: `credit-updated-${credit.id}`,
              icon: 'RotateCcw',
              iconBackground: 'bg-rose-500',
              title: 'Avoir mis à jour',
              description,
              time: `${updatedDate.toLocaleDateString('fr-FR')} à ${updatedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
              timestamp: updatedDate.getTime()
            });
          }
        });
      }

      // Véhicules créés et mis à jour
      if (vehicles) {
        vehicles.forEach(vehicle => {
          const createdDate = new Date(vehicle.created_at);
          const updatedDate = vehicle.updated_at ? new Date(vehicle.updated_at) : null;
          let vehicleDescription = 'Véhicule';
          if (vehicle.brand && vehicle.model && vehicle.license_plate) {
            vehicleDescription = `${vehicle.brand} ${vehicle.model} - ${vehicle.license_plate}`;
          } else if (vehicle.license_plate) {
            vehicleDescription = `Véhicule ${vehicle.license_plate}`;
          }
          
          // Véhicule créé
          activities.push({
            id: `vehicle-created-${vehicle.id}`,
            icon: 'Car',
            iconBackground: 'bg-purple-500',
            title: 'Véhicule créé',
            description: vehicleDescription,
            time: `${createdDate.toLocaleDateString('fr-FR')} à ${createdDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: createdDate.getTime()
          });

          // Véhicule mis à jour
          if (updatedDate && isUpdated(vehicle.created_at, vehicle.updated_at)) {
            activities.push({
              id: `vehicle-updated-${vehicle.id}`,
              icon: 'Car',
              iconBackground: 'bg-slate-500',
              title: 'Véhicule mis à jour',
              description: vehicleDescription,
              time: `${updatedDate.toLocaleDateString('fr-FR')} à ${updatedDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
              timestamp: updatedDate.getTime()
            });
          }
        });
      }

      // Trier par date (plus récent en premier)
      return activities.sort((a, b) => b.timestamp - a.timestamp);
    },
    enabled: !!quotes && !!clients && !!vehicles && !!receipts && !!invoices && !!repairOrders && !!expertiseReports && !!credits && !!expenses
  });

  const totalActivities = allActivities || [];
  const totalPages = Math.ceil(totalActivities.length / ITEMS_PER_PAGE);
  const displayedActivities = totalActivities.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = page < totalPages;

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return {
    activities: displayedActivities,
    hasMore,
    loadMore,
    isLoading: false
  };
};
