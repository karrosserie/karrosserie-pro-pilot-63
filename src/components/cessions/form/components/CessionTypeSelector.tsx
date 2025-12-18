import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CessionType } from '../types';
import { Building, Car, Wrench } from 'lucide-react';

interface CessionTypeSelectorProps {
  value: CessionType;
  onChange: (value: CessionType) => void;
  disabled?: boolean;
}

export const CessionTypeSelector = ({
  value,
  onChange,
  disabled = false
}: CessionTypeSelectorProps) => {
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.debug('[CessionTypeSelector]', { value, disabled });
    }
  }, [value, disabled]);

  return (
    <div className="space-y-3">
      <Label>Type de cession <span className="text-red-500">*</span></Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as CessionType)}
        className="grid grid-cols-3 gap-4"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="repair" id="cession-repair" />
          <Label 
            htmlFor="cession-repair" 
            className="flex items-center gap-2 cursor-pointer font-normal"
          >
            <Wrench className="h-4 w-4" />
            Réparation
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="repair_enterprise" id="cession-repair-enterprise" />
          <Label 
            htmlFor="cession-repair-enterprise" 
            className="flex items-center gap-2 cursor-pointer font-normal"
          >
            <Building className="h-4 w-4" />
            Réparation Entreprise
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fleet_loan" id="cession-fleet-loan" />
          <Label 
            htmlFor="cession-fleet-loan" 
            className="flex items-center gap-2 cursor-pointer font-normal"
          >
            <Car className="h-4 w-4" />
            Prêt de véhicule
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
