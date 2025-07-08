import { useCarBrands } from '@/hooks/use-car-brands';
import { supabase } from '@/integrations/supabase/client';

interface VinHandlerProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface VinInfo {
  brand?: string;
  model?: string;
  year?: number;
}

// Fonction pour décoder le VIN via l'API Supabase Edge Function
const decodeVinViaAPI = async (vin: string): Promise<VinInfo> => {
  try {
    const { data, error } = await supabase.functions.invoke('vin-decoder', {
      body: { vin }
    });

    if (error) {
      console.error('API VIN decoder error:', error);
      return {};
    }

    return data.success ? data.data : {};
  } catch (error) {
    console.error('Error calling VIN decoder API:', error);
    return {};
  }
};

// Fonction de validation VIN
const isValidVin = (vin: string): boolean => {
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
};

export function useFleetVehicleVinHandler({ formData, setFormData }: VinHandlerProps) {
  const { carBrands } = useCarBrands();

  const handleVinInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vin') {
      const upperValue = value.toUpperCase();
      setFormData(prev => ({ ...prev, vin: upperValue }));
      
      // Auto-decode VIN if valid
      if (isValidVin(upperValue)) {
        console.log('VIN valide détecté, appel de l\'API...');
        
        try {
          const vinInfo = await decodeVinViaAPI(upperValue);
          console.log('VIN décodé via API:', vinInfo);
          
          if (vinInfo.brand && carBrands.length > 0) {
            const matchingBrand = carBrands.find(brand => 
              brand.name.toLowerCase() === vinInfo.brand?.toLowerCase()
            );
            
            if (matchingBrand) {
              console.log('Marque détectée par VIN:', matchingBrand.name);
              setFormData(prev => ({
                ...prev,
                brand_id: matchingBrand.id,
                year: vinInfo.year || prev.year
              }));
            }
          }
        } catch (error) {
          console.error('Erreur lors du décodage VIN:', error);
        }
      }
    }
  };

  return {
    handleVinInputChange
  };
}
