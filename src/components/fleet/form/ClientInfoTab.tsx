
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="client" className="text-destructive">Client *</Label>
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
          <Label htmlFor="startDate" className="text-destructive">Date de début *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={onInputChange}
            required
            disabled={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedReturnDate" className="text-destructive">Date de fin *</Label>
          <Input
            id="expectedReturnDate"
            name="expectedReturnDate"
            type="date"
            value={formData.expectedReturnDate}
            onChange={onInputChange}
            required
            disabled={isViewMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-destructive">Permis de conduire (Recto) *</Label>
          <DocumentUploader
            documentType="license"
            documentId={`${formData.clientId || 'new'}-front`}
            currentDocumentUrl={formData.driverLicenseFrontUrl}
            onUploadComplete={onDriverLicenseFrontUpload}
            isViewMode={isViewMode}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-destructive">Permis de conduire (Verso) *</Label>
          <DocumentUploader
            documentType="license"
            documentId={`${formData.clientId || 'new'}-back`}
            currentDocumentUrl={formData.driverLicenseBackUrl}
            onUploadComplete={onDriverLicenseBackUpload}
            isViewMode={isViewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoTab;
