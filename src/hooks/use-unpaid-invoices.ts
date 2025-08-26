import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  id: string;
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
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            phone,
            email,
            address,
            city,
            postal_code,
            auto_relances_disabled
          ),
          vehicles (
            id,
            license_plate,
            brand_id,
            model_id,
            car_brands (
              name
            ),
            car_models (
              name
            )
          )
        `)
        .eq('company_id', companyData.id)
        .lt('due_date', new Date().toISOString().split('T')[0])
        .in('status', ['En attente de paiement', 'Partiellement payé'])
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching unpaid invoices:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les factures impayées",
          variant: "destructive",
        });
        return;
      }

      setInvoices(data || []);
      formatInvoicesForDisplay(data || []);
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
        id: invoice.reference,
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
      const { error } = await supabase
        .from('clients')
        .update({ auto_relances_disabled: !currentValue })
        .eq('id', clientId);

      if (error) {
        console.error('Error toggling auto relances:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier les relances automatiques",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Succès",
        description: !currentValue ? "Relances automatiques désactivées" : "Relances automatiques activées",
      });

      // Refetch data to update the UI
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