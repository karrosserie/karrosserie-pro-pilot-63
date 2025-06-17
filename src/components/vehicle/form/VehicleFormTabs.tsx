
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehicleBasicInfoForm from './VehicleBasicInfoForm';
import VehicleDetailsForm from './VehicleDetailsForm';
import VehicleDocumentsForm from './VehicleDocumentsForm';

interface VehicleImage {
  url: string;
  phase: 'Avant' | 'Pendant' | 'Après';
}

interface VehicleFormTabsProps {
  formData: any;
  isViewMode: boolean;
  regDocPreview: string | null;
  vehicleImagePreview: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fileType: 'registrationDocument' | 'vehicleImage') => void;
  onRemoveFile: (fileType: 'registrationDocument' | 'vehicleImage') => void;
  onRegistrationFrontUpload: (url: string) => void;
  onRegistrationBackUpload: (url: string) => void;
  onVehicleImageUpload: (url: string) => void;
  onVehicleImagesUpdate: (images: VehicleImage[]) => void;
  onFuelLevelChange: (value: number) => void;
  onAddWorkItem: () => void;
  onRemoveWorkItem: (index: number) => void;
  onWorkItemChange: (index: number, value: string) => void;
}

const VehicleFormTabs: React.FC<VehicleFormTabsProps> = ({
  formData,
  isViewMode,
  regDocPreview,
  vehicleImagePreview,
  onInputChange,
  onSelectChange,
  onFileUpload,
  onRemoveFile,
  onRegistrationFrontUpload,
  onRegistrationBackUpload,
  onVehicleImageUpload,
  onVehicleImagesUpdate,
  onFuelLevelChange,
  onAddWorkItem,
  onRemoveWorkItem,
  onWorkItemChange
}) => {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="info">Informations de base</TabsTrigger>
        <TabsTrigger value="details">Détails techniques</TabsTrigger>
        <TabsTrigger value="documents">Documents & Photos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-4">
        <VehicleBasicInfoForm
          formData={formData}
          isViewMode={isViewMode}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
        />
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <VehicleDetailsForm
          formData={formData}
          isViewMode={isViewMode}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
          onFuelLevelChange={onFuelLevelChange}
          onAddWorkItem={onAddWorkItem}
          onRemoveWorkItem={onRemoveWorkItem}
          onWorkItemChange={onWorkItemChange}
        />
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-6">
        <VehicleDocumentsForm
          formData={formData}
          isViewMode={isViewMode}
          regDocPreview={regDocPreview}
          vehicleImagePreview={vehicleImagePreview}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
          onRegistrationFrontUpload={onRegistrationFrontUpload}
          onRegistrationBackUpload={onRegistrationBackUpload}
          onVehicleImageUpload={onVehicleImageUpload}
          onVehicleImagesUpdate={onVehicleImagesUpdate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default VehicleFormTabs;
