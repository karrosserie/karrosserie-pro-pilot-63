
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
  isViewMode?: boolean;
}

const InsuranceTab: React.FC<InsuranceTabProps> = ({
  formData,
  onInputChange,
  onSwitchChange,
  onPhoneChange,
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

      {/* Insurance Details - Only shown when switch is ON */}
      {formData.clientInsurance && (
        <div className="space-y-6 border-t pt-6">
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
                required={formData.clientInsurance}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurancePhone">
                Numéro de téléphone <span className="text-destructive">*</span>
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
                required={formData.clientInsurance}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceContractNumber">
                Numéro de contrat <span className="text-destructive">*</span>
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
                Adresse <span className="text-destructive">*</span>
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
                Ville <span className="text-destructive">*</span>
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
                Code postal <span className="text-destructive">*</span>
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
      )}
    </div>
  );
};

export default InsuranceTab;
