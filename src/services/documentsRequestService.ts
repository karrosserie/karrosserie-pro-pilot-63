import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const sendDocumentsRequest = async (clientId: string, companyId?: string) => {
  try {
    console.log('🔍 [sendDocumentsRequest] Début - clientId:', clientId, 'companyId:', companyId);
    
    // Récupérer les informations du client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('first_name, last_name')
      .eq('id', clientId)
      .single();

    if (clientError) {
      console.error('Erreur lors de la récupération du client:', clientError);
      throw new Error('Client non trouvé');
    }

    // Récupérer le premier véhicule du client
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

    // Créer un token pour la demande de documents
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .insert({
        client_id: clientId,
        company_id: companyId,
        vehicule_id: vehicleData.id,
      })
      .select('id, company_id')
      .single();

    if (tokenError || !tokenData) {
      console.error('Erreur création token:', tokenError);
      throw new Error('Erreur lors de la création du token');
    }

    // Utiliser le company_id du token si celui passé en paramètre est undefined
    const effectiveCompanyId = companyId || tokenData.company_id;
    console.log('🔍 Company ID effectif:', effectiveCompanyId);

    // Appeler l'edge function pour envoyer la demande
    const { data, error } = await supabase.functions.invoke('send-documents-request-email', {
      body: {
        tokenId: tokenData.id
      }
    });

    console.log('🔍 Réponse edge function:', { data, error });

    if (error) {
      console.error('Erreur edge function:', error);
      throw error;
    }

    // Appeler le webhook n8n
    try {
      const webhookResponse = await fetch('https://n8n.karrosserie.pro/webhook/733c39a8-3260-4650-882c-a28c7ca6a279', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          company_id: effectiveCompanyId,
        }),
      });

      if (!webhookResponse.ok) {
        console.error('❌ Erreur webhook n8n:', await webhookResponse.text());
      } else {
        console.log('✅ Webhook n8n appelé avec succès');
      }
    } catch (webhookError) {
      console.error('❌ Exception lors de l\'appel au webhook n8n:', webhookError);
    }

    // Créer une messagerie pour notifier l'envoi
    if (data?.uploadLink) {
      console.log('🔍 Tentative de création de messagerie...');
      const clientName = `${clientData.first_name} ${clientData.last_name}`;
      const messageContent = `Client: ${clientName}\n\nPour la prise en charge de votre dossier par votre carrossier, vous pouvez envoyer vos justificatifs au lien suivant: ${data.uploadLink}`;
      
      try {
        const now = new Date();
        const messageResult = await supabase.from('messageries').insert({
          company_id: effectiveCompanyId,
          client_id: clientId,
          priority: 3, // Priorité basse
          title: `Demande de justificatifs - ${clientName}`,
          channel: data.sendMode === 'sms' ? 'Message' : 'Mail',
          eta: 'N/A',
          time: now.toTimeString().split(' ')[0], // Format HH:MM:SS
          date: now.toISOString().split('T')[0], // Format YYYY-MM-DD
          summary: 'Demande de justificatifs client',
          message: messageContent,
          tags: ['documents', 'client'],
          resolved: false,
          archived: false,
        });

        if (messageResult.error) {
          console.error('❌ Erreur lors de la création du message dans messageries:', messageResult.error);
        } else {
          console.log('✅ Message créé dans messageries avec succès');
        }
      } catch (msgError) {
        console.error('❌ Exception lors de la création du message:', msgError);
      }
    } else {
      console.warn('⚠️ uploadLink manquant dans la réponse de l\'edge function');
    }

    toast.success('Demande de documents envoyée avec succès');
    return data;
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de la demande de documents:', error);
    toast.error('Erreur lors de l\'envoi de la demande de documents: ' + error.message);
    throw error;
  }
};