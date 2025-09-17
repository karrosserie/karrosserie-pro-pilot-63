import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VehicleSpecificationsProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const VehicleSpecifications: React.FC<VehicleSpecificationsProps> = ({
  formData,
  isViewMode,
  onInputChange
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
    
    // Créer un nouvel événement avec la valeur formatée
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue
      }
    };
    
    onInputChange(syntheticEvent);
  };

  const isLicensePlateValid = formData.licensePlate ? validateLicensePlate(formData.licensePlate) : true;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="licensePlate">
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
          className={!isLicensePlateValid ? 'border-red-500' : ''}
        />
        {formData.licensePlate && !isLicensePlateValid && (
          <p className="text-red-500 text-sm">
            Format invalide. Utilisez : AB-456-CD ou 2567 AB 33
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">Année</Label>
        <Input
          id="year"
          name="year"
          type="number"
          min="1900"
          max={new Date().getFullYear() + 1}
          value={formData.year || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Couleur</Label>
        <Input
          id="color"
          name="color"
          value={formData.color || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mileage">Kilométrage</Label>
        <Input
          id="mileage"
          name="mileage"
          type="number"
          value={formData.mileage || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>
    </div>
  );
};

export default VehicleSpecifications;