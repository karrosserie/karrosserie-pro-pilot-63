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
      const result = await gocardlessService.createMandate(customerId, bankAccount);
      
      // Sauvegarder l'ID du mandat dans company_info
      if (!effectiveCompanyId) throw new Error('No company selected');
      
      const { error } = await supabase
        .from('company_info')
        .update({ 
          gocardless_mandate_id: result.mandate.id,
          gocardless_mandate_status: result.mandate.status,
          sepa_enabled: true
        })
        .eq('id', effectiveCompanyId);

      if (error) {
        console.error('Erreur sauvegarde mandat:', error);
        throw error;
      }

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

  // Query pour récupérer le statut du mandat
  const mandateId = (effectiveCompanyData as any)?.gocardless_mandate_id;
  const { data: mandateStatus, isLoading: mandateLoading } = useQuery({
    queryKey: ['mandate-status', mandateId],
    queryFn: () => 
      mandateId 
        ? gocardlessService.getMandateStatus(mandateId)
        : null,
    enabled: !!mandateId,
    refetchInterval: 30000, // Vérifier le statut toutes les 30 secondes
  });

  // Mutation pour annuler un mandat
  const cancelMandateMutation = useMutation({
    mutationFn: async (mandateId: string) => {
      const result = await gocardlessService.cancelMandate(mandateId);
      
      // Mettre à jour le statut dans company_info
      if (!effectiveCompanyId) throw new Error('No company selected');
      
      const { error } = await supabase
        .from('company_info')
        .update({ 
          gocardless_mandate_status: result.status,
          sepa_enabled: false
        })
        .eq('id', effectiveCompanyId);

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
    mandateStatus,
    mandateLoading,
    hasMandateConfigured: !!(effectiveCompanyData as any)?.gocardless_mandate_id,
    isMandateActive: mandateStatus?.status === 'active',
    isSepaEnabled: (effectiveCompanyData as any)?.sepa_enabled || false,
    
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