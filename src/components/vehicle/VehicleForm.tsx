
import React from 'react';
import VehicleFormTabs from './form/VehicleFormTabs';
import VehicleFormActions from './form/VehicleFormActions';
import { useVehicleFormLogic } from './form/VehicleFormLogic';

interface VehicleFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isViewMode?: boolean;
  onCancel: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  onSubmit,
  defaultValues = {},
  isViewMode = false,
  onCancel
}) => {
  const {
    formData,
    regDocPreview,
    vehicleImagePreview,
    handleInputChange,
    handleSelectChange,
    handleConditionChange,
    handleFileUpload,
    handleRemoveFile,
    handleFuelLevelChange,
    handleAddWorkItem,
    handleRemoveWorkItem,
    handleWorkItemChange,
    handleRegistrationFrontUpload,
    handleRegistrationBackUpload,
    handleVehicleImageUpload,
    handleVehicleImagesUpdate,
    handleSubmit
  } = useVehicleFormLogic({ defaultValues, onSubmit, isViewMode });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VehicleFormTabs
        formData={formData}
        isViewMode={isViewMode}
        regDocPreview={regDocPreview}
        vehicleImagePreview={vehicleImagePreview}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onConditionChange={handleConditionChange}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        onRegistrationFrontUpload={handleRegistrationFrontUpload}
        onRegistrationBackUpload={handleRegistrationBackUpload}
        onVehicleImageUpload={handleVehicleImageUpload}
        onVehicleImagesUpdate={handleVehicleImagesUpdate}
        onFuelLevelChange={handleFuelLevelChange}
        onAddWorkItem={handleAddWorkItem}
        onRemoveWorkItem={handleRemoveWorkItem}
        onWorkItemChange={handleWorkItemChange}
      />
      
      <VehicleFormActions
        isViewMode={isViewMode}
        defaultValues={defaultValues}
        onCancel={onCancel}
      />
    </form>
  );
};

export default VehicleForm;
