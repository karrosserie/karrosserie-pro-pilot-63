import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotification } from '@/hooks/use-notification';
import PersonalInfoTab from './form/PersonalInfoTab';
import DocumentsTab from './form/DocumentsTab';
import ClientFormActions from './form/ClientFormActions';

interface ClientFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isViewMode?: boolean;
  onCancel: () => void;
  onFormChange?: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  defaultValues = {},
  isViewMode = false,
  onCancel,
  onFormChange
}) => {
  const { error } = useNotification();
  const [phoneIsValid, setPhoneIsValid] = useState(true);
  const [formData, setFormData] = useState({
    clientType: defaultValues?.clientType || 'particulier',
    firstName: defaultValues?.firstName || '',
    lastName: defaultValues?.lastName || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    address: defaultValues?.address || '',
    city: defaultValues?.city || '',
    zipCode: defaultValues?.zipCode || '',
    company: defaultValues?.company || '',
    companyName: defaultValues?.companyName || '',
    driverLicenseFrontUrl: defaultValues?.driverLicenseFrontUrl || '',
    driverLicenseBackUrl: defaultValues?.driverLicenseBackUrl || '',
    managerIdUrl: defaultValues?.managerIdUrl || '',
    kbisUrl: defaultValues?.kbisUrl || '',
    autoRelancesDisabled: defaultValues?.autoRelancesDisabled ?? false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    onFormChange?.();
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
    onFormChange?.();
  };

  const handlePhoneValidationChange = (isValid: boolean) => {
    setPhoneIsValid(isValid);
  };

  const handleClientTypeChange = (type: 'particulier' | 'entreprise') => {
    setFormData(prev => ({ ...prev, clientType: type }));
    onFormChange?.();
  };

  const handleDriverLicenseFrontUpload = (url: string) => {
    setFormData(prev => ({ ...prev, driverLicenseFrontUrl: url }));
    onFormChange?.();
  };

  const handleDriverLicenseBackUpload = (url: string) => {
    setFormData(prev => ({ ...prev, driverLicenseBackUrl: url }));
    onFormChange?.();
  };

  const handleDriverLicenseFrontDelete = () => {
    setFormData(prev => ({ ...prev, driverLicenseFrontUrl: '' }));
    onFormChange?.();
  };

  const handleDriverLicenseBackDelete = () => {
    setFormData(prev => ({ ...prev, driverLicenseBackUrl: '' }));
    onFormChange?.();
  };

  const handleManagerIdUpload = (url: string) => {
    setFormData(prev => ({ ...prev, managerIdUrl: url }));
    onFormChange?.();
  };

  const handleManagerIdDelete = () => {
    setFormData(prev => ({ ...prev, managerIdUrl: '' }));
    onFormChange?.();
  };

  const handleKbisUpload = (url: string) => {
    setFormData(prev => ({ ...prev, kbisUrl: url }));
    onFormChange?.();
  };

  const handleKbisDelete = () => {
    setFormData(prev => ({ ...prev, kbisUrl: '' }));
    onFormChange?.();
  };

  const handleAutoRelancesToggle = (checked: boolean) => {
    const newValue = !checked;
    setFormData(prev => ({ ...prev, autoRelancesDisabled: newValue }));
    onFormChange?.();
  };

  const validateForm = () => {
    const isEnterprise = formData.clientType === 'entreprise';
    
    // Champs obligatoires communs
    const commonRequiredFields = ['phone', 'address', 'city', 'zipCode'];
    
    // Champs obligatoires spécifiques au type
    const requiredFields = isEnterprise 
      ? [...commonRequiredFields, 'firstName', 'lastName', 'companyName']
      : [...commonRequiredFields, 'firstName', 'lastName'];
    
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        error(`Le champ ${getFieldLabel(field, isEnterprise)} est obligatoire.`, 'Champ manquant');
        return false;
      }
    }
    
    // Vérification spécifique du format du téléphone français
    if (!phoneIsValid) {
      error('Le numéro de téléphone français doit comporter 9 chiffres et commencer par 6 ou 7 (ex: 6 12 34 56 78).', 'Téléphone invalide');
      return false;
    }
    
    return true;
  };

  const getFieldLabel = (field: string, isEnterprise: boolean = false) => {
    const labels: Record<string, string> = {
      firstName: isEnterprise ? 'Prénom du Gérant' : 'Prénom',
      lastName: isEnterprise ? 'Nom du Gérant' : 'Nom',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      zipCode: 'Code postal',
      companyName: 'Raison Sociale'
    };
    return labels[field] || field;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isViewMode && !validateForm()) {
      return;
    }
    onSubmit(formData);
  };

  // Generate unique document IDs for this client
  const clientId = defaultValues?.id || `new-client-${Date.now()}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 w-full">
          <TabsTrigger value="info" className="text-sm">Informations personnelles</TabsTrigger>
          <TabsTrigger value="documents" className="text-sm">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <PersonalInfoTab 
            formData={formData} 
            handleChange={handleChange}
            handlePhoneChange={handlePhoneChange}
            handlePhoneValidationChange={handlePhoneValidationChange}
            handleAutoRelancesToggle={handleAutoRelancesToggle}
            handleClientTypeChange={handleClientTypeChange}
            isViewMode={isViewMode}
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsTab
            clientId={clientId}
            formData={formData}
            clientType={formData.clientType}
            handleDriverLicenseFrontUpload={handleDriverLicenseFrontUpload}
            handleDriverLicenseBackUpload={handleDriverLicenseBackUpload}
            handleDriverLicenseFrontDelete={handleDriverLicenseFrontDelete}
            handleDriverLicenseBackDelete={handleDriverLicenseBackDelete}
            handleManagerIdUpload={handleManagerIdUpload}
            handleManagerIdDelete={handleManagerIdDelete}
            handleKbisUpload={handleKbisUpload}
            handleKbisDelete={handleKbisDelete}
            isViewMode={isViewMode}
          />
        </TabsContent>
      </Tabs>
      
      <ClientFormActions 
        isViewMode={isViewMode}
        onCancel={onCancel}
        hasId={!!defaultValues?.id}
      />
    </form>
  );
};

export default ClientForm;
