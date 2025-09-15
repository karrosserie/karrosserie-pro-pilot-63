import { supabase } from '@/integrations/supabase/client';

export const getBasicUserMetrics = async (userId: string, companyId?: string) => {
  try {
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId || null);

    const { data: activities } = await supabase
      .from('user_activity_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId || null);

    return {
      totalSessions: sessions?.length || 0,
      totalActivities: activities?.length || 0,
      lastActive: activities?.[0]?.timestamp || null,
    };
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    return null;
  }
};

export const getFunnelConversion = async (funnelName: string, companyId?: string) => {
  try {
    const { data: funnelData } = await supabase
      .from('user_funnel_progress')
      .select('*')
      .eq('funnel_name', funnelName)
      .eq('company_id', companyId || null);

    if (!funnelData) return null;

    const uniqueSessions = new Set(funnelData.map(d => d.session_id)).size;
    const completions = funnelData.filter(d => d.status === 'completed').length;

    return {
      totalStarts: uniqueSessions,
      completions,
      conversionRate: completions / Math.max(1, uniqueSessions),
    };
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    return null;
  }
};