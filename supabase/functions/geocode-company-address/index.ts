import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeocodeRequest {
  address: string;
}

interface LocationIQResponse {
  lat: string;
  lon: string;
  display_name: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address }: GeocodeRequest = await req.json();
    
    if (!address) {
      console.error('Adresse manquante dans la requête');
      return new Response(
        JSON.stringify({ error: 'Adresse requise' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const locationIqApiKey = Deno.env.get('LOCATIONIQ_API_KEY');
    if (!locationIqApiKey) {
      console.error('Clé API LocationIQ manquante');
      return new Response(
        JSON.stringify({ error: 'Configuration API manquante' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Nettoyer et encoder l'adresse pour l'URL
    const encodedAddress = encodeURIComponent(address.trim());
    
    // Appel à l'API LocationIQ en mode forward geocoding
    const geocodeUrl = `https://eu1.locationiq.com/v1/search.php?key=${locationIqApiKey}&q=${encodedAddress}&format=json&countrycodes=fr&limit=1`;
    
    console.log(`Géocodage de l'adresse: ${address}`);
    
    const response = await fetch(geocodeUrl);
    
    if (!response.ok) {
      console.error(`Erreur API LocationIQ: ${response.status} - ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la géolocalisation',
          details: `Status: ${response.status}`
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data: LocationIQResponse[] = await response.json();
    
    if (!data || data.length === 0) {
      console.log(`Aucun résultat trouvé pour l'adresse: ${address}`);
      return new Response(
        JSON.stringify({ 
          error: 'Adresse non trouvée',
          latitude: null,
          longitude: null
        }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const location = data[0];
    const latitude = parseFloat(location.lat);
    const longitude = parseFloat(location.lon);

    console.log(`Coordonnées trouvées pour "${address}": lat=${latitude}, lon=${longitude}`);

    return new Response(
      JSON.stringify({
        success: true,
        latitude,
        longitude,
        formatted_address: location.display_name
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erreur lors du géocodage:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur',
        details: error.message
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});