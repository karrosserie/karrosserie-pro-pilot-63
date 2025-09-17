
import React from 'react';
import VehicleIdentificationFields from './VehicleIdentificationFields';
import VehicleBasicDetails from './VehicleBasicDetails';
import VehicleSpecifications from './VehicleSpecifications';
import VehicleInsuranceInfo from './VehicleInsuranceInfo';


interface VehicleBasicInfoFormProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onValidationChange?: (field: string, isValid: boolean) => void;
}

const VehicleBasicInfoForm: React.FC<VehicleBasicInfoFormProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange,
  onValidationChange
}) => {
  return (
    <div className="space-y-4">
      {/* VIN and Engine Number */}
      <VehicleIdentificationFields
        formData={formData}
        isViewMode={isViewMode}
        onInputChange={onInputChange}
        onSelectChange={onSelectChange}
      />

      {/* Client, Brand and Model */}
      <VehicleBasicDetails
        formData={formData}
        isViewMode={isViewMode}
        onSelectChange={onSelectChange}
      />
      
      {/* License plate, Year, Color, and Mileage */}
      <VehicleSpecifications
        formData={formData}
        isViewMode={isViewMode}
        onInputChange={onInputChange}
        onValidationChange={onValidationChange}
      />

      {/* Insurance information */}
      <VehicleInsuranceInfo
        formData={formData}
        isViewMode={isViewMode}
        onInputChange={onInputChange}
        onSelectChange={onSelectChange}
      />

    </div>
  );
};

export default VehicleBasicInfoForm;
