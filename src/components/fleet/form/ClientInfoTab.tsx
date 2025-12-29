import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { LoanFormData } from '../FleetLoanForm';
import { DocumentUploader } from '@/components/shared/DocumentUploader';
import { format, parse } from 'date-fns';
import { useClient, useClients } from '@/hooks/use-clients';

interface ClientInfoTabProps {
  formData: LoanFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClientSelect: (clientId: string) => void;
  onQuoteSelect: (quoteId: string) => void;
  onFreeTextClientChange: (name: string) => void;
  onNewClientClick: () => void;
  onDriverLicenseFrontUpload: (url: string) => void;
  onDriverLicenseBackUpload: (url: string) => void;
  onLicenseAnalyzed: (data: { 
    first_name?: string; 
    last_name?: string; 
    date_of_birth?: string;
    license_number?: string;
    license_issue_date?: string;
    place_of_birth?: string;
    prefecture?: string;
  }) => void;
  isViewMode?: boolean;
}

const ClientInfoTab: React.FC<ClientInfoTabProps> = ({
  formData,
  onInputChange,
  onClientSelect,
  onFreeTextClientChange,
  onNewClientClick,
  onDriverLicenseFrontUpload,
  onDriverLicenseBackUpload,
  onLicenseAnalyzed,
  isViewMode = false
}) => {
  const [useExistingClient, setUseExistingClient] = useState(!!formData.clientId);
  const { client: clientData, isLoading: isLoadingClient } = useClient(formData.clientId);
  const { clients } = useClients();

  // Prepare options for SearchableSelect
  const clientOptions = clients?.map(client => ({
    value: client.id,
    label: client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim()
  })) || [];
  
  // Synchronize useExistingClient with formData.clientId
  useEffect(() => {
    if (formData.clientId) {
      setUseExistingClient(true);
    }
  }, [formData.clientId]);

  // Extract display name from client data or form data
  const getDisplayClientName = () => {
    if (clientData) {
      return clientData.company_name || 
        `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim();
    }
    return formData.clientName || '';
  };

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFreeTextClientChange(e.target.value);
  };

  const handleDriverLicenseFrontUpload = (url: string, analysisResult?: any) => {
    onDriverLicenseFrontUpload(url);
    
    if (analysisResult) {
      const extractedData: { 
        first_name?: string; 
        last_name?: string; 
        date_of_birth?: string;
        license_number?: string;
        license_issue_date?: string;
        place_of_birth?: string;
        prefecture?: string;
      } = {};
      
      if (analysisResult.first_name) extractedData.first_name = analysisResult.first_name;
      if (analysisResult.last_name) extractedData.last_name = analysisResult.last_name;
      if (analysisResult.date_of_birth) {
        try {
          const parsedDate = parse(analysisResult.date_of_birth, 'dd/MM/yyyy', new Date());
          extractedData.date_of_birth = format(parsedDate, 'yyyy-MM-dd');
        } catch (e) {
          console.log('Could not parse date of birth:', analysisResult.date_of_birth);
        }
      }
      if (analysisResult.license_number) extractedData.license_number = analysisResult.license_number;
      if (analysisResult.issue_date) {
        try {
          const parsedDate = parse(analysisResult.issue_date, 'dd/MM/yyyy', new Date());
          extractedData.license_issue_date = format(parsedDate, 'yyyy-MM-dd');
        } catch (e) {
          console.log('Could not parse issue date:', analysisResult.issue_date);
        }
      }
      if (analysisResult.place_of_birth) extractedData.place_of_birth = analysisResult.place_of_birth;
      if (analysisResult.prefecture) extractedData.prefecture = analysisResult.prefecture;
      
      if (Object.keys(extractedData).length > 0) {
        onLicenseAnalyzed(extractedData);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Client Selection Section */}
      <div className="space-y-3 sm:space-y-4" data-tour="client-selection">
        <Label className="text-sm sm:text-base font-medium">
          Client <span className="text-destructive">*</span>
        </Label>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={useExistingClient ? "default" : "outline"}
              size="sm"
              onClick={() => setUseExistingClient(true)}
              disabled={isViewMode}
              className="flex-1 sm:flex-none"
            >
              Client existant
            </Button>
            <Button
              type="button"
              variant={!useExistingClient ? "default" : "outline"}
              size="sm"
              onClick={() => setUseExistingClient(false)}
              disabled={isViewMode}
              className="flex-1 sm:flex-none"
            >
              Nouveau conducteur
            </Button>
          </div>

          {useExistingClient && !isViewMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onNewClientClick}
              className="w-full sm:w-auto"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Créer un client
            </Button>
          )}
        </div>

        {useExistingClient ? (
          <div className="w-full">
            <SearchableSelect
              options={clientOptions}
              value={formData.clientId || ''}
              onValueChange={onClientSelect}
              placeholder="Rechercher un client..."
              disabled={isViewMode}
              showNewClientOption={!isViewMode}
              onNewClientClick={onNewClientClick}
              allowFreeText
              onFreeTextChange={onFreeTextClientChange}
            />
          </div>
        ) : (
          <Input
            value={formData.clientName || ''}
            onChange={handleClientNameChange}
            placeholder="Nom du conducteur"
            disabled={isViewMode}
          />
        )}
      </div>

      {/* Client Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName" className="text-sm">Nom complet</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientPhone" className="text-sm">Téléphone</Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="clientEmail" className="text-sm">Email</Label>
          <Input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>

      {/* Driver's License Section */}
      <div className="space-y-3 sm:space-y-4 pt-4 border-t border-border" data-tour="driver-license">
        <h3 className="text-base sm:text-lg font-medium">Permis de conduire</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Recto du permis</Label>
            <DocumentUploader
              documentType="driver-license"
              documentId={`${formData.clientId || 'new'}-front`}
              currentDocumentUrl={formData.driverLicenseFrontUrl}
              onUploadComplete={onDriverLicenseFrontUpload}
              onAnalysisComplete={(data) => {
                if (data) {
                  const extractedData: any = {};
                  if (data.first_name) extractedData.first_name = data.first_name;
                  if (data.last_name) extractedData.last_name = data.last_name;
                  if (data.date_of_birth) extractedData.date_of_birth = data.date_of_birth;
                  if (data.license_number) extractedData.license_number = data.license_number;
                  if (data.issue_date) extractedData.license_issue_date = data.issue_date;
                  if (data.place_of_birth) extractedData.place_of_birth = data.place_of_birth;
                  if (data.prefecture) extractedData.prefecture = data.prefecture;
                  if (Object.keys(extractedData).length > 0) {
                    onLicenseAnalyzed(extractedData);
                  }
                }
              }}
              isViewMode={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Verso du permis</Label>
            <DocumentUploader
              documentType="driver-license"
              documentId={`${formData.clientId || 'new'}-back`}
              currentDocumentUrl={formData.driverLicenseBackUrl}
              onUploadComplete={onDriverLicenseBackUpload}
              isViewMode={isViewMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="licenseNumber" className="text-sm">Numéro de permis</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseIssueDate" className="text-sm">Date de délivrance</Label>
            <Input
              id="licenseIssueDate"
              name="licenseIssueDate"
              type="date"
              value={formData.licenseIssueDate || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm">Date de naissance</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeOfBirth" className="text-sm">Lieu de naissance</Label>
            <Input
              id="placeOfBirth"
              name="placeOfBirth"
              value={formData.placeOfBirth || ''}
              onChange={onInputChange}
              disabled={isViewMode}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prefecture" className="text-sm">Préfecture</Label>
          <Input
            id="prefecture"
            name="prefecture"
            value={formData.prefecture || ''}
            onChange={onInputChange}
            disabled={isViewMode}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoTab;
