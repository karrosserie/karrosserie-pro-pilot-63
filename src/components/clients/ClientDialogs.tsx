
import React from 'react';
import ClientDialog from '@/components/client/ClientDialog';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { Client } from '@/services/supabase/clients';

interface ClientDialogsProps {
  // Client dialog props
  clientDialogOpen: boolean;
  setClientDialogOpen: (open: boolean) => void;
  dialogMode: 'create' | 'edit' | 'view';
  selectedClient: Client | null;
  onClientSubmit: (data: any) => void;

  // Document dialog props
  quoteDialogOpen: boolean;
  setQuoteDialogOpen: (open: boolean) => void;
  invoiceDialogOpen: boolean;
  setInvoiceDialogOpen: (open: boolean) => void;
  creditDialogOpen: boolean;
  setCreditDialogOpen: (open: boolean) => void;
  selectedClientForDocument: Client | null;
  setSelectedClientForDocument: (client: Client | null) => void;
}

const ClientDialogs: React.FC<ClientDialogsProps> = ({
  clientDialogOpen,
  setClientDialogOpen,
  dialogMode,
  selectedClient,
  onClientSubmit,
  quoteDialogOpen,
  setQuoteDialogOpen,
  invoiceDialogOpen,
  setInvoiceDialogOpen,
  creditDialogOpen,
  setCreditDialogOpen,
  selectedClientForDocument,
  setSelectedClientForDocument
}) => {
  return (
    <>
      <ClientDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
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
        onSubmit={onClientSubmit}
        mode={dialogMode}
      />

      {/* Dialogue de création de devis */}
      <QuoteDialog
        open={quoteDialogOpen}
        onOpenChange={(open) => {
          console.log('Quote dialog open state changing to:', open);
          setQuoteDialogOpen(open);
          if (!open) {
            setSelectedClientForDocument(null);
          }
        }}
        quote={selectedClientForDocument ? {
          client_id: selectedClientForDocument.id,
          clients: {
            id: selectedClientForDocument.id,
            first_name: selectedClientForDocument.first_name,
            last_name: selectedClientForDocument.last_name
          }
        } as any : null}
      />

      {/* Dialogue de création de facture */}
      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={(open) => {
          console.log('Invoice dialog open state changing to:', open);
          setInvoiceDialogOpen(open);
          if (!open) {
            setSelectedClientForDocument(null);
          }
        }}
        invoice={selectedClientForDocument ? {
          client_id: selectedClientForDocument.id,
          clients: {
            id: selectedClientForDocument.id,
            first_name: selectedClientForDocument.first_name,
            last_name: selectedClientForDocument.last_name
          }
        } as any : null}
      />

      {/* Dialogue de création d'avoir */}
      <CreditDialog
        open={creditDialogOpen}
        onOpenChange={(open) => {
          console.log('Credit dialog open state changing to:', open);
          setCreditDialogOpen(open);
          if (!open) {
            setSelectedClientForDocument(null);
          }
        }}
        credit={null}
      />
    </>
  );
};

export default ClientDialogs;
