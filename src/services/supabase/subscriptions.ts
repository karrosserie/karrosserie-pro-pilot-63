import { STATIC_SUBSCRIPTIONS, STATIC_TOKENS, mockApiDelay } from '@/data/staticData';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type SubscriptionPlan = Tables<'subscription_plans'>;
export type TokenPackage = Tables<'token_packages'>;
export type CompanySubscription = Tables<'company_subscriptions'>;
export type TokenUsage = Tables<'token_usage'>;

// Variables pour stocker les données modifiées
let subscriptionsData = [...STATIC_SUBSCRIPTIONS];
let tokensData = [...STATIC_TOKENS];

// Mock subscription plans
const mockSubscriptionPlans = [
  {
    id: 'plan-starter',
    name: 'Starter',
    price: 29,
    tokens_included: 500,
    features: ['Gestion de base', 'Support email'],
    is_active: true
  },
  {
    id: 'plan-premium',
    name: 'Premium', 
    price: 79,
    tokens_included: 1500,
    features: ['Toutes les fonctionnalités', 'Support prioritaire', 'IA avancée'],
    is_active: true
  }
];

const mockTokenPackages = [
  {
    id: 'tokens-100',
    name: '100 jetons',
    price: 9,
    token_count: 100,
    is_active: true
  },
  {
    id: 'tokens-500',
    name: '500 jetons',
    price: 39,
    token_count: 500,
    is_active: true
  },
  {
    id: 'tokens-1000',
    name: '1000 jetons',
    price: 69,
    token_count: 1000,
    is_active: true
  }
];

export const subscriptionService = {
  // Get all available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    console.log('Getting subscription plans...');
    await mockApiDelay(200);
    return mockSubscriptionPlans as any;
  },

  // Get all available token packages
  async getTokenPackages(): Promise<TokenPackage[]> {
    console.log('Getting token packages...');
    await mockApiDelay(200);
    return mockTokenPackages as any;
  },

  // Get company's current subscription
  async getCompanySubscription(companyId: string): Promise<CompanySubscription | null> {
    console.log('Getting subscription for company:', companyId);
    await mockApiDelay(200);
    
    const subscription = subscriptionsData.find(s => s.company_id === companyId);
    
    if (!subscription) {
      console.log('No active subscription found');
      return null;
    }
    
    // Enrich with plan details
    const plan = mockSubscriptionPlans.find(p => p.id === 'plan-premium');
    
    const enrichedSubscription = {
      ...subscription,
      subscription_plans: plan
    };
    
    console.log('Subscription found:', enrichedSubscription);
    return enrichedSubscription as any;
  },

  // Get company's token usage history
  async getTokenUsage(companyId: string, limit: number = 50): Promise<TokenUsage[]> {
    const { data, error } = await supabase
      .from('token_usage')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Create a subscription for a company (manual for now)
  async createSubscription(
    companyId: string,
    subscriptionPlanId: string,
    tokensIncluded: number
  ): Promise<CompanySubscription> {
    const { data, error } = await supabase
      .from('company_subscriptions')
      .insert({
        company_id: companyId,
        subscription_plan_id: subscriptionPlanId,
        status: 'active',
        tokens_remaining: tokensIncluded,
        tokens_used: 0,
        start_date: new Date().toISOString(),
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Add tokens to a company's subscription
  async addTokens(subscriptionId: string, tokenCount: number): Promise<void> {
    const { data: currentSub, error: fetchError } = await supabase
      .from('company_subscriptions')
      .select('tokens_remaining')
      .eq('id', subscriptionId)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('company_subscriptions')
      .update({
        tokens_remaining: (currentSub.tokens_remaining || 0) + tokenCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);
    
    if (error) throw error;
  },

  // Consume tokens (when performing operations)
  async consumeTokens(
    companyId: string,
    subscriptionId: string,
    tokenCount: number,
    operationType: string,
    description?: string
  ): Promise<void> {
    // Get current subscription data
    const { data: currentSub, error: fetchError } = await supabase
      .from('company_subscriptions')
      .select('tokens_remaining, tokens_used')
      .eq('id', subscriptionId)
      .single();

    if (fetchError) throw fetchError;
    
    if ((currentSub.tokens_remaining || 0) < tokenCount) {
      throw new Error('Jetons insuffisants');
    }

    // Record token usage
    const { error: usageError } = await supabase
      .from('token_usage')
      .insert({
        company_id: companyId,
        subscription_id: subscriptionId,
        operation_type: operationType,
        tokens_consumed: tokenCount,
        description,
      });
    
    if (usageError) throw usageError;

    // Update subscription
    const { error: updateError } = await supabase
      .from('company_subscriptions')
      .update({
        tokens_remaining: (currentSub.tokens_remaining || 0) - tokenCount,
        tokens_used: (currentSub.tokens_used || 0) + tokenCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);
    
    if (updateError) throw updateError;
  },

  // Check if company has enough tokens
  async hasEnoughTokens(companyId: string, requiredTokens: number): Promise<boolean> {
    const subscription = await this.getCompanySubscription(companyId);
    return subscription ? subscription.tokens_remaining >= requiredTokens : false;
  }
};