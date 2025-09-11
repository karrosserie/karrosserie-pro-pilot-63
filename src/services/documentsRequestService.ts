import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const sendDocumentsRequest = async (clientId: string, companyId?: string) => {
  try {
    // D'abord, récupérer le premier véhicule du client
    const { data: vehicleData, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id')
      .eq('client_id', clientId)
      .limit(1)
      .single();

    if (vehicleError) {
      console.error('Aucun véhicule trouvé pour ce client:', vehicleError);
      throw new Error('Le client doit avoir au moins un véhicule pour demander des documents');
    }

    // Ensuite, créer un token pour la demande de documents
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .insert({
        client_id: clientId,
        company_id: companyId,
        vehicule_id: vehicleData.id,
      })
      .select('id')
      .single();

    if (tokenError || !tokenData) {
      console.error('Erreur création token:', tokenError);
      throw new Error('Erreur lors de la création du token');
    }

    // Ensuite, appeler l'edge function pour envoyer la demande
    const { data, error } = await supabase.functions.invoke('send-documents-request-email', {
      body: {
        tokenId: tokenData.id
      }
    });

    if (error) {
      console.error('Erreur edge function:', error);
      throw error;
    }

    toast.success('Demande de documents envoyée avec succès');
    return data;
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de la demande de documents:', error);
    toast.error('Erreur lors de l\'envoi de la demande de documents: ' + error.message);
    throw error;
  }
};