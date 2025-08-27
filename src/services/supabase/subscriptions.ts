import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type SubscriptionPlan = Tables<'subscription_plans'>;
export type TokenPackage = Tables<'token_packages'>;
export type CompanySubscription = Tables<'company_subscriptions'>;
export type TokenUsage = Tables<'token_usage'>;

export const subscriptionService = {
  // Get all available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get all available token packages
  async getTokenPackages(): Promise<TokenPackage[]> {
    const { data, error } = await supabase
      .from('token_packages')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get company's current subscription
  async getCompanySubscription(companyId: string): Promise<CompanySubscription | null> {
    const { data, error } = await supabase
      .from('company_subscriptions')
      .select(`
        *,
        subscription_plans:subscription_plan_id (*)
      `)
      .eq('company_id', companyId)
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
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