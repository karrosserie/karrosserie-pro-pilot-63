import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const numverifyApiKey = Deno.env.get('NUMVERIFY_API_KEY');
    
    if (!numverifyApiKey) {
      console.warn('⚠️ NUMVERIFY_API_KEY non configurée');
      return new Response(
        JSON.stringify({ 
          valid: true, 
          warning: 'Validation service unavailable' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Nettoyer le numéro de téléphone (enlever les espaces, +, etc.)
    const cleanedPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, '');
    
    // Appeler Numverify API
    const numverifyUrl = `http://apilayer.net/api/validate?access_key=${numverifyApiKey}&number=${cleanedPhone}&format=1`;
    console.log('📞 Appel Numverify pour:', cleanedPhone);
    
    const numverifyResponse = await fetch(numverifyUrl);
    
    if (!numverifyResponse.ok) {
      console.error('❌ Erreur Numverify:', numverifyResponse.status);
      return new Response(
        JSON.stringify({ 
          valid: true, 
          warning: 'Validation service error' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const phoneData = await numverifyResponse.json();
    console.log('📞 Réponse Numverify:', phoneData);

    // Vérifier si le numéro est invalide OU si aucun opérateur n'est attribué
    const hasNoCarrier = !phoneData.carrier || phoneData.carrier.trim() === '';
    
    const result = {
      valid: phoneData.valid && !hasNoCarrier,
      details: {
        number: phoneNumber,
        country: phoneData.country_name || 'inconnu',
        carrier: phoneData.carrier || 'aucun',
        lineType: phoneData.line_type || 'inconnu',
        internationalFormat: phoneData.international_format || phoneNumber,
        hasCarrier: !hasNoCarrier,
        isValid: phoneData.valid
      }
    };

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erreur lors de la validation du numéro:', error);
    return new Response(
      JSON.stringify({ 
        valid: true, 
        warning: 'Validation error',
        error: error.message 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
