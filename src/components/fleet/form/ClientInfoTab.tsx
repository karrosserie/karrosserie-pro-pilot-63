
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { useClients } from '@/hooks/use-clients';
import { LoanFormData } from '../FleetLoanForm';

interface ClientInfoTabProps {
  formData: LoanFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClientSelect: (clientId: string) => void;
  onDriverLicenseFrontUpload: (url: string) => void;
  onDriverLicenseBackUpload: (url: string) => void;
  isViewMode?: boolean;
}

const ClientInfoTab: React.FC<ClientInfoTabProps> = ({
  formData,
  onInputChange,
  onClientSelect,
  onDriverLicenseFrontUpload,
  onDriverLicenseBackUpload,
  isViewMode = false
}) => {
  const { clients } = useClients();

  const clientOptions = (clients || []).map(client => ({
    value: client.id,
    label: `${client.firstName} ${client.lastName}`
  }));

  // Validation des dates
  const validateEndDate = (endDate: string, startDate: string) => {
    if (!endDate || !startDate) return true;
    return new Date(endDate) > new Date(startDate);
  };

  return (
    <div className="space-y-6">
      {/* Client, Start Date, and End Date on the same line */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="col-span-3 space-y-2">
          <Label htmlFor="client">
            Client <span className="text-destructive">*</span>
          </Label>
          <SearchableSelect
            options={clientOptions}
            value={formData.clientId}
            onValueChange={onClientSelect}
            placeholder="Sélectionner un client"
            disabled={isViewMode}
            searchPlaceholder="Rechercher un client..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">
            Date de début <span className="text-destructive">*</span>
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={onInputChange}
            required
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedReturnDate">
            Date de fin <span className="text-destructive">*</span>
          </Label>
          <Input
            id="expectedReturnDate"
            name="expectedReturnDate"
            type="datetime-local"
            value={formData.expectedReturnDate}
            onChange={onInputChange}
            required
            disabled={isViewMode}
            className={!validateEndDate(formData.expectedReturnDate, formData.startDate) ? 'border-red-500' : ''}
          />
          {!validateEndDate(formData.expectedReturnDate, formData.startDate) && formData.expectedReturnDate && formData.startDate && (
            <p className="text-sm text-red-500">La date de fin doit être supérieure à la date de début</p>
          )}
        </div>
      </div>

      {/* Driver's License Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>
            Permis de conduire (Recto) <span className="text-destructive">*</span>
          </Label>
          <DocumentUploader
            documentType="license"
            documentId={`${formData.clientId || 'new'}-front`}
            currentDocumentUrl={formData.driverLicenseFrontUrl}
            onUploadComplete={onDriverLicenseFrontUpload}
            isViewMode={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Permis de conduire (Verso) <span className="text-destructive">*</span>
          </Label>
          <DocumentUploader
            documentType="license"
            documentId={`${formData.clientId || 'new'}-back`}
            currentDocumentUrl={formData.driverLicenseBackUrl}
            onUploadComplete={onDriverLicenseBackUpload}
            isViewMode={isViewMode}
          />
        </div>
      </div>

      {/* License Details - First row: License Number, Issue Date, Prefecture */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="col-span-3 space-y-2">
          <Label htmlFor="licenseNumber">
            Numéro de permis <span className="text-destructive">*</span>
          </Label>
          <Input
            id="licenseNumber"
            name="licenseNumber"
            value={formData.licenseNumber || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseIssueDate">
            Date de délivrance <span className="text-destructive">*</span>
          </Label>
          <Input
            id="licenseIssueDate"
            name="licenseIssueDate"
            type="date"
            value={formData.licenseIssueDate || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="prefecture">
            Préfecture (N° Département) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="prefecture"
            name="prefecture"
            value={formData.prefecture || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            placeholder="Ex: 75, 33, 69..."
            required
          />
        </div>
      </div>

      {/* License Details - Second row: Holder Info, Date of Birth, Place of Birth */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="col-span-3 space-y-2">
          <Label htmlFor="holderInfo">
            Information titulaire <span className="text-destructive">*</span>
          </Label>
          <Input
            id="holderInfo"
            name="holderInfo"
            value={formData.holderInfo || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date de naissance <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="placeOfBirth">
            Lieu de naissance <span className="text-destructive">*</span>
          </Label>
          <Input
            id="placeOfBirth"
            name="placeOfBirth"
            value={formData.placeOfBirth || ''}
            onChange={onInputChange}
            disabled={isViewMode}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoTab;
