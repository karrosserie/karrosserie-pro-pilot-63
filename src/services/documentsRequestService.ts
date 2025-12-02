import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const sendDocumentsRequest = async (clientId: string, companyId?: string) => {
  try {
    console.log('🔍 [sendDocumentsRequest] Début - clientId:', clientId, 'companyId:', companyId);
    
    // Vérifier si un token récent (< 5 minutes) existe déjà pour ce client
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentToken } = await supabase
      .from('tokens')
      .select('id, created_at')
      .eq('client_id', clientId)
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentToken && recentToken.length > 0) {
      console.log('⏭️ Demande de documents déjà envoyée récemment (< 5 min), ignoré. Token:', recentToken[0].id, 'créé à:', recentToken[0].created_at);
      toast.info('Une demande de documents a déjà été envoyée récemment à ce client');
      return { skipped: true, reason: 'recent_token_exists' };
    }
    
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

      // Insérer dans all_client_message pour traçabilité
      console.log('🔍 [all_client_message] Préparation insertion avec:', {
        client_id: clientId,
        company_id: effectiveCompanyId,
        uploadLink: data.uploadLink,
        hasUploadLink: !!data.uploadLink
      });
      
      try {
        const insertResult = await supabase
          .from('all_client_message')
          .insert({
            client_id: clientId,
            company_id: effectiveCompanyId,
            message: 'Demande de pièces justificatives envoyée au client',
            lien: data.uploadLink
          });

        console.log('🔍 [all_client_message] Résultat insertion:', {
          error: insertResult.error,
          data: insertResult.data,
          status: insertResult.status,
          statusText: insertResult.statusText
        });

        if (insertResult.error) {
          console.error('❌ Erreur lors de l\'insertion dans all_client_message:', insertResult.error);
        } else {
          console.log('✅ Message enregistré dans all_client_message avec succès');
        }
      } catch (allClientError) {
        console.error('❌ Exception lors de l\'insertion dans all_client_message:', allClientError);
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