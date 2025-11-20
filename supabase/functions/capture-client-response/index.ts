import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      client_identifier, // email ou téléphone
      message_content, 
      channel, // "WhatsApp", "Mail", "Message"
      original_thread_id // ID de la messagerie (optionnel)
    } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Trouver le client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, company_id')
      .or(`email.eq.${client_identifier},phone.eq.${client_identifier}`)
      .single();

    if (clientError || !client) {
      return new Response(
        JSON.stringify({ error: 'Client not found', details: clientError }), 
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 2. Trouver le thread existant (si original_thread_id fourni)
    let messagerie;
    if (original_thread_id) {
      const { data } = await supabase
        .from('messageries')
        .select('*')
        .eq('id', original_thread_id)
        .single();
      messagerie = data;
    } else {
      // Sinon, trouver la dernière conversation non résolue
      const { data } = await supabase
        .from('messageries')
        .select('*')
        .eq('client_id', client.id)
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      messagerie = data;
    }

    if (messagerie) {
      // 3. Ajouter la réponse au thread existant
      const { error: replyError } = await supabase
        .from('messagerie_replies')
        .insert({
          messagerie_id: messagerie.id,
          company_id: messagerie.company_id,
          sender_type: 'client',
          sender_id: client.id,
          content: message_content,
          channel: channel,
          actual_communication_date: new Date().toISOString(),
          is_inbound: true,
          sent_at: new Date().toISOString(),
          read_by_client: true,
          read_by_company: false,
        });

      if (replyError) {
        console.error('Error inserting reply:', replyError);
      }

      // 4. Déterminer le nouveau statut selon le contexte
      let newStatus = 'nouveau';
      if (messagerie.status === 'en_attente_client' || messagerie.status === 'en_cours') {
        // Le client répond à une demande → résolu
        newStatus = 'resolu';
      } else if (messagerie.status === 'resolu') {
        // Le client relance une conversation résolue → en cours
        newStatus = 'en_cours';
      }
      // Sinon (nouveau/planifie), on laisse "nouveau" pour attirer l'attention

      // 5. Mettre à jour le statut intelligemment
      await supabase
        .from('messageries')
        .update({
          status: newStatus,
          resolved: newStatus === 'resolu',
          last_reply_at: new Date().toISOString(),
          replies_count: (messagerie.replies_count || 0) + 1,
        })
        .eq('id', messagerie.id);
    } else {
      // 5. Créer une nouvelle messagerie si aucun thread existant
      const { data: newMessagerie, error: messagerieError } = await supabase
        .from('messageries')
        .insert({
          client_id: client.id,
          company_id: client.company_id,
          title: `Nouveau message - ${channel}`,
          message: message_content,
          summary: message_content.substring(0, 100),
          channel: channel,
          priority: 3,
          category: 'information',
          status: 'nouveau',
          is_inbound: true,
          actual_communication_date: new Date().toISOString(),
          time: new Date().toISOString(),
          date: new Date().toLocaleDateString('fr-FR'),
          eta: '30min',
          resolved: false,
          archived: false,
          tags: [],
        })
        .select()
        .single();

      if (messagerieError) {
        console.error('Error creating messagerie:', messagerieError);
        return new Response(
          JSON.stringify({ error: 'Failed to create messagerie', details: messagerieError }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (newMessagerie) {
        await supabase.from('messagerie_replies').insert({
          messagerie_id: newMessagerie.id,
          company_id: client.company_id,
          sender_type: 'client',
          sender_id: client.id,
          content: message_content,
          channel: channel,
          actual_communication_date: new Date().toISOString(),
          is_inbound: true,
          sent_at: new Date().toISOString(),
          read_by_client: true,
          read_by_company: false,
        });

        // Mettre à jour le compteur
        await supabase
          .from('messageries')
          .update({ replies_count: 1 })
          .eq('id', newMessagerie.id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Response captured successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
