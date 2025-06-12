
import { useQuery } from '@tanstack/react-query';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useRepairOrders } from '@/hooks/use-repair-orders';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useCredits } from '@/hooks/use-credits';
import { useVehicles } from '@/hooks/use-vehicles';

export const useRecentDocuments = () => {
  const { invoices } = useInvoices();
  const { quotes } = useQuotes();
  const { orders: repairOrders } = useRepairOrders();
  const { reports: expertiseReports } = useExpertiseReports();
  const { credits } = useCredits();
  const { vehicles } = useVehicles();

  const { data: recentDocuments } = useQuery({
    queryKey: ['recent-documents', invoices, quotes, repairOrders, expertiseReports, credits, vehicles],
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
              vehicleInfo = `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
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
              vehicleInfo = `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
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
              vehicleInfo = `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
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
              vehicleInfo = `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
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
              vehicleInfo = `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''} - ${vehicle.license_plate || ''}`.replace(/^\s*-\s*/, '').replace(/\s*-\s*$/, '');
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

  return { recentDocuments };
};
