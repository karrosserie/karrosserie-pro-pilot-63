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

    // Envoyer l'email de demande de justificatifs de manière asynchrone
    try {
      console.log('Tentative d\'envoi de l\'email pour le token:', data.id);
      
      // Utiliser la nouvelle edge function qui traite les demandes de documents
      // avec un délai pour permettre au token d'être committé en base
      setTimeout(async () => {
        try {
          const { data: processResponse, error: processError } = await supabase.functions.invoke('process-documents-request', {
            body: { tokenId: data.id }
          });

          if (processError) {
            console.error('Erreur lors du traitement de la demande de documents:', processError);
          } else {
            console.log('Demande de documents traitée avec succès:', processResponse);
          }
        } catch (error) {
          console.error('Exception lors du traitement de la demande de documents:', error);
        }
      }, 1000); // Délai de 1 seconde pour permettre au token d'être committé
      
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