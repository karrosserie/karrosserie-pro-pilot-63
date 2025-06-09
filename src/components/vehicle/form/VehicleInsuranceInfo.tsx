
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-4 space-y-2">
        <Label htmlFor="insuranceCompany">Compagnie d'assurance</Label>
        <Select 
          disabled={isViewMode} 
          value={formData.insuranceCompany || ''} 
          onValueChange={(value) => onSelectChange('insuranceCompany', value)}
        >
          <SelectTrigger id="insuranceCompany">
            <SelectValue placeholder="Sélectionner une compagnie" />
          </SelectTrigger>
          <SelectContent>
            {insuranceCompanies.map(company => (
              <SelectItem key={company.id} value={company.name}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
