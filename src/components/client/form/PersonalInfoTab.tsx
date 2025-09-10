import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';

interface PersonalInfoTabProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange?: (value: string | undefined) => void;
  handleAutoRelancesToggle?: (checked: boolean) => void;
  isViewMode: boolean;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  handleChange,
  handlePhoneChange,
  handleAutoRelancesToggle,
  isViewMode
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastName" required>
            Nom
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isViewMode}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstName" required>
            Prénom
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isViewMode}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isViewMode}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone" required>
            Téléphone
          </Label>
          <CustomPhoneInput
            value={formData.phone}
            onChange={handlePhoneChange || (() => {})}
            placeholder="Numéro de téléphone"
            disabled={isViewMode}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Société (optionnel)</Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          disabled={isViewMode}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address" required>
          Adresse
        </Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={isViewMode}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode" required>
            Code postal
          </Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            disabled={isViewMode}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city" required>
            Ville
          </Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isViewMode}
            required
          />
        </div>
      </div>
      
      {/* Section relances automatiques */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">
              Relances automatiques
            </Label>
            <p className="text-sm text-muted-foreground">
              Activer ou désactiver les relances automatiques pour ce client
            </p>
          </div>
          <Switch
            checked={!formData.autoRelancesDisabled}
            onCheckedChange={handleAutoRelancesToggle || (() => {})}
            disabled={isViewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
