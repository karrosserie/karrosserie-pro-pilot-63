import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gocardlessService, GoCardlessCustomer, GoCardlessBankAccount } from '@/services/gocardless';
import { useCompany } from './use-company';
import { useImpersonation } from './use-impersonation';
import { toast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useGoCardless = () => {
  const { companyData } = useCompany();
  const { isImpersonating, impersonationData } = useImpersonation();
  const queryClient = useQueryClient();

  // Utiliser l'ID de l'entreprise approprié (impersonation ou normal)
  const effectiveCompanyId = isImpersonating ? impersonationData?.company_id : companyData?.id;
  const effectiveCompanyData = isImpersonating ? impersonationData : companyData;

  // Mutation pour créer un client GoCardless
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: GoCardlessCustomer) => {
      if (!effectiveCompanyId) throw new Error('No company selected');
      return gocardlessService.createCustomer(effectiveCompanyId, customerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-info'] });
      toast({
        title: "Client créé",
        description: "Le client GoCardless a été créé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation pour créer un mandat SEPA
  const createMandateMutation = useMutation({
    mutationFn: async ({ 
      customerId, 
      bankAccount 
    }: { 
      customerId: string; 
      bankAccount: GoCardlessBankAccount;
    }) => {
      if (!effectiveCompanyId) throw new Error('No company selected');
      
      const result = await gocardlessService.createMandate(effectiveCompanyId, customerId, bankAccount);
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-info'] });
      toast({
        title: "Mandat SEPA créé",
        description: "Le mandat de prélèvement SEPA a été configuré avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Query pour récupérer le mandat local
  const { data: localMandate, isLoading: mandateLoading } = useQuery({
    queryKey: ['local-mandate', effectiveCompanyId],
    queryFn: async () => {
      if (!effectiveCompanyId) return null;
      
      const { data } = await supabase
        .from('gocardless_mandates')
        .select('*')
        .eq('company_id', effectiveCompanyId)
        .maybeSingle();
      
      return data;
    },
    enabled: !!effectiveCompanyId,
    refetchInterval: 30000, // Vérifier le statut toutes les 30 secondes
  });

  // Query pour récupérer l'historique des paiements
  const { data: paymentHistory, isLoading: paymentsLoading } = useQuery({
    queryKey: ['gocardless-payments', effectiveCompanyId],
    queryFn: async () => {
      if (!effectiveCompanyId) return [];
      
      const { data } = await supabase
        .from('gocardless_payments')
        .select('*')
        .eq('company_id', effectiveCompanyId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      return data || [];
    },
    enabled: !!effectiveCompanyId,
  });

  // Mutation pour annuler un mandat
  const cancelMandateMutation = useMutation({
    mutationFn: async (mandateId: string) => {
      const result = await gocardlessService.cancelMandate(mandateId);
      
      // Mettre à jour le statut dans notre base de données
      if (!effectiveCompanyId) throw new Error('No company selected');
      
      const { error } = await supabase
        .from('gocardless_mandates')
        .update({ 
          status: result.status,
          cancelled_at: new Date().toISOString()
        })
        .eq('gocardless_mandate_id', mandateId);

      if (error) {
        console.error('Erreur mise à jour statut mandat:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-info'] });
      queryClient.invalidateQueries({ queryKey: ['mandate-status'] });
      toast({
        title: "Mandat annulé",
        description: "Le mandat SEPA a été annulé avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation pour créer un paiement d'abonnement
  const createSubscriptionPaymentMutation = useMutation({
    mutationFn: async ({ 
      subscriptionId, 
      amount, 
      planName 
    }: { 
      subscriptionId: string; 
      amount: number; 
      planName: string;
    }) => {
      if (!effectiveCompanyId) throw new Error('No company selected');
      return gocardlessService.createSubscriptionPayment(
        effectiveCompanyId,
        subscriptionId,
        amount,
        planName
      );
    },
    onSuccess: () => {
      toast({
        title: "Paiement initié",
        description: "Le prélèvement SEPA a été initié avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de paiement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper function to setup GoCardless for a company
  const setupGoCardlessForCompany = async (
    customerData: GoCardlessCustomer,
    bankAccount: GoCardlessBankAccount
  ) => {
    try {
      // Étape 1: Créer le client GoCardless
      const customer = await createCustomerMutation.mutateAsync(customerData);
      
      // Étape 2: Créer le mandat avec le compte bancaire
      const result = await createMandateMutation.mutateAsync({
        customerId: customer.id,
        bankAccount
      });
      
      return result;
    } catch (error) {
      console.error('Erreur configuration GoCardless:', error);
      throw error;
    }
  };

  return {
    // Company data
    companyData: effectiveCompanyData,
    effectiveCompanyId,
    
    // Mandate info
    mandateStatus: localMandate,
    mandateLoading,
    paymentHistory,
    paymentsLoading,
    hasMandateConfigured: !!localMandate,
    isMandateActive: localMandate?.status === 'active',
    isSepaEnabled: localMandate?.status === 'active',
    
    // Mutations
    createCustomer: createCustomerMutation.mutate,
    createMandate: createMandateMutation.mutate,
    cancelMandate: cancelMandateMutation.mutate,
    createSubscriptionPayment: createSubscriptionPaymentMutation.mutate,
    setupGoCardlessForCompany,
    
    // Mutation states
    isCreatingCustomer: createCustomerMutation.isPending,
    isCreatingMandate: createMandateMutation.isPending,
    isCancellingMandate: cancelMandateMutation.isPending,
    isCreatingPayment: createSubscriptionPaymentMutation.isPending,
  };
};