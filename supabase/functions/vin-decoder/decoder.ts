
import { VinInfo } from './types.ts';
import { wmiToBrand, vinToModel, yearMapping } from './mappings.ts';

export function decodeVin(vin: string): VinInfo {
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
