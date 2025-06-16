
import React, { useEffect, useState } from 'react';
import ClientDialog from '@/components/client/ClientDialog';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { Client } from '@/services/supabase/clients';
import { generateNextQuoteNumber } from '@/components/quotes/form/utils/quoteNumber';
import { generateNextInvoiceNumber } from '@/components/invoices/form/utils/invoiceFormUtils';
import { creditsService } from '@/services/supabase/credits';

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
  const [quoteWithNumber, setQuoteWithNumber] = useState<any>(null);
  const [invoiceWithNumber, setInvoiceWithNumber] = useState<any>(null);
  const [creditWithNumber, setCreditWithNumber] = useState<any>(null);

  // Générer le numéro de devis quand le dialogue s'ouvre
  useEffect(() => {
    if (quoteDialogOpen && selectedClientForDocument) {
      const generateQuoteNumber = async () => {
        const nextNumber = await generateNextQuoteNumber();
        const today = new Date().toISOString().split('T')[0];
        
        setQuoteWithNumber({
          reference: nextNumber,
          client_id: selectedClientForDocument.id,
          valid_until: today,
          status: 'En attente',
          clients: {
            id: selectedClientForDocument.id,
            first_name: selectedClientForDocument.first_name,
            last_name: selectedClientForDocument.last_name
          }
        });
      };
      generateQuoteNumber();
    } else if (!quoteDialogOpen) {
      setQuoteWithNumber(null);
    }
  }, [quoteDialogOpen, selectedClientForDocument]);

  // Générer le numéro de facture quand le dialogue s'ouvre
  useEffect(() => {
    if (invoiceDialogOpen && selectedClientForDocument) {
      const generateInvoiceNumber = async () => {
        const nextNumber = await generateNextInvoiceNumber();
        const today = new Date().toISOString().split('T')[0];
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        
        setInvoiceWithNumber({
          reference: nextNumber,
          client_id: selectedClientForDocument.id,
          due_date: today,
          payment_due_date: dueDate.toISOString().split('T')[0],
          status: 'En attente de paiement',
          clients: {
            id: selectedClientForDocument.id,
            first_name: selectedClientForDocument.first_name,
            last_name: selectedClientForDocument.last_name
          }
        });
      };
      generateInvoiceNumber();
    } else if (!invoiceDialogOpen) {
      setInvoiceWithNumber(null);
    }
  }, [invoiceDialogOpen, selectedClientForDocument]);

  // Générer le numéro d'avoir quand le dialogue s'ouvre
  useEffect(() => {
    if (creditDialogOpen && selectedClientForDocument) {
      const generateCreditNumber = async () => {
        try {
          const lastCredit = await creditsService.getLastCreditByUser();
          const lastNumber = lastCredit?.reference ? parseInt(lastCredit.reference) : 0;
          const nextNumber = (lastNumber + 1).toString();
          const today = new Date().toISOString().split('T')[0];
          
          setCreditWithNumber({
            reference: nextNumber,
            client_id: selectedClientForDocument.id,
            date: today,
            status: 'En attente',
            clients: {
              id: selectedClientForDocument.id,
              first_name: selectedClientForDocument.first_name,
              last_name: selectedClientForDocument.last_name
            }
          });
        } catch (error) {
          console.error('Error generating credit number:', error);
          setCreditWithNumber({
            reference: '1',
            client_id: selectedClientForDocument.id,
            date: new Date().toISOString().split('T')[0],
            status: 'En attente',
            clients: {
              id: selectedClientForDocument.id,
              first_name: selectedClientForDocument.first_name,
              last_name: selectedClientForDocument.last_name
            }
          });
        }
      };
      generateCreditNumber();
    } else if (!creditDialogOpen) {
      setCreditWithNumber(null);
    }
  }, [creditDialogOpen, selectedClientForDocument]);

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
        quote={quoteWithNumber}
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
        invoice={invoiceWithNumber}
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
        credit={creditWithNumber}
      />
    </>
  );
};

export default ClientDialogs;
