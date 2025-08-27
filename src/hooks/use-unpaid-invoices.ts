import { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/use-company';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface UnpaidInvoice {
  id: string;
  reference: string;
  client_id: string;
  vehicle_id: string;
  amount: number;
  due_date: string;
  status: string;
  created_at: string;
  // Relations
  clients?: {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    auto_relances_disabled?: boolean;
  } | null;
  vehicles?: {
    id: string;
    license_plate: string;
    brand_id?: string;
    model_id?: string;
    car_brands?: {
      name: string;
    } | null;
    car_models?: {
      name: string;
    } | null;
  } | null;
}

interface FormattedUnpaidInvoice {
  id: string; // Référence de la facture pour l'affichage
  uuid: string; // UUID de la facture pour les requêtes
  client: string;
  vehicle: string;
  vehicleRef: string;
  garage: string;
  garageRef: string;
  amount: string;
  dueDate: string;
  lastRelanceDate: string;
  relanceType: string;
  relanceTypeColor: string;
  status: string;
  availableActions: string[];
  history: any[];
  clientPhone?: string;
  clientEmail?: string;
  clientAddress?: string;
  daysOverdue: number;
  autoRelancesDisabled?: boolean;
  clientId?: string;
}

export const useUnpaidInvoices = () => {
  const { companyData } = useCompany();
  const [invoices, setInvoices] = useState<UnpaidInvoice[]>([]);
  const [formattedInvoices, setFormattedInvoices] = useState<FormattedUnpaidInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUnpaidInvoices = async () => {
    if (!companyData?.id) return;

    try {
      // Données fictives pour les factures impayées
      const mockInvoices: UnpaidInvoice[] = [
        {
          id: 'inv-1',
          reference: '2024-001',
          client_id: 'client-1',
          vehicle_id: 'vehicle-1',
          amount: 1250.50,
          due_date: '2024-01-15',
          status: 'En attente de paiement',
          created_at: '2024-01-01T10:00:00Z',
          clients: {
            id: 'client-1',
            first_name: 'Jean',
            last_name: 'Dupont',
            phone: '06.12.34.56.78',
            email: 'jean.dupont@email.com',
            address: '123 Rue de la République',
            city: 'Lyon',
            postal_code: '69002',
            auto_relances_disabled: false
          },
          vehicles: {
            id: 'vehicle-1',
            license_plate: 'AB-123-CD',
            brand_id: 'brand-1',
            model_id: 'model-1',
            car_brands: { name: 'Peugeot' },
            car_models: { name: '308' }
          }
        },
        {
          id: 'inv-2',
          reference: '2024-002',
          client_id: 'client-2',
          vehicle_id: 'vehicle-2',
          amount: 890.75,
          due_date: '2024-01-08',
          status: 'Partiellement payé',
          created_at: '2023-12-28T14:30:00Z',
          clients: {
            id: 'client-2',
            first_name: 'Marie',
            last_name: 'Martin',
            phone: '06.98.76.54.32',
            email: 'marie.martin@email.com',
            address: '45 Avenue des Fleurs',
            city: 'Marseille',
            postal_code: '13001',
            auto_relances_disabled: false
          },
          vehicles: {
            id: 'vehicle-2',
            license_plate: 'EF-456-GH',
            brand_id: 'brand-2',
            model_id: 'model-2',
            car_brands: { name: 'Renault' },
            car_models: { name: 'Clio' }
          }
        },
        {
          id: 'inv-3',
          reference: '2024-003',
          client_id: 'client-3',
          vehicle_id: 'vehicle-3',
          amount: 2150.00,
          due_date: '2023-12-20',
          status: 'En attente de paiement',
          created_at: '2023-12-05T09:15:00Z',
          clients: {
            id: 'client-3',
            first_name: 'Pierre',
            last_name: 'Durand',
            phone: '06.11.22.33.44',
            email: 'pierre.durand@email.com',
            address: '78 Boulevard de la Liberté',
            city: 'Toulouse',
            postal_code: '31000',
            auto_relances_disabled: true
          },
          vehicles: {
            id: 'vehicle-3',
            license_plate: 'IJ-789-KL',
            brand_id: 'brand-3',
            model_id: 'model-3',
            car_brands: { name: 'Volkswagen' },
            car_models: { name: 'Golf' }
          }
        }
      ];

      setInvoices(mockInvoices);
      formatInvoicesForDisplay(mockInvoices);
    } catch (error) {
      console.error('Error in fetchUnpaidInvoices:', error);
    }
  };

  const formatInvoicesForDisplay = (invoices: UnpaidInvoice[]) => {
    const formatted = invoices.map((invoice) => {
      const daysOverdue = Math.floor(
        (new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24)
      );

      // Déterminer le type de relance basé sur les jours de retard
      let relanceType = 'Relance 1';
      let relanceTypeColor = 'bg-blue-100 text-blue-800';
      let status = 'relance1';

      if (daysOverdue > 60) {
        relanceType = 'Contentieux';
        relanceTypeColor = 'bg-red-100 text-red-800';
        status = 'contentieux';
      } else if (daysOverdue > 45) {
        relanceType = 'Relance 4';
        relanceTypeColor = 'bg-red-100 text-red-800';
        status = 'relance4';
      } else if (daysOverdue > 30) {
        relanceType = 'Relance 3';
        relanceTypeColor = 'bg-orange-100 text-orange-800';
        status = 'relance3';
      } else if (daysOverdue > 15) {
        relanceType = 'Relance 2';
        relanceTypeColor = 'bg-orange-100 text-orange-800';
        status = 'relance2';
      }

      const clientName = invoice.clients 
        ? `${invoice.clients.first_name} ${invoice.clients.last_name}`
        : 'Client inconnu';

      const vehicleName = invoice.vehicles && invoice.vehicles.car_brands && invoice.vehicles.car_models
        ? `${invoice.vehicles.car_brands.name} ${invoice.vehicles.car_models.name}`
        : 'Véhicule inconnu';

      const clientAddress = invoice.clients?.address && invoice.clients?.city && invoice.clients?.postal_code
        ? `${invoice.clients.address}\n${invoice.clients.postal_code} ${invoice.clients.city}\nFrance`
        : '';

      return {
        id: invoice.reference, // Référence pour l'affichage
        uuid: invoice.id, // UUID pour les requêtes base de données
        client: clientName,
        vehicle: vehicleName,
        vehicleRef: invoice.vehicles?.license_plate || 'N/A',
        garage: companyData.name || 'Garage',
        garageRef: companyData.siret || 'N/A',
        amount: `${invoice.amount.toFixed(2).replace('.', ',')} €`,
        dueDate: format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: fr }),
        lastRelanceDate: format(new Date(), 'dd/MM/yyyy', { locale: fr }),
        relanceType,
        relanceTypeColor,
        status,
        availableActions: ['whatsapp', 'sms', 'vms', 'mail', 'recommande'],
        history: [], // TODO: Implémenter l'historique des relances depuis client_relances
        clientPhone: invoice.clients?.phone,
        clientEmail: invoice.clients?.email,
        clientAddress,
        daysOverdue,
        autoRelancesDisabled: invoice.clients?.auto_relances_disabled || false,
        clientId: invoice.client_id
      };
    });

    setFormattedInvoices(formatted);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUnpaidInvoices();
      setLoading(false);
    };

    loadData();
  }, [companyData?.id]);

  const toggleAutoRelances = async (clientId: string, currentValue: boolean) => {
    try {
      // Simuler la modification des relances automatiques
      setInvoices(prev => prev.map(invoice => {
        if (invoice.client_id === clientId && invoice.clients) {
          return {
            ...invoice,
            clients: {
              ...invoice.clients,
              auto_relances_disabled: !currentValue
            }
          };
        }
        return invoice;
      }));

      toast({
        title: "Succès",
        description: !currentValue ? "Relances automatiques désactivées" : "Relances automatiques activées",
      });

      // Refetch data to update the formatted invoices
      await fetchUnpaidInvoices();
    } catch (error) {
      console.error('Error in toggleAutoRelances:', error);
    }
  };

  return {
    invoices,
    formattedInvoices,
    loading,
    refetch: fetchUnpaidInvoices,
    toggleAutoRelances
  };
};