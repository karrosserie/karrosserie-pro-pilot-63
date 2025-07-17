import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Token = Tables<'tokens'>;
export type TokenInsert = TablesInsert<'tokens'>;

export const tokensService = {
  async createToken(tokenData: Omit<TokenInsert, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tokens')
      .insert([tokenData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTokens() {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteToken(id: string) {
    const { error } = await supabase
      .from('tokens')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};