import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, User } from 'lucide-react';

interface PersonalInfoTabProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange?: (value: string | undefined) => void;
  handlePhoneValidationChange?: (isValid: boolean) => void;
  handleAutoRelancesToggle?: (checked: boolean) => void;
  handleClientTypeChange?: (type: 'particulier' | 'entreprise') => void;
  isViewMode: boolean;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  formData,
  handleChange,
  handlePhoneChange,
  handlePhoneValidationChange,
  handleAutoRelancesToggle,
  handleClientTypeChange,
  isViewMode
}) => {
  const isEnterprise = formData.clientType === 'entreprise';

  return (
    <div className="space-y-4">
      {/* Sélecteur de type de client */}
      <div className="space-y-3">
        <Label>Type de client</Label>
        <RadioGroup
          value={formData.clientType || 'particulier'}
          onValueChange={(value) => handleClientTypeChange?.(value as 'particulier' | 'entreprise')}
          disabled={isViewMode}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="particulier" id="particulier" />
            <Label htmlFor="particulier" className="flex items-center gap-2 cursor-pointer font-normal">
              <User className="h-4 w-4" />
              Particulier
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="entreprise" id="entreprise" />
            <Label htmlFor="entreprise" className="flex items-center gap-2 cursor-pointer font-normal">
              <Building2 className="h-4 w-4" />
              Entreprise
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Champs conditionnels selon le type de client */}
      {isEnterprise ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" required>
                Raison Sociale
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="Ex: SARL Dupont"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" required>
                Nom du Gérant
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="Ex: Dupont"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" required>
                Prénom du Gérant
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="Ex: Michel"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" required>
                Téléphone
              </Label>
              <CustomPhoneInput
                value={formData.phone}
                onChange={handlePhoneChange || (() => {})}
                onValidationChange={handlePhoneValidationChange}
                placeholder="Numéro de téléphone"
                disabled={isViewMode}
              />
            </div>
          </div>
        </>
      ) : (
        <>
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
                onValidationChange={handlePhoneValidationChange}
                placeholder="Numéro de téléphone"
                disabled={isViewMode}
              />
            </div>
          </div>
        </>
      )}

      {/* Email pour entreprise (après les champs gérant) */}
      {isEnterprise && (
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
      )}
      
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
