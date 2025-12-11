import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VehicleSpecificationsProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onValidationChange?: (field: string, isValid: boolean) => void;
}

const VehicleSpecifications: React.FC<VehicleSpecificationsProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onValidationChange
}) => {
  // Validation des formats de plaque d'immatriculation française
  const validateLicensePlate = (value: string): boolean => {
    if (!value) return false;
    
    // Format ancien : 2 lettres - 3 chiffres - 2 lettres (AB-456-CD)
    const oldFormat = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/;
    
    // Format nouveau : Jusqu'à 4 chiffres + 2 ou 3 lettres + 2 chiffres (2567 AB 33)
    const newFormat = /^[0-9]{1,4}\s[A-Z]{2,3}\s[0-9]{2}$/;
    
    return oldFormat.test(value) || newFormat.test(value);
  };

  // Formatage automatique de la plaque d'immatriculation
  const formatLicensePlate = (value: string): string => {
    // Convertir en majuscules
    let formatted = value.toUpperCase();
    
    // Nettoyer les caractères indésirables (garder seulement lettres, chiffres, tirets et espaces)
    formatted = formatted.replace(/[^A-Z0-9\-\s]/g, '');
    
    return formatted;
  };

  const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatLicensePlate(e.target.value);
    
    // Modifier directement la valeur de l'événement
    e.target.value = formattedValue;
    
    // Valider le format et notifier le parent
    const isValid = formattedValue === '' || validateLicensePlate(formattedValue);
    onValidationChange?.('licensePlate', isValid);
    
    onInputChange(e);
  };

  const isLicensePlateValid = formData.licensePlate ? validateLicensePlate(formData.licensePlate) : true;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <div className="space-y-2 col-span-2 sm:col-span-1">
        <Label htmlFor="licensePlate" className="text-sm">
          Plaque d'immatriculation <span className="text-red-500">*</span>
        </Label>
        <Input
          id="licensePlate"
          name="licensePlate"
          value={formData.licensePlate || ''}
          onChange={handleLicensePlateChange}
          disabled={isViewMode}
          required
          placeholder="AB-456-CD ou 2567 AB 33"
          className={`text-sm ${!isLicensePlateValid ? 'border-red-500' : ''}`}
        />
        {formData.licensePlate && !isLicensePlateValid && (
          <p className="text-red-500 text-xs">
            Format invalide. Utilisez : AB-456-CD ou 2567 AB 33
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year" className="text-sm">Année</Label>
        <Input
          id="year"
          name="year"
          type="number"
          min="1900"
          max={new Date().getFullYear() + 1}
          value={formData.year || ''}
          onChange={onInputChange}
          disabled={isViewMode}
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color" className="text-sm">Couleur</Label>
        <Input
          id="color"
          name="color"
          value={formData.color || ''}
          onChange={onInputChange}
          disabled={isViewMode}
          className="text-sm"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mileage" className="text-sm">Kilométrage</Label>
        <Input
          id="mileage"
          name="mileage"
          type="number"
          value={formData.mileage || ''}
          onChange={onInputChange}
          disabled={isViewMode}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default VehicleSpecifications;