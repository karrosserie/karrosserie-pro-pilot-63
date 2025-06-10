
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useInsuranceCompanies } from '@/hooks/use-insurance-companies';

interface VehicleInsuranceInfoProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const VehicleInsuranceInfo: React.FC<VehicleInsuranceInfoProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange
}) => {
  const { insuranceCompanies } = useInsuranceCompanies();

  // Préparer les options pour SearchableSelect
  const insuranceOptions = insuranceCompanies.map(company => ({
    value: company.name,
    label: company.name
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-4 space-y-2">
        <Label htmlFor="insuranceCompany">Compagnie d'assurance</Label>
        <SearchableSelect
          options={insuranceOptions}
          value={formData.insuranceCompany || ''}
          onValueChange={(value) => onSelectChange('insuranceCompany', value)}
          placeholder="Sélectionner une compagnie"
          searchPlaceholder="Rechercher une compagnie..."
          disabled={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="insuranceExpiryDate">Date d'expiration</Label>
        <Input
          id="insuranceExpiryDate"
          name="insuranceExpiryDate"
          type="date"
          value={formData.insuranceExpiryDate || ''}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>
    </div>
  );
};

export default VehicleInsuranceInfo;
