
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useCarBrands } from '@/hooks/use-car-brands';
import { useCarModels } from '@/hooks/use-car-models';

interface VehicleIdentificationFieldsProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange?: (name: string, value: string) => void;
}

// Fonction pour décoder le VIN via l'API Supabase Edge Function
const decodeVinViaAPI = async (vin: string) => {
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

const VehicleIdentificationFields: React.FC<VehicleIdentificationFieldsProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange
}) => {
  const { carBrands } = useCarBrands();
  const [vinDecodeInfo, setVinDecodeInfo] = React.useState<any>(null);

  // Effect pour décoder le VIN et stocker les informations
  useEffect(() => {
    if (formData.vin && formData.vin.length === 17 && isValidVin(formData.vin) && !vinDecodeInfo) {
      const decodeVin = async () => {
        const vinInfo = await decodeVinViaAPI(formData.vin);
        console.log('VIN décodé:', vinInfo);
        setVinDecodeInfo(vinInfo);
      };
      
      decodeVin();
    }
  }, [formData.vin, vinDecodeInfo]);

  // Effect pour sélectionner la marque une fois les marques chargées
  useEffect(() => {
    if (vinDecodeInfo?.brand && !formData.brandId && carBrands.length > 0) {
      const matchingBrand = carBrands.find(brand => 
        brand.name.toLowerCase() === vinDecodeInfo.brand?.toLowerCase()
      );
      
      if (matchingBrand && onSelectChange) {
        onSelectChange('brandId', matchingBrand.id);
        console.log('Marque détectée automatiquement via VIN:', matchingBrand.name, 'ID:', matchingBrand.id);
      }
    }
  }, [vinDecodeInfo, formData.brandId, carBrands, onSelectChange]);

  // Effect pour mettre à jour l'année
  useEffect(() => {
    if (vinDecodeInfo?.year && !formData.year && onSelectChange) {
      onSelectChange('year', vinDecodeInfo.year.toString());
      console.log('Année détectée automatiquement:', vinDecodeInfo.year);
    }
  }, [vinDecodeInfo, formData.year, onSelectChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="vin" className="text-sm">
            Numéro de série (VIN) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            required
            placeholder="17 caractères"
            maxLength={17}
            className="text-sm"
            style={{
              textTransform: 'uppercase'
            }}
          />
          {formData.vin && !isValidVin(formData.vin) && (
            <p className="text-xs sm:text-sm text-red-500">
              Le VIN doit contenir exactement 17 caractères alphanumériques (sans I, O, Q)
            </p>
          )}
          {formData.vin && isValidVin(formData.vin) && (
            <p className="text-xs sm:text-sm text-green-600">
              ✓ VIN valide - Décodage automatique en cours...
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="engineNumber" className="text-sm">Numéro de moteur</Label>
          <Input
            id="engineNumber"
            name="engineNumber"
            value={formData.engineNumber || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleIdentificationFields;
