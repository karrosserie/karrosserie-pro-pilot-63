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
  phone?: string;  // Optionnel - si fourni, utilisé directement
  link?: string;   // Optionnel - si fourni, utilisé directement
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

    let phone = payload.phone;
    let link = payload.link;

    // Si phone ou link ne sont pas fournis, les récupérer depuis la base
    if (!phone || !link) {
      console.log('🔍 Fetching missing data from database...');
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Récupérer le téléphone du client
      if (!phone) {
        console.log('📞 Fetching client phone...');
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('phone')
          .eq('id', payload.client_id)
          .single();
        
        if (clientError) {
          console.error('❌ Error fetching client:', clientError);
        } else {
          phone = client?.phone;
          console.log('✅ Client phone retrieved:', phone ? 'yes' : 'no');
        }
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
