
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
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  clientId,
  formData,
  handleDriverLicenseFrontUpload,
  handleDriverLicenseBackUpload
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Permis de conduire (Recto)</Label>
        <DocumentUploader
          documentType="driver-license"
          documentId={`${clientId}-front`}
          currentDocumentUrl={formData.driverLicenseFrontUrl}
          onUploadComplete={handleDriverLicenseFrontUpload}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Permis de conduire (Verso)</Label>
        <DocumentUploader
          documentType="driver-license"
          documentId={`${clientId}-back`}
          currentDocumentUrl={formData.driverLicenseBackUrl}
          onUploadComplete={handleDriverLicenseBackUpload}
        />
      </div>
    </div>
  );
};

export default DocumentsTab;
