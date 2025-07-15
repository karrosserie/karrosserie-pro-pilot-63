
import React from 'react';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import MultipleVehicleImages from './MultipleVehicleImages';

interface VehicleImageData {
  url: string;
  timing: 'Avant' | 'Pendant' | 'Après';
}

interface VehicleDocumentsFormProps {
  formData: any;
  isViewMode: boolean;
  regDocPreview: string | null;
  vehicleImagePreview: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fileType: 'registrationDocument' | 'vehicleImage') => void;
  onRemoveFile: (fileType: 'registrationDocument' | 'vehicleImage') => void;
  onRegistrationFrontUpload: (url: string) => void;
  onRegistrationBackUpload: (url: string) => void;
  onVehicleImageUpload: (url: string) => void;
  onVehicleImagesUpdate: (images: VehicleImageData[]) => void;
}

const VehicleDocumentsForm: React.FC<VehicleDocumentsFormProps> = ({
  formData,
  isViewMode,
  onRegistrationFrontUpload,
  onRegistrationBackUpload,
  onVehicleImagesUpdate
}) => {
  const vehicleId = formData.id || 'new-vehicle';
  
  // Convertir les données existantes ou initialiser avec un tableau vide
  const vehicleImages: VehicleImageData[] = formData.vehicleImages || [];

  const handleImageAdd = (url: string) => {
    if (vehicleImages.length === 0 || vehicleImages[vehicleImages.length - 1].url !== '') {
      // Ajouter une nouvelle image avec le timing par défaut "Avant"
      const newImage: VehicleImageData = { url, timing: 'Avant' };
      onVehicleImagesUpdate([...vehicleImages, newImage]);
    } else {
      // Remplacer le dernier slot vide
      const updatedImages = [...vehicleImages];
      updatedImages[updatedImages.length - 1] = { url, timing: 'Avant' };
      onVehicleImagesUpdate(updatedImages);
    }
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = vehicleImages.filter((_, i) => i !== index);
    onVehicleImagesUpdate(updatedImages);
  };

  const handleImageUpdate = (index: number, url: string) => {
    const updatedImages = [...vehicleImages];
    updatedImages[index] = { ...updatedImages[index], url };
    onVehicleImagesUpdate(updatedImages);
  };

  const handleImageTimingUpdate = (index: number, timing: 'Avant' | 'Pendant' | 'Après') => {
    const updatedImages = [...vehicleImages];
    updatedImages[index] = { ...updatedImages[index], timing };
    onVehicleImagesUpdate(updatedImages);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Certificat d'immatriculation (Recto)</Label>
        <DocumentUploader
          documentType="registration"
          documentId={`${vehicleId}-front`}
          currentDocumentUrl={formData.registrationDocumentFrontUrl}
          onUploadComplete={onRegistrationFrontUpload}
          isViewMode={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label>Certificat d'immatriculation (Verso)</Label>
        <DocumentUploader
          documentType="registration"
          documentId={`${vehicleId}-back`}
          currentDocumentUrl={formData.registrationDocumentBackUrl}
          onUploadComplete={onRegistrationBackUpload}
          isViewMode={isViewMode}
        />
      </div>

      <MultipleVehicleImages
        vehicleId={vehicleId}
        vehicleImages={vehicleImages}
        isViewMode={isViewMode}
        onImageAdd={handleImageAdd}
        onImageRemove={handleImageRemove}
        onImageUpdate={handleImageUpdate}
        onImageTimingUpdate={handleImageTimingUpdate}
      />
    </div>
  );
};

export default VehicleDocumentsForm;
