
import React from 'react';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '@/components/shared/DocumentUploader';

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
}

const VehicleDocumentsForm: React.FC<VehicleDocumentsFormProps> = ({
  formData,
  isViewMode,
  onRegistrationFrontUpload,
  onRegistrationBackUpload,
  onVehicleImageUpload
}) => {
  const vehicleId = formData.id || 'new-vehicle';

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

      <div className="space-y-2">
        <Label>Photo du véhicule</Label>
        <DocumentUploader
          documentType="vehicle-image"
          documentId={vehicleId}
          currentDocumentUrl={formData.vehicleImageUrl}
          onUploadComplete={onVehicleImageUpload}
          isViewMode={isViewMode}
        />
      </div>
    </div>
  );
};

export default VehicleDocumentsForm;
