
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useCompanyId } from '@/hooks/use-company-id';
import { supabase } from '@/integrations/supabase/client';

export interface InvoiceWithJoins {
  id: string;
  client_id: string | null;
  vehicle_id: string | null;
  repair_order_id: string | null;
  reference: string;
  amount: number;
  tax_rate: number | null;
  status: string | null;
  date: string | null;
  notes: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  claim_number: string | null;
  repairs_data: any[];
  parts_data: any[];
  discounts_data: any[];
  payment_details: string | null;
  report_number: string | null;
  policy_number: string | null;
  report_date: string | null;
  expert_name: string | null;
  incident_date: string | null;
  company_id: string | null;
  clients: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postal_code: string | null;
  } | null;
  vehicles: {
    id: string;
    license_plate: string | null;
    mileage: number | null;
    car_brands: {
      id: string;
      name: string;
    } | null;
    car_models: {
      id: string;
      name: string;
    } | null;
  } | null;
  repair_orders: {
    id: string;
    reference: string;
  } | null;
}

export function useInvoices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { companyId } = useCompanyId();

  const {
    data: invoices,
    isLoading,
    error
  } = useQuery({
    queryKey: ['invoices', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            postal_code
          ),
          vehicles (
            id,
            license_plate,
            mileage,
            car_brands (
              id,
              name
            ),
            car_models (
              id,  
              name
            )
          ),
          repair_orders (
            id,
            reference
          )
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invoices:', error);
        throw new Error(error.message);
      }

      console.log('=== JOINS RÉUSSIS, TRANSFORMATION EN COURS ===');
      console.log('invoicesWithJoins:', data);

      // Transform repairs_data and parts_data from string to JSON if needed
      const transformedInvoices = data?.map(invoice => {
        let transformedInvoice = { ...invoice };
        
        try {
          if (typeof invoice.repairs_data === 'string') {
            transformedInvoice.repairs_data = JSON.parse(invoice.repairs_data);
          }
        } catch (error) {
          console.error('Error parsing repairs_data:', error);
          transformedInvoice.repairs_data = [];
        }
        
        try {
          if (typeof invoice.parts_data === 'string') {
            transformedInvoice.parts_data = JSON.parse(invoice.parts_data);
          }
        } catch (error) {
          console.error('Error parsing parts_data:', error);
          transformedInvoice.parts_data = [];
        }
        
        try {
          if (typeof invoice.discounts_data === 'string') {
            transformedInvoice.discounts_data = JSON.parse(invoice.discounts_data);
          }
        } catch (error) {
          console.error('Error parsing discounts_data:', error);
          transformedInvoice.discounts_data = [];
        }
        
        return transformedInvoice;
      }) || [];

      console.log('=== FACTURES TRANSFORMÉES AVANT RETOUR ===');
      console.log('transformedInvoices:', transformedInvoices);
      
      if (transformedInvoices.length > 0) {
        console.log('Premier invoice transformé:', transformedInvoices[0]);
        console.log('Premier invoice.clients transformé:', transformedInvoices[0].clients);
      }

      return transformedInvoices as InvoiceWithJoins[];
    },
    enabled: !!companyId
  });

  const createInvoice = useMutation({
    mutationFn: async (invoiceData: any) => {
      if (!companyId) throw new Error('Company ID is required');
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoiceData, company_id: companyId }])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Facture créée",
        description: "La facture a été créée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { data: updatedData, error } = await supabase
        .from('invoices')
        .update(data)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return updatedData;
    },
    onSuccess: (updatedInvoice, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      toast({
        title: "Facture mise à jour",
        description: "La facture a été mise à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Facture supprimée",
        description: "La facture a été supprimée avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la facture: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    invoices,
    isLoading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
}
