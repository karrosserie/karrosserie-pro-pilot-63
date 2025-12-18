import React from 'react';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '@/components/shared/DocumentUploader';

interface DocumentsTabProps {
  clientId: string;
  formData: {
    driverLicenseFrontUrl: string;
    driverLicenseBackUrl: string;
    managerIdFrontUrl?: string;
    managerIdBackUrl?: string;
    kbisUrl?: string;
  };
  clientType?: 'particulier' | 'entreprise';
  handleDriverLicenseFrontUpload: (url: string) => void;
  handleDriverLicenseBackUpload: (url: string) => void;
  handleDriverLicenseFrontDelete?: () => void;
  handleDriverLicenseBackDelete?: () => void;
  handleManagerIdFrontUpload?: (url: string) => void;
  handleManagerIdFrontDelete?: () => void;
  handleManagerIdBackUpload?: (url: string) => void;
  handleManagerIdBackDelete?: () => void;
  handleKbisUpload?: (url: string) => void;
  handleKbisDelete?: () => void;
  isViewMode?: boolean;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  clientId,
  formData,
  clientType = 'particulier',
  handleDriverLicenseFrontUpload,
  handleDriverLicenseBackUpload,
  handleDriverLicenseFrontDelete,
  handleDriverLicenseBackDelete,
  handleManagerIdFrontUpload,
  handleManagerIdFrontDelete,
  handleManagerIdBackUpload,
  handleManagerIdBackDelete,
  handleKbisUpload,
  handleKbisDelete,
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

  const isEnterprise = clientType === 'entreprise';

  return (
    <div className="space-y-6">
      {isEnterprise ? (
        <>
          {/* Documents entreprise */}
          <div className="space-y-2">
            <Label>CNI du Gérant (Recto)</Label>
            <DocumentUploader
              documentType="driver-license"
              documentId={`${clientId}-manager-id-front`}
              currentDocumentUrl={formData.managerIdFrontUrl || ''}
              onUploadComplete={handleManagerIdFrontUpload || (() => {})}
              onDelete={handleManagerIdFrontDelete || (() => {})}
              isViewMode={isViewMode}
              allowDeleteInViewMode={true}
            />
          </div>
          
          <div className="space-y-2">
            <Label>CNI du Gérant (Verso)</Label>
            <DocumentUploader
              documentType="driver-license"
              documentId={`${clientId}-manager-id-back`}
              currentDocumentUrl={formData.managerIdBackUrl || ''}
              onUploadComplete={handleManagerIdBackUpload || (() => {})}
              onDelete={handleManagerIdBackDelete || (() => {})}
              isViewMode={isViewMode}
              allowDeleteInViewMode={true}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Extrait Kbis</Label>
            <DocumentUploader
              documentType="driver-license"
              documentId={`${clientId}-kbis`}
              currentDocumentUrl={formData.kbisUrl || ''}
              onUploadComplete={handleKbisUpload || (() => {})}
              onDelete={handleKbisDelete || (() => {})}
              isViewMode={isViewMode}
              allowDeleteInViewMode={true}
            />
          </div>
        </>
      ) : (
        <>
          {/* Documents particulier */}
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
        </>
      )}
    </div>
  );
};

export default DocumentsTab;
