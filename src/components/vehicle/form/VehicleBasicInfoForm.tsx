
import React from 'react';
import VehicleIdentificationFields from './VehicleIdentificationFields';
import VehicleBasicDetails from './VehicleBasicDetails';
import VehicleSpecifications from './VehicleSpecifications';
import VehicleInsuranceInfo from './VehicleInsuranceInfo';
import VehicleDateStatus from './VehicleDateStatus';

interface VehicleBasicInfoFormProps {
  formData: any;
  isViewMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const VehicleBasicInfoForm: React.FC<VehicleBasicInfoFormProps> = ({
  formData,
  isViewMode,
  onInputChange,
  onSelectChange
}) => {
  return (
    <div className="space-y-4">
      {/* VIN and Engine Number */}
      <VehicleIdentificationFields
        formData={formData}
        isViewMode={isViewMode}
        onInputChange={onInputChange}
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
      />

      {/* Insurance information */}
      <VehicleInsuranceInfo
        formData={formData}
        isViewMode={isViewMode}
        onInputChange={onInputChange}
        onSelectChange={onSelectChange}
      />

      {/* Date d'arrivée, Date de début, Date de fin, Statut */}
      <VehicleDateStatus
        formData={formData}
        isViewMode={isViewMode}
        onInputChange={onInputChange}
        onSelectChange={onSelectChange}
      />
    </div>
  );
};

export default VehicleBasicInfoForm;
