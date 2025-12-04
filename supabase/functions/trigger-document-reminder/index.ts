import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const N8N_WEBHOOK_URL = 'https://n8n.karrosserie.pro/webhook/edb07668-2f9a-4815-b4f9-2e1b64ba2a7f';

interface TriggerPayload {
  client_id: string;
  company_id: string;
  phone?: string;
  link?: string;
}

interface ClientData {
  phone: string | null;
  first_name: string | null;
  last_name: string | null;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Trigger document reminder called');
    const payload: TriggerPayload = await req.json();
    
    console.log('📋 Payload received:', { 
      client_id: payload.client_id, 
      company_id: payload.company_id,
      has_phone: !!payload.phone,
      has_link: !!payload.link
    });
    
    // Validation des paramètres obligatoires
    if (!payload.client_id || !payload.company_id) {
      console.error('❌ Missing required parameters');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'client_id et company_id sont requis' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Créer le client Supabase une seule fois
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let phone = payload.phone;
    let link = payload.link;
    let clientData: ClientData = { phone: null, first_name: null, last_name: null };

    // Toujours récupérer les informations du client pour le nom
    console.log('🔍 Fetching client data...');
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('phone, first_name, last_name')
      .eq('id', payload.client_id)
      .single();
    
    if (clientError) {
      console.error('❌ Error fetching client:', clientError);
    } else {
      clientData = client;
      if (!phone) {
        phone = client?.phone;
      }
      console.log('✅ Client data retrieved:', { 
        has_phone: !!phone, 
        name: `${client?.first_name} ${client?.last_name}` 
      });
    }

    // Générer le lien si non fourni
    if (!link) {
      console.log('🔗 Fetching or generating token link...');
      const { data: token, error: tokenError } = await supabase
        .from('tokens')
        .select('id')
        .eq('client_id', payload.client_id)
        .eq('company_id', payload.company_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (tokenError) {
        console.error('❌ Error fetching token:', tokenError);
      } else if (token) {
        const baseUrl = Deno.env.get('FRONTEND_BASE_URL') || 'https://appli.karrosserie.pro';
        link = `${baseUrl}/documents/upload/${token.id}`;
        console.log('✅ Token link generated');
      } else {
        console.warn('⚠️ No token found for client');
      }
    }

    // Vérifier qu'on a au moins le téléphone pour envoyer le SMS
    if (!phone) {
      console.error('❌ No phone number available');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Aucun numéro de téléphone disponible pour ce client' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Préparer le payload pour n8n
    const n8nPayload = {
      client_id: payload.client_id,
      company_id: payload.company_id,
      phone: phone,
      link: link
    };

    console.log('📤 Calling n8n webhook with payload:', n8nPayload);

    // Appeler le webhook n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n8nPayload)
    });

    const n8nResult = await n8nResponse.json().catch(() => ({}));

    console.log('📥 n8n response:', { 
      status: n8nResponse.status, 
      ok: n8nResponse.ok,
      result: n8nResult 
    });

    // Mise à jour verif_doc_client et création des messages après appel n8n réussi
    if (n8nResponse.ok) {
      const clientName = `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() || 'Client';
      const now = new Date();

      // 1. Mise à jour verif_doc_client
      console.log('📊 Mise à jour verif_doc_client pour client:', payload.client_id);
      
      const { data: existingRecord, error: checkError } = await supabase
        .from('verif_doc_client')
        .select('id, nombre_relance')
        .eq('client_id', payload.client_id)
        .eq('company_id', payload.company_id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Erreur vérification verif_doc_client:', checkError);
      }

      let nombreRelance = 1;
      if (existingRecord) {
        nombreRelance = (existingRecord.nombre_relance || 0) + 1;
        const { error: updateError } = await supabase
          .from('verif_doc_client')
          .update({ 
            nombre_relance: nombreRelance,
            updated_at: now.toISOString()
          })
          .eq('id', existingRecord.id);

        if (updateError) {
          console.error('❌ Erreur mise à jour verif_doc_client:', updateError);
        } else {
          console.log('✅ verif_doc_client mis à jour, relance n°', nombreRelance);
        }
      } else {
        const { error: insertError } = await supabase
          .from('verif_doc_client')
          .insert({
            client_id: payload.client_id,
            company_id: payload.company_id,
            nombre_relance: 1,
            updated_at: now.toISOString()
          });

        if (insertError) {
          console.error('❌ Erreur insertion verif_doc_client:', insertError);
        } else {
          console.log('✅ verif_doc_client créé, première relance');
        }
      }

      // 2. Créer une entrée dans messageries pour l'onglet Conversations
      console.log('💬 Création message dans messageries...');
      const { error: messagerieError } = await supabase
        .from('messageries')
        .insert({
          company_id: payload.company_id,
          client_id: payload.client_id,
          priority: 3,
          title: `Relance demande de justificatifs - ${clientName}`,
          channel: 'Message',
          eta: 'N/A',
          time: now.toTimeString().split(' ')[0],
          date: now.toISOString().split('T')[0],
          summary: `Relance automatique n°${nombreRelance} - Demande de pièces justificatives`,
          message: `Relance envoyée automatiquement au client ${clientName} pour demande de pièces justificatives.\n\nLien envoyé : ${link || 'Non disponible'}`,
          tags: ['documents', 'relance', 'automatique'],
          resolved: true,
          archived: false,
          is_inbound: false
        });

      if (messagerieError) {
        console.error('❌ Erreur création messagerie:', messagerieError);
      } else {
        console.log('✅ Message créé dans messageries');
      }

      // 3. Créer une entrée dans all_client_message pour traçabilité
      console.log('📝 Création entrée dans all_client_message...');
      const { error: allMessageError } = await supabase
        .from('all_client_message')
        .insert({
          client_id: payload.client_id,
          company_id: payload.company_id,
          message: `Relance automatique n°${nombreRelance} - Demande de pièces justificatives envoyée au client`,
          lien: link || null
        });

      if (allMessageError) {
        console.error('❌ Erreur création all_client_message:', allMessageError);
      } else {
        console.log('✅ Entrée créée dans all_client_message');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: n8nResponse.ok,
        message: n8nResponse.ok ? 'Webhook n8n déclenché avec succès' : 'Erreur webhook n8n',
        n8n_status: n8nResponse.status,
        n8n_response: n8nResult,
        payload_sent: n8nPayload
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error in trigger-document-reminder:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
