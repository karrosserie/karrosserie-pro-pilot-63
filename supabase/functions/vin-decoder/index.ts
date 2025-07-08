
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Types
interface VinInfo {
  brand?: string;
  model?: string;
  year?: number;
}

interface VinResponse {
  success: boolean;
  vin: string;
  data: VinInfo;
  decoded_at: string;
}

// CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

function createCorsResponse(body: any, status: number = 200) {
  return new Response(
    JSON.stringify(body),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

// Validation VIN
function isValidVin(vin: string): boolean {
  if (!vin || vin.length !== 17) {
    return false;
  }
  const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
  if (!validChars.test(vin)) {
    return false;
  }
  if (vin.includes('I') || vin.includes('O') || vin.includes('Q')) {
    return false;
  }
  return true;
}

// Mapping WMI vers marques
const wmiToBrand: Record<string, string> = {
  // AUDI
  'WAU': 'Audi', 'WA1': 'Audi', 'TRU': 'Audi', 'TRV': 'Audi', 'TRW': 'Audi',
  // BMW
  'WBA': 'BMW', 'WBS': 'BMW', 'WBY': 'BMW', '4US': 'BMW', '5UX': 'BMW', '5U1': 'BMW',
  'WBW': 'BMW', 'WBX': 'BMW', 'BWM': 'BMW',
  // MERCEDES-BENZ
  'WDD': 'Mercedes-Benz', 'WDB': 'Mercedes-Benz', 'WDC': 'Mercedes-Benz', 'WDF': 'Mercedes-Benz',
  'WDG': 'Mercedes-Benz', 'WDH': 'Mercedes-Benz', 'WDJ': 'Mercedes-Benz', 'WDK': 'Mercedes-Benz',
  '4JG': 'Mercedes-Benz', '55S': 'Mercedes-Benz', 'W1N': 'Mercedes-Benz', 'W1K': 'Mercedes-Benz',
  // VOLKSWAGEN
  'WVW': 'Volkswagen', 'WV1': 'Volkswagen', 'WV2': 'Volkswagen', '3VW': 'Volkswagen',
  '1VW': 'Volkswagen', '9BW': 'Volkswagen', 'WVO': 'Volkswagen',
  // PEUGEOT
  'VF3': 'Peugeot', 'VF2': 'Peugeot',
  // RENAULT
  'VF1': 'Renault', 'VN1': 'Renault', 'VNE': 'Renault',
  // CITROËN
  'VF7': 'Citroën', 'VF9': 'Citroën', 'VFE': 'Citroën',
  // FORD
  'WF0': 'Ford', '1FA': 'Ford', '1FB': 'Ford', '1FC': 'Ford', '1FD': 'Ford', '1FT': 'Ford',
  '2FA': 'Ford', '3FA': 'Ford', 'MAJ': 'Ford', 'SFA': 'Ford', '1FM': 'Ford', '2FM': 'Ford',
  // TOYOTA
  'JTD': 'Toyota', 'JTE': 'Toyota', 'JTG': 'Toyota', 'JTH': 'Toyota', 'JTJ': 'Toyota',
  'JTK': 'Toyota', 'JTL': 'Toyota', 'JTM': 'Toyota', 'JTN': 'Toyota', '4T1': 'Toyota',
  '5TD': 'Toyota', '5TE': 'Toyota', '5TF': 'Toyota', 'MR0': 'Toyota', 'SB1': 'Toyota',
  // HONDA
  'JHM': 'Honda', 'JH4': 'Honda', '1HG': 'Honda', '2HG': 'Honda', '3HG': 'Honda',
  'JHL': 'Honda', 'JHK': 'Honda', '19X': 'Honda',
  // NISSAN
  'JN1': 'Nissan', 'JN6': 'Nissan', 'JN8': 'Nissan', '1N4': 'Nissan', '1N6': 'Nissan',
  '3N1': 'Nissan', '3N6': 'Nissan', '5N1': 'Nissan', 'VSK': 'Nissan',
  // TESLA
  '5YJ': 'Tesla', '7G2': 'Tesla', 'XP7': 'Tesla',
  // Autres marques
  'KMH': 'Hyundai', 'KNA': 'Kia', 'JM1': 'Mazda', '1G1': 'Chevrolet',
  'YV1': 'Volvo', 'WP0': 'Porsche', 'ZFF': 'Ferrari'
};

// Mapping année
const yearMapping: Record<string, number> = {
  'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
  'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
  'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
  'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
  'Y': 2030, 'Z': 2031,
  '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
  '6': 2006, '7': 2007, '8': 2008, '9': 2009
};

// Décodage VIN
function decodeVin(vin: string): VinInfo {
  if (!vin || vin.length !== 17) {
    return {};
  }

  // WMI (3 premiers caractères)
  const wmi = vin.substring(0, 3);
  const brand = wmiToBrand[wmi];
  
  if (!brand) {
    // Essayer avec 2 caractères
    const wmi2 = vin.substring(0, 2);
    const brandFromWmi2 = wmiToBrand[wmi2];
    if (brandFromWmi2) {
      return { brand: brandFromWmi2 };
    }
    return {};
  }

  // Année (10ème caractère)
  const yearChar = vin.charAt(9);
  let year: number | undefined;
  
  if (yearMapping[yearChar]) {
    year = yearMapping[yearChar];
  }

  return {
    brand,
    year
  };
}

// Fonction principale
serve(async (req) => {
  // Gérer OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Seules GET et POST autorisées
    if (req.method !== 'GET' && req.method !== 'POST') {
      return createCorsResponse({ error: 'Method not allowed' }, 405);
    }

    let vin: string = '';

    // Récupérer le VIN avec gestion d'erreur pour le JSON
    if (req.method === 'GET') {
      const url = new URL(req.url)
      vin = url.searchParams.get('vin') || ''
    } else if (req.method === 'POST') {
      try {
        // Vérifier si le body existe et n'est pas vide
        const text = await req.text();
        if (text.trim()) {
          const body = JSON.parse(text);
          vin = body.vin || '';
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return createCorsResponse({ 
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON with vin property'
        }, 400);
      }
    }

    // Valider le VIN
    if (!vin) {
      return createCorsResponse({ 
        error: 'VIN is required',
        message: 'Please provide a VIN number as query parameter (?vin=...) or in request body {vin: "..."}'
      }, 400);
    }

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
