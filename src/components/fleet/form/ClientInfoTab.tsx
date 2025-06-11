
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { LoanFormData } from '@/components/fleet/FleetLoanForm';

interface ClientInfoTabProps {
  formData: LoanFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClientSelect: (clientId: string) => void;
  onDriverLicenseFrontUpload: (url: string) => void;
  onDriverLicenseBackUpload: (url: string) => void;
  isViewMode?: boolean;
}

const ClientInfoTab: React.FC<ClientInfoTabProps> = ({
  formData,
  onInputChange,
  onDriverLicenseFrontUpload,
  onDriverLicenseBackUpload,
  isViewMode = false
}) => {
  return (
    <div className="space-y-6">
      {/* Informations client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nom du client *</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientPhone">Téléphone *</Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientEmail">Email</Label>
        <Input
          id="clientEmail"
          name="clientEmail"
          type="email"
          value={formData.clientEmail}
          onChange={onInputChange}
          disabled={isViewMode}
        />
      </div>

      {/* Dates avec heure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date et heure de début *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expectedReturnDate">Date et heure de retour prévue *</Label>
          <Input
            id="expectedReturnDate"
            name="expectedReturnDate"
            type="datetime-local"
            value={formData.expectedReturnDate}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>
      </div>

      {/* Informations permis */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Informations du permis de conduire</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Numéro de permis</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="licenseIssueDate">Date de délivrance</Label>
            <Input
              id="licenseIssueDate"
              name="licenseIssueDate"
              type="date"
              value={formData.licenseIssueDate || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prefecture">Préfecture</Label>
            <Input
              id="prefecture"
              name="prefecture"
              value={formData.prefecture || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date de naissance</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
            <Input
              id="placeOfBirth"
              name="placeOfBirth"
              value={formData.placeOfBirth || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="holderInfo">Informations du titulaire</Label>
            <Input
              id="holderInfo"
              name="holderInfo"
              value={formData.holderInfo || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
        </div>
      </div>

      {/* Upload des permis */}
      <div className="space-y-4">
        <h4 className="text-md font-medium">Documents du permis de conduire</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label required>Permis de conduire (Recto)</Label>
            <DocumentUploader
              documentType="license"
              documentId={`${formData.vehicleId}-license-front`}
              currentDocumentUrl={formData.driverLicenseFrontUrl}
              onUploadComplete={onDriverLicenseFrontUpload}
              isViewMode={isViewMode}
            />
          </div>

          <div className="space-y-2">
            <Label required>Permis de conduire (Verso)</Label>
            <DocumentUploader
              documentType="license"
              documentId={`${formData.vehicleId}-license-back`}
              currentDocumentUrl={formData.driverLicenseBackUrl}
              onUploadComplete={onDriverLicenseBackUpload}
              isViewMode={isViewMode}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={onInputChange}
          disabled={isViewMode}
          rows={3}
        />
      </div>
    </div>
  );
};

export default ClientInfoTab;
