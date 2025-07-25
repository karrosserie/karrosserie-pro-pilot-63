import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Token = Tables<'tokens'>;
export type TokenInsert = TablesInsert<'tokens'>;

export const tokensService = {
  async createToken(tokenData: Omit<TokenInsert, 'id' | 'created_at' | 'updated_at'>) {
    const companyId = tokenData.company_id;

    if (!companyId) throw new Error('Company ID is required');

    const { data, error } = await supabase
      .from('tokens')
      .insert([{
        ...tokenData,
        company_id: companyId
      }])
      .select()
      .single();

    if (error) throw error;

    console.log('Token créé avec succès:', data);

    // Envoyer l'email de demande de justificatifs
    try {
      console.log('Tentative d\'envoi de l\'email pour le token:', data.id);
      
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-documents-request-email', {
        body: { tokenId: data.id }
      });

      console.log('Réponse de l\'edge function:', emailResponse);
      
      if (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // Ne pas faire échouer la création du token si l'email échoue
      } else {
        console.log('Email envoyé avec succès');
      }
    } catch (emailError) {
      console.error('Exception lors de l\'envoi de l\'email:', emailError);
    }

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