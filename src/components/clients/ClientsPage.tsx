
import React, { useState } from 'react';
import ClientsHeader from './ClientsHeader';
import ClientsTable from './ClientsTable';
import ClientsFilters from './ClientsFilters';
import ClientDialogs from './ClientDialogs';
import { useClients } from '@/hooks/use-clients';
import { useClientActions } from '@/hooks/use-client-actions';
import { TableLoading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

const ClientsPage = () => {
  const { clients, isLoading, error } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    // Client dialog state
    dialogOpen,
    setDialogOpen,
    dialogMode,
    selectedClient,
    
    // Document dialog state
    quoteDialogOpen,
    setQuoteDialogOpen,
    invoiceDialogOpen,
    setInvoiceDialogOpen,
    creditDialogOpen,
    setCreditDialogOpen,
    interventionDialogOpen,
    setInterventionDialogOpen,
    selectedClientForDocument,
    setSelectedClientForDocument,
    
    // Action handlers
    handleViewClient,
    handleCreateClient,
    handleEditClient,
    handleDeleteClient,
    handleCreateQuote,
    handleCreateInvoice,
    handleCreateCredit,
    handleCreateIntervention,
    handleRequestDocuments,
    handleClientSubmit
  } = useClientActions();

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

  if (isLoading) return <TableLoading />;
  
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <ClientsHeader />
      
      <ClientsFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClient={handleCreateClient}
      />
      
      <ClientsTable 
        clients={filteredClients}
        onViewClient={handleViewClient}
        onEditClient={handleEditClient}
        onDeleteClient={handleDeleteClient}
        onCreateQuote={handleCreateQuote}
        onCreateInvoice={handleCreateInvoice}
        onCreateCredit={handleCreateCredit}
        onRequestDocuments={handleRequestDocuments}
      />

      <ClientDialogs
        clientDialogOpen={dialogOpen}
        setClientDialogOpen={setDialogOpen}
        dialogMode={dialogMode}
        selectedClient={selectedClient}
        onClientSubmit={handleClientSubmit}
        quoteDialogOpen={quoteDialogOpen}
        setQuoteDialogOpen={setQuoteDialogOpen}
        invoiceDialogOpen={invoiceDialogOpen}
        setInvoiceDialogOpen={setInvoiceDialogOpen}
        creditDialogOpen={creditDialogOpen}
        setCreditDialogOpen={setCreditDialogOpen}
        selectedClientForDocument={selectedClientForDocument}
        setSelectedClientForDocument={setSelectedClientForDocument}
      />
    </>
  );
};

export default ClientsPage;
