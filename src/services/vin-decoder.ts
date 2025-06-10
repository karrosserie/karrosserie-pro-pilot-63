
// Service pour décoder les VIN et extraire les informations de véhicule
export interface VinInfo {
  brand?: string;
  model?: string;
  year?: number;
}

// Mapping des codes WMI (World Manufacturer Identifier) vers les marques
const wmiToBrand: Record<string, string> = {
  // Audi
  'WAU': 'Audi',
  'WA1': 'Audi',
  'TRU': 'Audi',
  
  // BMW
  'WBA': 'BMW',
  'WBS': 'BMW',
  'WBY': 'BMW',
  '4US': 'BMW',
  '5UX': 'BMW',
  
  // Mercedes-Benz
  'WDD': 'Mercedes-Benz',
  'WDB': 'Mercedes-Benz',
  'WDC': 'Mercedes-Benz',
  'WDF': 'Mercedes-Benz',
  '4JG': 'Mercedes-Benz',
  '55S': 'Mercedes-Benz',
  
  // Volkswagen
  'WVW': 'Volkswagen',
  'WV1': 'Volkswagen',
  'WV2': 'Volkswagen',
  '3VW': 'Volkswagen',
  '1VW': 'Volkswagen',
  
  // Peugeot
  'VF3': 'Peugeot',
  
  // Renault
  'VF1': 'Renault',
  'VF2': 'Renault',
  
  // Citroën
  'VF7': 'Citroën',
  'VF9': 'Citroën',
  
  // Ford
  'WF0': 'Ford',
  '1FA': 'Ford',
  '1FB': 'Ford',
  '1FC': 'Ford',
  '1FD': 'Ford',
  '1FT': 'Ford',
  '2FA': 'Ford',
  '3FA': 'Ford',
  
  // Opel
  'W0L': 'Opel',
  'W0V': 'Opel',
  
  // Toyota
  'JTD': 'Toyota',
  'JTE': 'Toyota',
  'JTG': 'Toyota',
  'JTH': 'Toyota',
  'JTJ': 'Toyota',
  'JTK': 'Toyota',
  'JTL': 'Toyota',
  'JTM': 'Toyota',
  'JTN': 'Toyota',
  '4T1': 'Toyota',
  '5TD': 'Toyota',
};

// Mapping des codes de modèle spécifiques (exemples courants)
const vinToModel: Record<string, Record<string, string[]>> = {
  'Audi': {
    'A3': ['8V', '8P', '8L'],
    'A4': ['8K', '8E', '8D', 'B9'],
    'A6': ['4G', '4F', '4B'],
    'Q3': ['8U'],
    'Q5': ['8R', 'FY'],
  },
  'BMW': {
    'Série 1': ['1M', '1A', '1B'],
    'Série 3': ['3A', '3B', '3C', '3D', '3E', '3F', '3G'],
    'Série 5': ['5A', '5B', '5C', '5D', '5E', '5F', '5G'],
    'X1': ['X1'],
    'X3': ['X3'],
  },
  'Mercedes-Benz': {
    'Classe A': ['176', '177', '169'],
    'Classe C': ['204', '205', '202', '203'],
    'Classe E': ['212', '213', '210', '211'],
    'GLA': ['156'],
    'GLC': ['253'],
  },
  'Volkswagen': {
    'Golf': ['1K', '5K', 'AU', 'AJ'],
    'Polo': ['6R', '6C', '9N'],
    'Passat': ['3C', '3B', 'B8'],
    'Tiguan': ['5N', 'AD'],
  },
  'Peugeot': {
    '208': ['CA', 'CC'],
    '308': ['4A', '4B', '4C'],
    '3008': ['0U', 'P84'],
    '5008': ['0A', 'P87'],
  },
  'Citroën': {
    'C3': ['A51', 'FC', 'SC'],
    'C4': ['B7', 'N2', 'LC'],
    'C5': ['DC', 'DE', 'RD'],
    'Berlingo': ['B9', 'MF', 'VP']
  }
};

export function decodeVin(vin: string): VinInfo {
  if (!vin || vin.length !== 17) {
    return {};
  }

  // Extraire le WMI (3 premiers caractères)
  const wmi = vin.substring(0, 3);
  
  // Trouver la marque
  const brand = wmiToBrand[wmi];
  
  if (!brand) {
    return {};
  }

  // Extraire l'année (10ème caractère)
  const yearChar = vin.charAt(9);
  let year: number | undefined;
  
  // Mapping des caractères d'année (simplifié)
  const yearMapping: Record<string, number> = {
    'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
    'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019,
    'L': 2020, 'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024,
    '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005,
    '6': 2006, '7': 2007, '8': 2008, '9': 2009, 'Y': 2017
  };
  
  if (yearMapping[yearChar]) {
    year = yearMapping[yearChar];
  }

  // Tentative de détection du modèle (basique)
  let model: string | undefined;
  const modelCodes = vinToModel[brand];
  
  if (modelCodes) {
    // Extraire des segments du VIN pour la détection de modèle
    const segment1 = vin.substring(3, 5);
    const segment2 = vin.substring(4, 6);
    const segment3 = vin.substring(5, 7);
    
    for (const [modelName, codes] of Object.entries(modelCodes)) {
      if (codes.some(code => 
        vin.includes(code) || 
        segment1.includes(code) || 
        segment2.includes(code) ||
        segment3.includes(code)
      )) {
        model = modelName;
        break;
      }
    }
  }

  console.log('VIN décodé - brand:', brand, 'model:', model, 'year:', year);
  
  return {
    brand,
    model, // S'assurer que c'est une chaîne simple ou undefined
    year
  };
}

export function isValidVin(vin: string): boolean {
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
