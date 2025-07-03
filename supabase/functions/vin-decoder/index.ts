
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Interface pour les informations VIN
interface VinInfo {
  brand?: string;
  model?: string;
  year?: number;
}

// Mapping des codes WMI vers les marques (version simplifiée pour l'API)
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
  
  // Autres marques populaires...
  'KMH': 'Hyundai', 'KNA': 'Kia', 'JM1': 'Mazda', '1G1': 'Chevrolet',
  'YV1': 'Volvo', 'WP0': 'Porsche', 'ZFF': 'Ferrari'
};

// Mapping des segments VIN vers les modèles par marque (version simplifiée)
const vinToModel: Record<string, Record<string, string[]>> = {
  'Audi': {
    'A3': ['8V', '8P', '8L', '8Y'],
    'A4': ['8K', '8E', '8D', 'B9', '8W'],
    'A6': ['4G', '4F', '4B', 'C8'],
    'Q3': ['8U', 'F3'],
    'Q5': ['8R', 'FY']
  },
  'BMW': {
    'Série 3': ['3A', '3B', '3C', '3D', '3E', '3F', '3G'],
    'Série 5': ['5A', '5B', '5C', '5D', '5E', '5F', '5G'],
    'X3': ['X3', 'U3', 'G01'],
    'X5': ['X5', 'U5', 'G05']
  },
  'Mercedes-Benz': {
    'Classe C': ['204', '205', '202', '203'],
    'Classe E': ['212', '213', '210', '211'],
    'GLC': ['253', '254']
  },
  'Volkswagen': {
    'Golf': ['1K', '5K', 'AU', 'AJ', 'CD'],
    'Passat': ['3C', '3B', 'B8', 'B9'],
    'Tiguan': ['5N', 'AD']
  },
  'Toyota': {
    'Corolla': ['ZZE', 'ZRE', 'NRE', 'E12', 'E15', 'E21'],
    'Camry': ['ACV', 'GSV', 'ASV'],
    'RAV4': ['ACA', 'ZCA', 'XA']
  }
};

function isValidVin(vin: string): boolean {
  if (!vin || vin.length !== 17) {
    return false;
  }

  // Vérifier que le VIN ne contient que des caractères valides
  const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
  if (!validChars.test(vin)) {
    return false;
  }

  // Le VIN ne doit pas contenir I, O, Q
  if (vin.includes('I') || vin.includes('O') || vin.includes('Q')) {
    return false;
  }

  return true;
}

function decodeVin(vin: string): VinInfo {
  if (!vin || vin.length !== 17) {
    return {};
  }

  // Extraire le WMI (3 premiers caractères)
  const wmi = vin.substring(0, 3);
  
  // Trouver la marque
  const brand = wmiToBrand[wmi];
  
  if (!brand) {
    // Essayer avec les 2 premiers caractères si pas de correspondance avec 3
    const wmi2 = vin.substring(0, 2);
    const brandFromWmi2 = wmiToBrand[wmi2];
    if (brandFromWmi2) {
      return { brand: brandFromWmi2 };
    }
    return {};
  }

  // Extraire l'année (10ème caractère)
  const yearChar = vin.charAt(9);
  let year: number | undefined;
  
  // Mapping des caractères d'année
  const yearMapping: Record<string, number> = {
    'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
    'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
    'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
    'S': 2025, 'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029,
    'Y': 2030, 'Z': 2031,
    '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
    '6': 2006, '7': 2007, '8': 2008, '9': 2009
  };
  
  if (yearMapping[yearChar]) {
    year = yearMapping[yearChar];
  }

  // Détection du modèle
  let model: string | undefined;
  const modelCodes = vinToModel[brand];
  
  if (modelCodes) {
    const segment1 = vin.substring(3, 5);
    const segment2 = vin.substring(4, 6);
    const segment3 = vin.substring(5, 7);
    const segment4 = vin.substring(3, 8);
    
    for (const [modelName, codes] of Object.entries(modelCodes)) {
      const found = codes.some(code => {
        return segment1 === code || 
               segment2 === code || 
               segment3 === code ||
               segment4.includes(code);
      });
      
      if (found) {
        model = modelName;
        break;
      }
    }
  }

  return {
    brand,
    model,
    year
  };
}

serve(async (req) => {
  // Headers CORS pour permettre l'accès externe
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  }

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Seules les méthodes GET et POST sont autorisées
    if (req.method !== 'GET' && req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
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
      return new Response(
        JSON.stringify({ 
          error: 'VIN is required',
          message: 'Please provide a VIN number as a parameter (GET) or in the request body (POST)'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Nettoyer et valider le VIN
    const cleanVin = vin.toUpperCase().trim()
    
    if (!isValidVin(cleanVin)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid VIN',
          message: 'VIN must be 17 characters long and contain only valid characters (A-Z, 0-9, excluding I, O, Q)'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Décoder le VIN
    const vinInfo = decodeVin(cleanVin)

    // Retourner la réponse
    return new Response(
      JSON.stringify({
        success: true,
        vin: cleanVin,
        data: vinInfo,
        decoded_at: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in VIN decoder API:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'An error occurred while processing the VIN'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
