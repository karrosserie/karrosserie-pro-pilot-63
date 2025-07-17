import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Token = Tables<'tokens'>;
export type TokenInsert = TablesInsert<'tokens'>;

export const tokensService = {
  async createToken(tokenData: Omit<TokenInsert, 'id' | 'created_at' | 'updated_at' | 'company_id'>) {
    // Récupérer l'ID de l'entreprise depuis company_info
    const { data: companyData, error: companyError } = await supabase
      .from('company_info')
      .select('id')
      .eq('user_id', tokenData.user_id)
      .single();

    if (companyError) throw companyError;
    if (!companyData) throw new Error('Aucune information d\'entreprise trouvée pour cet utilisateur');

    const { data, error } = await supabase
      .from('tokens')
      .insert([{
        ...tokenData,
        company_id: companyData.id
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