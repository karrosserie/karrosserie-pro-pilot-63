
import React from 'react';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '@/components/shared/DocumentUploader';

interface DocumentsTabProps {
  clientId: string;
  formData: {
    driverLicenseFrontUrl: string;
    driverLicenseBackUrl: string;
    idCardFrontUrl: string;
    idCardBackUrl: string;
  };
  handleDriverLicenseFrontUpload: (url: string) => void;
  handleDriverLicenseBackUpload: (url: string) => void;
  handleIdCardFrontUpload: (url: string) => void;
  handleIdCardBackUpload: (url: string) => void;
  isViewMode?: boolean;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  clientId,
  formData,
  handleDriverLicenseFrontUpload,
  handleDriverLicenseBackUpload,
  handleIdCardFrontUpload,
  handleIdCardBackUpload,
  isViewMode = false
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
          isViewMode={isViewMode}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Permis de conduire (Verso)</Label>
        <DocumentUploader
          documentType="driver-license"
          documentId={`${clientId}-back`}
          currentDocumentUrl={formData.driverLicenseBackUrl}
          onUploadComplete={handleDriverLicenseBackUpload}
          isViewMode={isViewMode}
        />
      </div>

      <div className="space-y-2">
        <Label>Carte d'identité nationale (Recto)</Label>
        <DocumentUploader
          documentType="id-card"
          documentId={`${clientId}-id-front`}
          currentDocumentUrl={formData.idCardFrontUrl}
          onUploadComplete={handleIdCardFrontUpload}
          isViewMode={isViewMode}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Carte d'identité nationale (Verso)</Label>
        <DocumentUploader
          documentType="id-card"
          documentId={`${clientId}-id-back`}
          currentDocumentUrl={formData.idCardBackUrl}
          onUploadComplete={handleIdCardBackUpload}
          isViewMode={isViewMode}
        />
      </div>
    </div>
  );
};

export default DocumentsTab;
