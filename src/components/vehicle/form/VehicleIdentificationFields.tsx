
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

  // Effect pour détecter automatiquement la marque et le modèle quand le VIN change
  useEffect(() => {
    if (formData.vin && formData.vin.length === 17 && isValidVin(formData.vin) && onSelectChange) {
      const decodeVin = async () => {
        const vinInfo = await decodeVinViaAPI(formData.vin);
        
        console.log('VIN décodé:', vinInfo);
        
        // Mettre à jour la marque si détectée et pas déjà définie
        if (vinInfo.brand && !formData.brand) {
          onSelectChange('brand', vinInfo.brand);
          console.log('Marque détectée automatiquement:', vinInfo.brand);
        }
        
        // Mettre à jour le modèle si détecté et pas déjà défini
        if (vinInfo.model && !formData.model) {
          onSelectChange('model', vinInfo.model);
          console.log('Modèle détecté automatiquement:', vinInfo.model);
        }
        
        // Mettre à jour l'année si détectée et pas déjà définie
        if (vinInfo.year && !formData.year) {
          onSelectChange('year', vinInfo.year.toString());
          console.log('Année détectée automatiquement:', vinInfo.year);
        }
      };
      
      decodeVin();
    }
  }, [formData.vin, formData.brand, formData.model, formData.year, onSelectChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vin">
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
            style={{
              textTransform: 'uppercase'
            }}
          />
          {formData.vin && !isValidVin(formData.vin) && (
            <p className="text-sm text-red-500">
              Le VIN doit contenir exactement 17 caractères alphanumériques (sans I, O, Q)
            </p>
          )}
          {formData.vin && isValidVin(formData.vin) && (
            <p className="text-sm text-green-600">
              ✓ VIN valide - Marque et modèle détectés
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="engineNumber">Numéro de moteur</Label>
          <Input
            id="engineNumber"
            name="engineNumber"
            value={formData.engineNumber || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleIdentificationFields;
