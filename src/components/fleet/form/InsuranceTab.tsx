
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PhoneInputField } from '@/components/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useInsuranceCompanies } from '@/hooks/use-insurance-companies';
import { LoanFormData } from '../FleetLoanForm';

interface InsuranceTabProps {
  formData: LoanFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwitchChange: (checked: boolean) => void;
  onPhoneChange: (value: string | undefined) => void;
  onAssistanceSwitchChange: (checked: boolean) => void;
  onAssistanceFormulaChange: (value: string) => void;
  onInsuranceCompanySelect: (companyId: string, companyName: string) => void;
  isViewMode?: boolean;
}

const InsuranceTab: React.FC<InsuranceTabProps> = ({
  formData,
  onInputChange,
  onSwitchChange,
  onPhoneChange,
  onAssistanceSwitchChange,
  onAssistanceFormulaChange,
  onInsuranceCompanySelect,
  isViewMode = false
}) => {
  const { insuranceCompanies } = useInsuranceCompanies();

  // Transform insurance companies to options for SearchableSelect
  const insuranceOptions = insuranceCompanies.map(company => ({
    value: company.id,
    label: company.name
  }));

  // Auto-fill assistance name when insurance company is selected and assistance is enabled
  useEffect(() => {
    if (formData.hasAssistance && formData.insuranceCompanyId) {
      const selectedCompany = insuranceCompanies.find(c => c.id === formData.insuranceCompanyId);
      
      if (selectedCompany?.default_assistance_name && !formData.assistanceName) {
        // Create a synthetic event to update assistanceName
        const syntheticEvent = {
          target: { name: 'assistanceName', value: selectedCompany.default_assistance_name }
        } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(syntheticEvent);
      }
    }
  }, [formData.hasAssistance, formData.insuranceCompanyId, insuranceCompanies]);

  const handleCompanySelect = (companyId: string) => {
    const selectedCompany = insuranceCompanies.find(c => c.id === companyId);
    if (selectedCompany) {
      onInsuranceCompanySelect(companyId, selectedCompany.name);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Insurance Switch */}
      <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg" data-tour="insurance-switch">
        <Switch
          id="clientInsurance"
          checked={formData.clientInsurance || false}
          onCheckedChange={onSwitchChange}
          disabled={isViewMode}
        />
        <Label htmlFor="clientInsurance" className="text-sm sm:text-base cursor-pointer">
          Assurance du client
        </Label>
      </div>

      {/* Insurance Details */}
      <div className="space-y-4 sm:space-y-6 border-t pt-4 sm:pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceCompanyName" className="text-sm">
              Nom de la compagnie d'assurance <span className="text-destructive">*</span>
            </Label>
            <SearchableSelect
              options={insuranceOptions}
              value={formData.insuranceCompanyId || ''}
              onValueChange={handleCompanySelect}
              placeholder="Rechercher une compagnie..."
              disabled={isViewMode}
              allowFreeText={true}
              onFreeTextChange={(text) => {
                onInsuranceCompanySelect('', text);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurancePhone" className="text-sm">
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
            <Label htmlFor="insuranceEmail" className="text-sm">
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
            <Label htmlFor="insuranceContractNumber" className="text-sm">
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

        {/* Address fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="insuranceAddress" className="text-sm">
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
            <Label htmlFor="insuranceCity" className="text-sm">
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
            <Label htmlFor="insurancePostalCode" className="text-sm">
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
      <div className="space-y-4 border-t pt-4 sm:pt-6">
        <h4 className="text-sm sm:text-base font-medium text-foreground">Assistance</h4>
        
        <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
          <Switch
            id="hasAssistance"
            checked={formData.hasAssistance || false}
            onCheckedChange={onAssistanceSwitchChange}
            disabled={isViewMode}
          />
          <Label htmlFor="hasAssistance" className="text-sm sm:text-base cursor-pointer">
            Dossier d'assistance
          </Label>
        </div>

        {formData.hasAssistance && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="assistanceCaseNumber" className="text-sm">
                Numéro de dossier <span className="text-destructive">*</span>
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
              <Label htmlFor="assistanceName" className="text-sm">
                Nom de l'assistance
              </Label>
              <Input
                id="assistanceName"
                name="assistanceName"
                value={formData.assistanceName || ''}
                onChange={onInputChange}
                disabled={isViewMode}
                placeholder="Auto-rempli selon l'assurance"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistanceEmail" className="text-sm">
                Email de contact <span className="text-destructive">*</span>
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

            <div className="space-y-2">
              <Label htmlFor="assistanceFormula" className="text-sm">
                Formule <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.assistanceFormula || ''}
                onValueChange={onAssistanceFormulaChange}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 jours</SelectItem>
                  <SelectItem value="15">15 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceTab;
