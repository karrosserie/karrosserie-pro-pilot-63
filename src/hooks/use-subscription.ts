import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/supabase/subscriptions';
import { useCompany } from './use-company';
import { toast } from '@/hooks/use-toast';

export const useSubscription = () => {
  const { companyData } = useCompany();
  const queryClient = useQueryClient();

  // Get subscription plans
  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getSubscriptionPlans(),
  });

  // Get token packages
  const { data: tokenPackages, isLoading: packagesLoading } = useQuery({
    queryKey: ['token-packages'],
    queryFn: () => subscriptionService.getTokenPackages(),
  });

  // Get company subscription
  const { data: companySubscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['company-subscription', companyData?.id],
    queryFn: () => companyData?.id ? subscriptionService.getCompanySubscription(companyData.id) : null,
    enabled: !!companyData?.id,
  });

  // Get token usage history
  const { data: tokenUsage, isLoading: usageLoading } = useQuery({
    queryKey: ['token-usage', companyData?.id],
    queryFn: () => companyData?.id ? subscriptionService.getTokenUsage(companyData.id) : [],
    enabled: !!companyData?.id,
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: ({ planId, tokensIncluded }: { planId: string; tokensIncluded: number }) => {
      if (!companyData?.id) throw new Error('No company selected');
      return subscriptionService.createSubscription(companyData.id, planId, tokensIncluded);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-subscription'] });
      toast({
        title: "Abonnement activé",
        description: "Votre abonnement a été activé avec succès.",
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

  // Add tokens mutation
  const addTokensMutation = useMutation({
    mutationFn: ({ tokenCount }: { tokenCount: number }) => {
      if (!companySubscription?.id) throw new Error('No active subscription');
      return subscriptionService.addTokens(companySubscription.id, tokenCount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-subscription'] });
      toast({
        title: "Jetons ajoutés",
        description: "Vos jetons ont été ajoutés avec succès.",
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

  // Consume tokens mutation
  const consumeTokensMutation = useMutation({
    mutationFn: ({ 
      tokenCount, 
      operationType, 
      description 
    }: { 
      tokenCount: number; 
      operationType: string; 
      description?: string; 
    }) => {
      if (!companyData?.id || !companySubscription?.id) {
        throw new Error('No company or active subscription');
      }
      return subscriptionService.consumeTokens(
        companyData.id,
        companySubscription.id,
        tokenCount,
        operationType,
        description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['token-usage'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    subscriptionPlans,
    tokenPackages,
    companySubscription,
    tokenUsage,
    
    // Loading states
    plansLoading,
    packagesLoading,
    subscriptionLoading,
    usageLoading,
    isLoading: plansLoading || packagesLoading || subscriptionLoading,
    
    // Mutations
    createSubscription: createSubscriptionMutation.mutate,
    addTokens: addTokensMutation.mutate,
    consumeTokens: consumeTokensMutation.mutate,
    
    // Mutation states
    isCreatingSubscription: createSubscriptionMutation.isPending,
    isAddingTokens: addTokensMutation.isPending,
    isConsumingTokens: consumeTokensMutation.isPending,
    
    // Helper functions
    hasActiveSubscription: !!companySubscription && companySubscription.status === 'active',
    tokensRemaining: companySubscription?.tokens_remaining || 0,
    tokensUsed: companySubscription?.tokens_used || 0,
    
    // Trial and access control
    isTrialExpired: companySubscription?.end_date ? new Date(companySubscription.end_date) < new Date() : false,
    isTrialSubscription: companySubscription && (companySubscription as any).subscription_plans?.price === 0,
    trialEndDate: companySubscription?.end_date ? new Date(companySubscription.end_date) : null,
    hasFullAccess: (() => {
      if (!companySubscription || companySubscription.status !== 'active') return false;
      
      // Si c'est un plan d'essai et qu'il est expiré
      if ((companySubscription as any).subscription_plans?.price === 0) {
        return companySubscription.end_date ? new Date(companySubscription.end_date) >= new Date() : false;
      }
      
      // Si c'est un plan payant actif
      return true;
    })(),
  };
};