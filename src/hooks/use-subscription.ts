import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/supabase/subscriptions';
import { demoService, DEMO_MODE } from '@/services/demoService';
import { useCompany } from './use-company';
import { toast } from '@/hooks/use-toast';
import { TOKEN_COSTS, TokenOperation, getTokenCost } from '@/config/token-costs';

export const useSubscription = () => {
  const { companyData } = useCompany();
  const queryClient = useQueryClient();

  // Get subscription plans
  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      if (DEMO_MODE) {
        return [
          {
            id: 'plan-annual',
            name: 'Karrosserie Pro - Annuel',
            price: 299.99,
            currency: 'EUR',
            interval: 'year',
            tokens_included: 120000,
            features: ['Gestion illimitée', 'Assistant IA', 'Support prioritaire']
          }
        ];
      }
      return subscriptionService.getSubscriptionPlans();
    },
  });

  // Get token packages
  const { data: tokenPackages, isLoading: packagesLoading } = useQuery({
    queryKey: ['token-packages'],
    queryFn: async () => {
      if (DEMO_MODE) {
        return [
          { id: 'tokens-10k', name: '10 000 jetons', tokens: 10000, price: 19.99 },
          { id: 'tokens-25k', name: '25 000 jetons', tokens: 25000, price: 44.99 },
          { id: 'tokens-50k', name: '50 000 jetons', tokens: 50000, price: 79.99 }
        ];
      }
      return subscriptionService.getTokenPackages();
    },
  });

  // Get company subscription
  const { data: companySubscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ['company-subscription', companyData?.id],
    queryFn: async () => {
      if (DEMO_MODE) {
        const { data } = await demoService.subscription.getSubscription();
        return data;
      }
      return companyData?.id ? subscriptionService.getCompanySubscription(companyData.id) : null;
    },
    enabled: DEMO_MODE || !!companyData?.id,
  });

  // Get token usage history
  const { data: tokenUsage, isLoading: usageLoading } = useQuery({
    queryKey: ['token-usage', companyData?.id],
    queryFn: async () => {
      if (DEMO_MODE) {
        const { data } = await demoService.subscription.getUsageStats();
        return data?.tokens_per_day_last_30 || [];
      }
      return companyData?.id ? subscriptionService.getTokenUsage(companyData.id) : [];
    },
    enabled: DEMO_MODE || !!companyData?.id,
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
      operation, 
      description 
    }: { 
      operation: TokenOperation; 
      description?: string; 
    }) => {
      if (!companyData?.id || !companySubscription?.id) {
        throw new Error('No company or active subscription');
      }
      
      const tokenCost = getTokenCost(operation);
      
      return subscriptionService.consumeTokens(
        companyData.id,
        companySubscription.id,
        tokenCost,
        operation,
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

  // Helper function to check if user can perform operation
  const canPerformOperation = (operation: TokenOperation): boolean => {
    if (!companySubscription || companySubscription.status !== 'active') return false;
    
    const tokenCost = getTokenCost(operation);
    if (tokenCost === 0) return true; // Free operations are always allowed
    
    return (companySubscription.tokens_remaining || 0) >= tokenCost;
  };

  // Helper function to get remaining tokens after operation
  const getRemainingTokensAfterOperation = (operation: TokenOperation): number => {
    const tokenCost = getTokenCost(operation);
    return Math.max(0, (companySubscription?.tokens_remaining || 0) - tokenCost);
  };

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
    
    // Token operation helpers
    canPerformOperation,
    getRemainingTokensAfterOperation,
    TOKEN_COSTS,
  };
};