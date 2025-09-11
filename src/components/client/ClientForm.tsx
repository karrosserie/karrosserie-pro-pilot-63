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
}

const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  defaultValues = {},
  isViewMode = false,
  onCancel
}) => {
  const { error } = useNotification();
  const [formData, setFormData] = useState({
    firstName: defaultValues?.firstName || '',
    lastName: defaultValues?.lastName || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    address: defaultValues?.address || '',
    city: defaultValues?.city || '',
    zipCode: defaultValues?.zipCode || '',
    company: defaultValues?.company || '',
    driverLicenseFrontUrl: defaultValues?.driverLicenseFrontUrl || '',
    driverLicenseBackUrl: defaultValues?.driverLicenseBackUrl || '',
    autoRelancesDisabled: defaultValues?.autoRelancesDisabled || false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
  };

  const handleDriverLicenseFrontUpload = (url: string) => {
    setFormData(prev => ({ ...prev, driverLicenseFrontUrl: url }));
  };

  const handleDriverLicenseBackUpload = (url: string) => {
    setFormData(prev => ({ ...prev, driverLicenseBackUrl: url }));
  };

  const handleDriverLicenseFrontDelete = () => {
    setFormData(prev => ({ ...prev, driverLicenseFrontUrl: '' }));
  };

  const handleDriverLicenseBackDelete = () => {
    setFormData(prev => ({ ...prev, driverLicenseBackUrl: '' }));
  };

  const handleAutoRelancesToggle = (checked: boolean) => {
    setFormData(prev => ({ ...prev, autoRelancesDisabled: !checked }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'zipCode'];
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        error(`Le champ ${getFieldLabel(field)} est obligatoire.`, 'Champ manquant');
        return false;
      }
    }
    return true;
  };

  const getFieldLabel = (field: string) => {
    const labels = {
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      zipCode: 'Code postal'
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
            handleAutoRelancesToggle={handleAutoRelancesToggle}
            isViewMode={isViewMode}
          />
        </TabsContent>
        
        <TabsContent value="documents">
          <DocumentsTab
            clientId={clientId}
            formData={formData}
            handleDriverLicenseFrontUpload={handleDriverLicenseFrontUpload}
            handleDriverLicenseBackUpload={handleDriverLicenseBackUpload}
            handleDriverLicenseFrontDelete={handleDriverLicenseFrontDelete}
            handleDriverLicenseBackDelete={handleDriverLicenseBackDelete}
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
