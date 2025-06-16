
import React, { useState, useMemo } from 'react';
import ClientListHeader from './ClientListHeader';
import ClientListTable from './ClientListTable';
import ClientDialog from './ClientDialog';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { useClients } from '@/hooks/use-clients';
import { Client } from '@/services/supabase/clients';
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { useAuth } from '@/contexts/AuthContext';

const ClientList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour les nouveaux dialogues
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [selectedClientForDocument, setSelectedClientForDocument] = useState<Client | null>(null);
  
  const { clients, isLoading, error, createClient, updateClient, deleteClient } = useClients();
  const { user } = useAuth();

  // Filtrer les clients en fonction de la recherche
  const filteredClients = useMemo(() => {
    if (!clients || !searchQuery) return clients;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    return clients.filter(client => {
      return (
        client.first_name?.toLowerCase().includes(lowercaseQuery) ||
        client.last_name?.toLowerCase().includes(lowercaseQuery) ||
        client.email?.toLowerCase().includes(lowercaseQuery) ||
        client.phone?.toLowerCase().includes(lowercaseQuery) ||
        client.address?.toLowerCase().includes(lowercaseQuery) ||
        client.city?.toLowerCase().includes(lowercaseQuery) ||
        client.postal_code?.toLowerCase().includes(lowercaseQuery)
      );
    });
  }, [clients, searchQuery]);

  const handleCreateClient = () => {
    setSelectedClient(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

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

  // Nouveaux handlers pour les documents
  const handleCreateQuote = (client: Client) => {
    setSelectedClientForDocument(client);
    setQuoteDialogOpen(true);
  };

  const handleCreateInvoice = (client: Client) => {
    setSelectedClientForDocument(client);
    setInvoiceDialogOpen(true);
  };

  const handleCreateCredit = (client: Client) => {
    setSelectedClientForDocument(client);
    setCreditDialogOpen(true);
  };

  const handleClientSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    
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
    <div className="card-container animate-fade-in">
      <ClientListHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClient={handleCreateClient}
      />
      
      <ClientListTable 
        clients={filteredClients || []}
        onViewClient={handleViewClient}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
        onCreateQuote={handleCreateQuote}
        onCreateInvoice={handleCreateInvoice}
        onCreateCredit={handleCreateCredit}
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

      {/* Dialogue de création de devis */}
      <QuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        quote={{
          client_id: selectedClientForDocument?.id || '',
          clients: selectedClientForDocument ? {
            id: selectedClientForDocument.id,
            first_name: selectedClientForDocument.first_name,
            last_name: selectedClientForDocument.last_name
          } : null
        } as any}
      />

      {/* Dialogue de création de facture */}
      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoice={{
          client_id: selectedClientForDocument?.id || '',
          clients: selectedClientForDocument ? {
            id: selectedClientForDocument.id,
            first_name: selectedClientForDocument.first_name,
            last_name: selectedClientForDocument.last_name
          } : null
        } as any}
      />

      {/* Dialogue de création d'avoir */}
      <CreditDialog
        open={creditDialogOpen}
        onOpenChange={setCreditDialogOpen}
      />
    </div>
  );
};

export default ClientList;
