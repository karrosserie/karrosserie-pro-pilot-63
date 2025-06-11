
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DocumentUploader } from '@/components/shared/DocumentUploader';

interface DocumentsTabProps {
  vehicleId: string;
  registrationFrontUrl: string;
  registrationBackUrl: string;
  insuranceCardUrl: string;
  onRegistrationFrontUpload: (url: string) => void;
  onRegistrationBackUpload: (url: string) => void;
  onInsuranceCardUpload: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isViewMode?: boolean;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  vehicleId,
  registrationFrontUrl,
  registrationBackUrl,
  insuranceCardUrl,
  onRegistrationFrontUpload,
  onRegistrationBackUpload,
  onInsuranceCardUpload,
  onSubmit,
  onCancel,
  isViewMode = false
}) => {
  const isFormValid = registrationFrontUrl && registrationBackUrl && insuranceCardUrl;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Certificat d'immatriculation (Recto) *</Label>
          <DocumentUploader
            documentType="registration"
            documentId={`${vehicleId}-front`}
            currentDocumentUrl={registrationFrontUrl}
            onUploadComplete={onRegistrationFrontUpload}
            isViewMode={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label>Certificat d'immatriculation (Verso) *</Label>
          <DocumentUploader
            documentType="registration"
            documentId={`${vehicleId}-back`}
            currentDocumentUrl={registrationBackUrl}
            onUploadComplete={onRegistrationBackUpload}
            isViewMode={isViewMode}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <Label>Carte verte d'assurance *</Label>
          <DocumentUploader
            documentType="insurance"
            documentId={`${vehicleId}-insurance`}
            currentDocumentUrl={insuranceCardUrl}
            onUploadComplete={onInsuranceCardUpload}
            isViewMode={isViewMode}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isViewMode ? "Fermer" : "Annuler"}
        </Button>
        {!isViewMode && (
          <Button 
            type="submit" 
            className="btn-primary"
            onClick={onSubmit}
            disabled={!isFormValid}
          >
            Confirmer le prêt
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;
