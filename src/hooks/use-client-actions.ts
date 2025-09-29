
import { useState } from 'react';
import { useClients } from '@/hooks/use-clients';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyId } from '@/hooks/use-company-id';
import { Client } from '@/services/supabase/clients';
import { sendDocumentsRequest } from '@/services/documentsRequestService';
import { supabase } from '@/integrations/supabase/client';

export const useClientActions = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // États pour les nouveaux dialogues
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [interventionDialogOpen, setInterventionDialogOpen] = useState(false);
  const [selectedClientForDocument, setSelectedClientForDocument] = useState<Client | null>(null);
  
  const { createClient, updateClient, deleteClient } = useClients();
  const { user } = useAuth();
  const { companyId } = useCompanyId();

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setDialogMode('create');
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
    console.log('Opening quote dialog for client:', client);
    setSelectedClientForDocument(client);
    setQuoteDialogOpen(true);
  };

  const handleCreateInvoice = (client: Client) => {
    console.log('=== HANDLE CREATE INVOICE ===');
    console.log('Opening invoice dialog for client:', client);
    console.log('Current invoiceDialogOpen state:', invoiceDialogOpen);
    console.log('setInvoiceDialogOpen function:', typeof setInvoiceDialogOpen);
    setSelectedClientForDocument(client);
    setInvoiceDialogOpen(true);
    console.log('Invoice dialog state should now be true');
  };

  const handleCreateCredit = (client: Client) => {
    console.log('Opening credit dialog for client:', client);
    setSelectedClientForDocument(client);
    setCreditDialogOpen(true);
  };

  const handleCreateIntervention = (client: Client) => {
    console.log('Opening intervention dialog for client:', client);
    setSelectedClientForDocument(client);
    setInterventionDialogOpen(true);
  };

  const handleRequestDocuments = async (client: Client) => {
    try {
      await sendDocumentsRequest(client.id, companyId);
    } catch (error) {
      // L'erreur est déjà gérée dans le service
      console.error('Erreur lors de la demande de documents:', error);
    }
  };

  const checkClientHasVehicle = async (clientId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('id')
        .eq('client_id', clientId)
        .limit(1)
        .single();
      
      return !error && !!data;
    } catch {
      return false;
    }
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
        autoRelancesDisabled: data.autoRelancesDisabled,
        company_id: companyId
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
          driverLicenseBackUrl: data.driverLicenseBackUrl,
          autoRelancesDisabled: data.autoRelancesDisabled
        }
      });
    }
  };

  return {
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
    handleClientSubmit,
    checkClientHasVehicle
  };
};
