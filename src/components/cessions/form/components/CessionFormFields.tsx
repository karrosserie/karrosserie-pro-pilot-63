
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { CessionFormData, CessionFormErrors } from '../types';
import { useAccounts } from '@/hooks/use-accounts';
import { useInsuranceCompanies } from '@/hooks/use-insurance-companies';

interface CessionFormFieldsProps {
  formData: CessionFormData;
  errors: CessionFormErrors;
  onFieldChange: (field: keyof CessionFormData, value: any) => void;
}

export const CessionFormFields = ({
  formData,
  errors,
  onFieldChange
}: CessionFormFieldsProps) => {
  const { accounts: bankAccounts, isLoading: isLoadingBankAccounts } = useAccounts();
  const { insuranceCompanies, isLoading: isLoadingInsuranceCompanies } = useInsuranceCompanies();

  // Préparer les options pour SearchableSelect
  const insuranceOptions = (insuranceCompanies || []).map(company => ({
    value: company.id,
    label: company.name
  }));

  const bankAccountOptions = (bankAccounts || []).map(account => ({
    value: account.id,
    label: `${account.name} - ${account.bank}`
  }));

  return (
    <div className="space-y-4">
      {/* Numéro de sinistre, Date du sinistre et Numéro de police sur la même ligne */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Numéro de sinistre */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="incident_number">
            Numéro de sinistre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="incident_number"
            value={formData.incident_number}
            onChange={(e) => onFieldChange('incident_number', e.target.value)}
            placeholder="Numéro de sinistre"
          />
          {errors.incident_number && (
            <div className="text-sm text-red-600">{errors.incident_number}</div>
          )}
        </div>

        {/* Date du sinistre */}
        <div className="space-y-2">
          <Label htmlFor="incident_date">
            Date du sinistre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="incident_date"
            type="date"
            value={formData.incident_date}
            onChange={(e) => onFieldChange('incident_date', e.target.value)}
          />
          {errors.incident_date && (
            <div className="text-sm text-red-600">{errors.incident_date}</div>
          )}
        </div>

        {/* Numéro de police */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="policy_number">
            Numéro de police <span className="text-red-500">*</span>
          </Label>
          <Input
            id="policy_number"
            value={formData.policy_number}
            onChange={(e) => onFieldChange('policy_number', e.target.value)}
            placeholder="Numéro de police d'assurance"
          />
          {errors.policy_number && (
            <div className="text-sm text-red-600">{errors.policy_number}</div>
          )}
        </div>
      </div>

      {/* Numéro de rapport et Nom de l'expert sur une ligne */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Numéro de rapport */}
        <div className="space-y-2">
          <Label htmlFor="report_number">
            Numéro de rapport <span className="text-red-500">*</span>
          </Label>
          <Input
            id="report_number"
            value={formData.report_number}
            onChange={(e) => onFieldChange('report_number', e.target.value)}
            placeholder="Numéro de rapport d'expertise"
          />
          {errors.report_number && (
            <div className="text-sm text-red-600">{errors.report_number}</div>
          )}
        </div>

        {/* Nom de l'expert */}
        <div className="space-y-2">
          <Label htmlFor="expert_name">
            Nom de l'expert <span className="text-red-500">*</span>
          </Label>
          <Input
            id="expert_name"
            value={formData.expert_name}
            onChange={(e) => onFieldChange('expert_name', e.target.value)}
            placeholder="Nom de l'expert"
          />
          {errors.expert_name && (
            <div className="text-sm text-red-600">{errors.expert_name}</div>
          )}
        </div>
      </div>

      {/* Compagnie d'assurance et Compte bancaire sur la même ligne */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compagnie d'assurance */}
        <div className="space-y-2">
          <Label htmlFor="insurance_company_id">
            Compagnie d'assurance <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
            options={insuranceOptions}
            value={formData.insurance_company_id || ''}
            onValueChange={(value) => {
              console.log('Insurance company selected:', value);
              onFieldChange('insurance_company_id', value);
            }}
            placeholder={isLoadingInsuranceCompanies ? "Chargement..." : "Sélectionner une compagnie d'assurance"}
            searchPlaceholder="Rechercher une compagnie..."
            disabled={isLoadingInsuranceCompanies}
          />
          {errors.insurance_company_id && (
            <div className="text-sm text-red-600">{errors.insurance_company_id}</div>
          )}
        </div>

        {/* Compte bancaire */}
        <div className="space-y-2">
          <Label htmlFor="bank_account_id">
            Compte bancaire <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.bank_account_id || ''}
            onValueChange={(value) => onFieldChange('bank_account_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingBankAccounts ? "Chargement..." : "Sélectionner un compte"} />
            </SelectTrigger>
            <SelectContent>
              {bankAccounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} - {account.bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bank_account_id && (
            <div className="text-sm text-red-600">{errors.bank_account_id}</div>
          )}
        </div>
      </div>
    </div>
  );
};
