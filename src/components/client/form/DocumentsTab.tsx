
import React from 'react';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '@/components/shared/DocumentUploader';

interface DocumentsTabProps {
  clientId: string;
  formData: {
    driverLicenseFrontUrl: string;
    driverLicenseBackUrl: string;
  };
  handleDriverLicenseFrontUpload: (url: string) => void;
  handleDriverLicenseBackUpload: (url: string) => void;
  handleDriverLicenseFrontDelete?: () => void;
  handleDriverLicenseBackDelete?: () => void;
  isViewMode?: boolean;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  clientId,
  formData,
  handleDriverLicenseFrontUpload,
  handleDriverLicenseBackUpload,
  handleDriverLicenseFrontDelete,
  handleDriverLicenseBackDelete,
  isViewMode = false
}) => {
  const handleFrontDelete = () => {
    if (handleDriverLicenseFrontDelete) {
      handleDriverLicenseFrontDelete();
    }
  };

  const handleBackDelete = () => {
    if (handleDriverLicenseBackDelete) {
      handleDriverLicenseBackDelete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Permis de conduire (Recto)</Label>
        <DocumentUploader
          documentType="driver-license"
          documentId={`${clientId}-front`}
          currentDocumentUrl={formData.driverLicenseFrontUrl}
          onUploadComplete={handleDriverLicenseFrontUpload}
          onDelete={handleFrontDelete}
          isViewMode={isViewMode}
          allowDeleteInViewMode={true}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Permis de conduire (Verso)</Label>
        <DocumentUploader
          documentType="driver-license"
          documentId={`${clientId}-back`}
          currentDocumentUrl={formData.driverLicenseBackUrl}
          onUploadComplete={handleDriverLicenseBackUpload}
          onDelete={handleBackDelete}
          isViewMode={isViewMode}
          allowDeleteInViewMode={true}
        />
      </div>
    </div>
  );
};

export default DocumentsTab;
