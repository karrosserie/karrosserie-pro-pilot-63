
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PhoneInputField } from '@/components/ui/phone-input';
import { LoanFormData } from '../FleetLoanForm';

interface InsuranceTabProps {
  formData: LoanFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (checked: boolean) => void;
  onPhoneChange: (value: string | undefined) => void;
  onAssistanceSwitchChange: (checked: boolean) => void;
  isViewMode?: boolean;
}

const InsuranceTab: React.FC<InsuranceTabProps> = ({
  formData,
  onInputChange,
  onSwitchChange,
  onPhoneChange,
  onAssistanceSwitchChange,
  isViewMode = false
}) => {
  return (
    <div className="space-y-6">
      {/* Insurance Switch */}
      <div className="flex items-center space-x-2" data-tour="insurance-switch">
        <Switch
          id="clientInsurance"
          checked={formData.clientInsurance || false}
          onCheckedChange={onSwitchChange}
          disabled={isViewMode}
        />
        <Label htmlFor="clientInsurance">Assurance du client</Label>
      </div>

      {/* Insurance Details - Always visible */}
      <div className="space-y-6 md:space-y-8 border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="insuranceCompanyName">
              Nom de la compagnie d'assurance <span className="text-destructive">*</span>
            </Label>
            <Input
              id="insuranceCompanyName"
              name="insuranceCompanyName"
              value={formData.insuranceCompanyName || ''}
              onChange={onInputChange}
              disabled={isViewMode}
              required={true}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurancePhone">
              Numéro de téléphone {formData.clientInsurance && <span className="text-destructive">*</span>}
            </Label>
            <PhoneInputField
              value={formData.insurancePhone || ''}
              onChange={onPhoneChange}
              disabled={isViewMode}
              placeholder="Numéro de téléphone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceEmail">
              Adresse e-mail <span className="text-destructive">*</span>
            </Label>
            <Input
              id="insuranceEmail"
              name="insuranceEmail"
              type="email"
              value={formData.insuranceEmail || ''}
              onChange={onInputChange}
              disabled={isViewMode}
              required={true}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceContractNumber">
              Numéro de contrat {formData.clientInsurance && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="insuranceContractNumber"
              name="insuranceContractNumber"
              value={formData.insuranceContractNumber || ''}
              onChange={onInputChange}
              disabled={isViewMode}
              required={formData.clientInsurance}
            />
          </div>
        </div>

        {/* Address fields without title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="insuranceAddress">
              Adresse {formData.clientInsurance && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="insuranceAddress"
              name="insuranceAddress"
              value={formData.insuranceAddress || ''}
              onChange={onInputChange}
              disabled={isViewMode}
              required={formData.clientInsurance}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceCity">
              Ville {formData.clientInsurance && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="insuranceCity"
              name="insuranceCity"
              value={formData.insuranceCity || ''}
              onChange={onInputChange}
              disabled={isViewMode}
              required={formData.clientInsurance}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurancePostalCode">
              Code postal {formData.clientInsurance && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="insurancePostalCode"
              name="insurancePostalCode"
              value={formData.insurancePostalCode || ''}
              onChange={onInputChange}
              disabled={isViewMode}
              required={formData.clientInsurance}
            />
          </div>
        </div>
      </div>

      {/* Assistance Section */}
      <div className="space-y-6 border-t pt-6 mt-6">
        <h4 className="text-sm font-medium text-foreground">Assistance</h4>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="hasAssistance"
            checked={formData.hasAssistance || false}
            onCheckedChange={onAssistanceSwitchChange}
            disabled={isViewMode}
          />
          <Label htmlFor="hasAssistance">Dossier d'assistance</Label>
        </div>

        {formData.hasAssistance && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="assistanceCaseNumber">
                Numéro de dossier d'assistance <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assistanceCaseNumber"
                name="assistanceCaseNumber"
                value={formData.assistanceCaseNumber || ''}
                onChange={onInputChange}
                disabled={isViewMode}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistanceEmail">
                Email de contact de l'assistance <span className="text-destructive">*</span>
              </Label>
              <Input
                id="assistanceEmail"
                name="assistanceEmail"
                type="email"
                value={formData.assistanceEmail || ''}
                onChange={onInputChange}
                disabled={isViewMode}
                required
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceTab;
