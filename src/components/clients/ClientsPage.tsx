
import React, { useState } from 'react';
import ClientsHeader from './ClientsHeader';
import ClientsTable from './ClientsTable';
import ClientDialog from '@/components/client/ClientDialog';
import { useClients } from '@/hooks/use-clients';
import { Client } from '@/services/supabase/clients';
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAuth } from '@/contexts/AuthContext';

const ClientsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { clients, isLoading, error, createClient, updateClient, deleteClient } = useClients();
  const { user } = useAuth();

  const filteredClients = clients?.filter(client => {
    const matchesSearch = 
      client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.postal_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    deleteClient.mutate(client.id);
  };

  const handleClientSubmit = (data: any) => {
    if (dialogMode === 'create') {
      createClient.mutate({
        firstName: data.firstName, 
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        company: data.company,
        driverLicenseFrontUrl: data.driverLicenseFrontUrl,
        driverLicenseBackUrl: data.driverLicenseBackUrl,
        user_id: user ? user.id : null
      });
    } else if (dialogMode === 'edit' && selectedClient) {
      updateClient.mutate({
        id: selectedClient.id, 
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
          company: data.company,
          driverLicenseFrontUrl: data.driverLicenseFrontUrl,
          driverLicenseBackUrl: data.driverLicenseBackUrl
        }
      });
    }
  };

  if (isLoading) return <TableLoading />;
  
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="page-container">
      <ClientsHeader />
      
      <ClientsTable 
        clients={filteredClients}
        onViewClient={handleViewClient}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
      />

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={
          dialogMode === 'create' 
            ? 'Ajouter un client' 
            : dialogMode === 'edit' 
            ? 'Modifier le client' 
            : 'Détails du client'
        }
        description={
          dialogMode === 'create' 
            ? 'Saisissez les informations du nouveau client.'
            : dialogMode === 'edit'
            ? 'Modifiez les informations du client.'
            : ''
        }
        defaultValues={selectedClient ? {
          id: selectedClient.id,
          firstName: selectedClient.first_name || '',
          lastName: selectedClient.last_name || '',
          email: selectedClient.email || '',
          phone: selectedClient.phone || '',
          address: selectedClient.address || '',
          city: selectedClient.city || '',
          zipCode: selectedClient.postal_code || '',
          company: (selectedClient as any).company || '',
          driverLicenseFrontUrl: (selectedClient as any).driver_license_front_url || '',
          driverLicenseBackUrl: (selectedClient as any).driver_license_back_url || '',
        } : {}}
        onSubmit={handleClientSubmit}
        mode={dialogMode}
      />
    </div>
  );
};

export default ClientsPage;
