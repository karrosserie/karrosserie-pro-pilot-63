import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { siren } = await req.json();
    
    if (!siren || siren.length !== 9) {
      return new Response(
        JSON.stringify({ error: 'SIREN doit contenir exactement 9 chiffres' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const inseeApiKey = Deno.env.get('INSEE_API_KEY');
    if (!inseeApiKey) {
      console.error('INSEE_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'Configuration API manquante' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const url = `https://api.insee.fr/api-sirene/3.11/siret?q=siren:${siren}`;
    
    console.log(`Calling INSEE API for SIREN: ${siren}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-INSEE-Api-Key-Integration': inseeApiKey,
        'User-Agent': 'LovableApp/1.0'
      }
    });

    if (!response.ok) {
      console.error(`INSEE API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la recherche SIREN' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    if (!data.etablissements || data.etablissements.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Aucun établissement trouvé pour ce SIREN' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Logique de sélection : priorité au siège, puis actif, puis premier disponible
    let selectedEtablissement = data.etablissements.find(etab => etab.etablissementSiege === true);
    
    if (!selectedEtablissement) {
      selectedEtablissement = data.etablissements.find(etab => 
        etab.etatAdministratifEtablissement === 'A'
      );
    }
    
    if (!selectedEtablissement) {
      selectedEtablissement = data.etablissements[0];
    }

    // Extraction des informations
    const uniteLegale = selectedEtablissement.uniteLegale;
    const adresseEtablissement = selectedEtablissement.adresseEtablissement;
    const periodesUniteLegale = uniteLegale.periodesUniteLegale?.[0];

    const companyInfo = {
      siren: uniteLegale.siren,
      siret: selectedEtablissement.siret,
      companyName: periodesUniteLegale?.denominationUniteLegale || 
                   `${periodesUniteLegale?.prenom1UniteLegale || ''} ${periodesUniteLegale?.nomUniteLegale || ''}`.trim(),
      legalForm: periodesUniteLegale?.categorieJuridiqueUniteLegale,
      nafCode: periodesUniteLegale?.activitePrincipaleUniteLegale,
      address: `${adresseEtablissement?.numeroVoieEtablissement || ''} ${adresseEtablissement?.typeVoieEtablissement || ''} ${adresseEtablissement?.libelleVoieEtablissement || ''}`.trim(),
      city: adresseEtablissement?.libelleCommuneEtablissement,
      postalCode: adresseEtablissement?.codePostalEtablissement,
    };

    console.log('Company info extracted:', companyInfo);

    return new Response(
      JSON.stringify({ success: true, data: companyInfo }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in insee-sirene function:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})