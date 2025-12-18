import React from 'react';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '@/components/shared/DocumentUploader';

interface DocumentsTabProps {
  clientId: string;
  formData: {
    driverLicenseFrontUrl: string;
    driverLicenseBackUrl: string;
    managerIdUrl?: string;
    kbisUrl?: string;
  };
  clientType?: 'particulier' | 'entreprise';
  handleDriverLicenseFrontUpload: (url: string) => void;
  handleDriverLicenseBackUpload: (url: string) => void;
  handleDriverLicenseFrontDelete?: () => void;
  handleDriverLicenseBackDelete?: () => void;
  handleManagerIdUpload?: (url: string) => void;
  handleManagerIdDelete?: () => void;
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
  handleManagerIdUpload,
  handleManagerIdDelete,
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
            <Label>CNI du Gérant</Label>
            <DocumentUploader
              documentType="driver-license"
              documentId={`${clientId}-manager-id`}
              currentDocumentUrl={formData.managerIdUrl || ''}
              onUploadComplete={handleManagerIdUpload || (() => {})}
              onDelete={handleManagerIdDelete || (() => {})}
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
