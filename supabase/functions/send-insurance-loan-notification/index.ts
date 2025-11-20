import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  reservationId: string;
  clientName: string;
  clientEmail: string;
  insuranceEmail: string;
  insuranceCompanyName: string;
  insuranceContractNumber: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚗 Starting insurance loan notification...');

    const payload: NotificationPayload = await req.json();
    console.log('📦 Received payload:', JSON.stringify(payload, null, 2));

    // Validate required fields
    if (!payload.clientName || !payload.clientEmail || !payload.insuranceEmail || !payload.insuranceCompanyName) {
      throw new Error('Missing required fields');
    }

    // Format the exact payload expected by n8n webhook
    const webhookPayload = [
      {
        body: {
          client_name: payload.clientName,
          client_email: payload.clientEmail,
          client_contract_id: payload.insuranceContractNumber || null,
          claim_id: null, // Pas de sinistre pour un prêt de véhicule
          insurance_email: payload.insuranceEmail,
          insurance_name: payload.insuranceCompanyName
        }
      }
    ];

    console.log('📧 Calling n8n webhook with payload:', JSON.stringify(webhookPayload, null, 2));

    // Call n8n webhook
    const webhookResponse = await fetch('https://n8n.karrosserie.pro/webhook/reponse-assurance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('❌ Webhook error:', errorText);
      throw new Error(`Webhook failed with status ${webhookResponse.status}: ${errorText}`);
    }

    const webhookResult = await webhookResponse.text();
    console.log('✅ Webhook response:', webhookResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification sent to ${payload.insuranceEmail}`,
        webhookResponse: webhookResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in send-insurance-loan-notification:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
