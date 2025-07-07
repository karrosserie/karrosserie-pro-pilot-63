
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { VinInfo, VinResponse, VinErrorResponse } from './types.ts';
import { isValidVin } from './validation.ts';
import { decodeVin } from './decoder.ts';
import { corsHeaders, createCorsResponse, createOptionsResponse } from './cors.ts';

serve(async (req) => {
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return createOptionsResponse();
  }

  try {
    // Seules les méthodes GET et POST sont autorisées
    if (req.method !== 'GET' && req.method !== 'POST') {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }

    let vin: string = '';

    // Récupérer le VIN depuis les paramètres de requête (GET) ou le body (POST)
    if (req.method === 'GET') {
      const url = new URL(req.url)
      vin = url.searchParams.get('vin') || ''
    } else if (req.method === 'POST') {
      const body = await req.json()
      vin = body.vin || ''
    }

    // Valider le VIN
    if (!vin) {
      return createCorsResponse({ 
        error: 'VIN is required',
        message: 'Please provide a VIN number as a parameter (GET) or in the request body (POST)'
      }, 400);
    }

    // Nettoyer et valider le VIN
    const cleanVin = vin.toUpperCase().trim()
    
    if (!isValidVin(cleanVin)) {
      return createCorsResponse({ 
        error: 'Invalid VIN',
        message: 'VIN must be 17 characters long and contain only valid characters (A-Z, 0-9, excluding I, O, Q)'
      }, 400);
    }

    // Décoder le VIN
    const vinInfo = decodeVin(cleanVin)

    // Retourner la réponse
    const response: VinResponse = {
      success: true,
      vin: cleanVin,
      data: vinInfo,
      decoded_at: new Date().toISOString()
    };

    return createCorsResponse(response);

  } catch (error) {
    console.error('Error in VIN decoder API:', error)
    
    return createCorsResponse({ 
      error: 'Internal server error',
      message: 'An error occurred while processing the VIN'
    }, 500);
  }
})
