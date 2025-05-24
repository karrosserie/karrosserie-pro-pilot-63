
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { decodeVin, isValidVin } from '@/services/vin-decoder';

interface VehicleIdentificationFieldsProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange?: (name: string, value: string) => void;
}

const VehicleIdentificationFields: React.FC<VehicleIdentificationFieldsProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange
}) => {
  // Effect pour détecter automatiquement la marque et le modèle quand le VIN change
  useEffect(() => {
    if (formData.vin && formData.vin.length === 17 && isValidVin(formData.vin) && onSelectChange) {
      const vinInfo = decodeVin(formData.vin);
      
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
    }
  }, [formData.vin, formData.brand, formData.model, formData.year, onSelectChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            ✓ VIN valide - Marque et modèle détectés automatiquement
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
  );
};

export default VehicleIdentificationFields;
