import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company_id } = await req.json();

    if (!company_id) {
      throw new Error('company_id is required');
    }

    console.log('📢 Notifying company creation for:', company_id);

    // Appeler le webhook n8n
    const webhookUrl = 'https://n8n.karrosserie.pro/webhook/40e735f8-d917-4dde-a56e-e1c1a96e32de';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id: company_id,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('❌ Webhook failed:', response.status, await response.text());
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    console.log('✅ Webhook notification sent successfully');

    return new Response(
      JSON.stringify({ success: true, company_id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Error in notify-company-creation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
