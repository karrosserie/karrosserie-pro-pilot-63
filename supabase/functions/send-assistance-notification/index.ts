import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssistancePayload {
  reservationId: string;
  clientName: string;
  clientEmail: string | null;
  insuranceEmail: string;
  insuranceCompanyName: string;
  insuranceContractNumber: string | null;
  companyEmail: string;
  assistanceCaseNumber: string;
  assistanceEmail: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: AssistancePayload = await req.json();
    
    console.log('🆘 Envoi notification assistance pour réservation:', payload.reservationId);
    console.log('📋 Données reçues:', JSON.stringify(payload, null, 2));

    // Validation des champs essentiels
    if (!payload.clientName) {
      console.error('❌ Champ manquant: clientName');
      return new Response(
        JSON.stringify({ error: 'Le nom du client est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format attendu par n8n pour le webhook assistance
    const webhookPayload = [{
      body: {
        id: payload.reservationId,
        client_name: payload.clientName,
        client_email: payload.clientEmail || null,
        client_contract_id: payload.insuranceContractNumber || null,
        claim_id: null,
        insurance_email: payload.insuranceEmail || null,
        insurance_name: payload.insuranceCompanyName || null,
        compagny_email: payload.companyEmail,
        assistance_case_number: payload.assistanceCaseNumber || null,
        assistance_email: payload.assistanceEmail || null
      }
    }];

    console.log('📤 Envoi au webhook n8n assistance:', JSON.stringify(webhookPayload, null, 2));

    const response = await fetch('https://n8n.karrosserie.pro/webhook/e4b8fb4c-9503-4fd0-9d35-6bd743b4fb65', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    const responseText = await response.text();
    console.log('📥 Réponse n8n:', response.status, responseText);

    if (!response.ok) {
      console.error('❌ Erreur webhook n8n:', response.status, responseText);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de l\'envoi au webhook n8n',
          status: response.status,
          details: responseText
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Notification assistance envoyée avec succès');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification assistance envoyée avec succès',
        webhookResponse: responseText
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erreur dans send-assistance-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
