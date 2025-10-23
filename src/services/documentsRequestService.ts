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

    // Créer une messagerie pour notifier l'envoi
    if (data?.uploadLink && companyId) {
      const messageContent = `Pour la prise en charge de votre dossier par votre carrossier, vous pouvez envoyer vos justificatifs au lien suivant: ${data.uploadLink}`;
      
      await supabase.from('messageries').insert({
        company_id: companyId,
        priority: 3, // Priorité basse
        title: 'Demande de pièces justificatives envoyée',
        channel: data.sendMode === 'sms' ? 'SMS' : 'Email',
        eta: 'N/A',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('fr-FR'),
        summary: 'Demande de justificatifs client',
        message: messageContent,
        contact: data.recipient,
        tags: ['documents', 'client'],
        resolved: false,
        archived: false,
      });
    }

    toast.success('Demande de documents envoyée avec succès');
    return data;
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de la demande de documents:', error);
    toast.error('Erreur lors de l\'envoi de la demande de documents: ' + error.message);
    throw error;
  }
};