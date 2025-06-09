
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';

interface PersonalInfoFormProps {
  profile: any;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (value: string | undefined) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  profile,
  isEditing,
  onInputChange,
  onPhoneChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            name="first_name"
            value={profile.first_name || ''}
            onChange={onInputChange}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            name="last_name"
            value={profile.last_name || ''}
            onChange={onInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <CustomPhoneInput
          value={profile.phone || ''}
          onChange={onPhoneChange}
          disabled={!isEditing}
          placeholder="Numéro de téléphone"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          name="address"
          value={profile.address || ''}
          onChange={onInputChange}
          disabled={!isEditing}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            value={profile.city || ''}
            onChange={onInputChange}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postal_code">Code postal</Label>
          <Input
            id="postal_code"
            name="postal_code"
            value={profile.postal_code || ''}
            onChange={onInputChange}
            disabled={!isEditing}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            Enregistrer
          </Button>
        </div>
      )}
    </div>
  );
};
