
import React from 'react';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import MultipleVehicleImages from './MultipleVehicleImages';

interface VehicleImage {
  url: string;
  phase: 'Avant' | 'Pendant' | 'Après';
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
  onVehicleImagesUpdate: (images: VehicleImage[]) => void;
}

const VehicleDocumentsForm: React.FC<VehicleDocumentsFormProps> = ({
  formData,
  isViewMode,
  onRegistrationFrontUpload,
  onRegistrationBackUpload,
  onVehicleImagesUpdate
}) => {
  const vehicleId = formData.id || 'new-vehicle';
  const vehicleImages: VehicleImage[] = formData.vehicleImages || [{ url: '', phase: 'Avant' }];

  const handleImageAdd = (url: string) => {
    if (vehicleImages[vehicleImages.length - 1]?.url === '') {
      // Remplacer le dernier slot vide
      const updatedImages = [...vehicleImages];
      updatedImages[updatedImages.length - 1] = { url, phase: 'Avant' };
      onVehicleImagesUpdate(updatedImages);
    } else {
      // Ajouter une nouvelle image
      onVehicleImagesUpdate([...vehicleImages, { url, phase: 'Avant' }]);
    }
  };

  const handleImageRemove = (index: number) => {
    const updatedImages = vehicleImages.filter((_, i) => i !== index);
    // S'assurer qu'il y a au moins un slot vide si toutes les images sont supprimées
    if (updatedImages.length === 0) {
      onVehicleImagesUpdate([{ url: '', phase: 'Avant' }]);
    } else {
      onVehicleImagesUpdate(updatedImages);
    }
  };

  const handleImageUpdate = (index: number, url: string) => {
    const updatedImages = [...vehicleImages];
    if (!updatedImages[index]) {
      updatedImages[index] = { url, phase: 'Avant' };
    } else {
      updatedImages[index] = { ...updatedImages[index], url };
    }
    onVehicleImagesUpdate(updatedImages);
  };

  const handleImagePhaseUpdate = (index: number, phase: 'Avant' | 'Pendant' | 'Après') => {
    const updatedImages = [...vehicleImages];
    if (!updatedImages[index]) {
      updatedImages[index] = { url: '', phase };
    } else {
      updatedImages[index] = { ...updatedImages[index], phase };
    }
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
        onImagePhaseUpdate={handleImagePhaseUpdate}
      />
    </div>
  );
};

export default VehicleDocumentsForm;
