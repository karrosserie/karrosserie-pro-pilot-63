
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
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Informations d'assurance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="insurancePolicyNumber">Numéro de police</Label>
          <Input
            id="insurancePolicyNumber"
            name="insurancePolicyNumber"
            value={formData.insurancePolicyNumber || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceContractNumber">Numéro de contrat</Label>
          <Input
            id="insuranceContractNumber"
            name="insuranceContractNumber"
            value={formData.insuranceContractNumber || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurancePhone">Téléphone assurance</Label>
          <Input
            id="insurancePhone"
            name="insurancePhone"
            value={formData.insurancePhone || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceEmail">Email assurance</Label>
          <Input
            id="insuranceEmail"
            name="insuranceEmail"
            type="email"
            value={formData.insuranceEmail || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="insuranceAddress">Adresse de l'assurance</Label>
          <Input
            id="insuranceAddress"
            name="insuranceAddress"
            value={formData.insuranceAddress || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceCity">Ville</Label>
          <Input
            id="insuranceCity"
            name="insuranceCity"
            value={formData.insuranceCity || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurancePostalCode">Code postal</Label>
          <Input
            id="insurancePostalCode"
            name="insurancePostalCode"
            value={formData.insurancePostalCode || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceAgent">Agent d'assurance</Label>
          <Input
            id="insuranceAgent"
            name="insuranceAgent"
            value={formData.insuranceAgent || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insuranceAgentPhone">Téléphone de l'agent</Label>
          <Input
            id="insuranceAgentPhone"
            name="insuranceAgentPhone"
            value={formData.insuranceAgentPhone || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleInsuranceInfo;
