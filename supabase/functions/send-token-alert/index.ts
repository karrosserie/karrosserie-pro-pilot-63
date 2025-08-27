import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenAlertRequest {
  company_id: string;
  tokens_remaining: number;
  threshold: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { company_id, tokens_remaining, threshold }: TokenAlertRequest = await req.json();

    console.log(`Sending token alert for company ${company_id}: ${tokens_remaining} tokens remaining (threshold: ${threshold})`);

    // Call the webhook
    const webhookResponse = await fetch('https://n8n.karrosserie.pro/webhook/jetons-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: company_id,
        tokens_remaining,
        threshold
      }),
    });

    if (!webhookResponse.ok) {
      console.error('Webhook call failed:', webhookResponse.status, webhookResponse.statusText);
      return new Response(
        JSON.stringify({ 
          error: 'Webhook call failed',
          status: webhookResponse.status 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log('Token alert webhook sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Alert sent successfully' 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-token-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);