
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceEmailFormData } from './types';
import { Invoice } from '@/services/supabase/invoices';
import { clientsService } from '@/services/supabase/clients';
import { companyService } from '@/services/supabase/company';
import { prepareInvoiceDataForPDF } from '@/utils/invoicePDFGeneration';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import { supabase } from '@/integrations/supabase/client';

export const useInvoiceEmail = (invoice: Invoice | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getDefaultEmailData = async (): Promise<InvoiceEmailFormData> => {
    let clientEmail = '';
    let clientName = '';
    let vehicleInfo = '';
    
    if (invoice?.client_id) {
      try {
        const client = await clientsService.getById(invoice.client_id);
        clientEmail = client.email || '';
        clientName = `${client.first_name} ${client.last_name}`;
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    }

    // Si on n'a pas pu récupérer le nom du client depuis l'API, on utilise les données de l'invoice
    if (!clientName && invoice?.clients) {
      clientName = `${invoice.clients.first_name} ${invoice.clients.last_name}`;
    }

    // Construction des informations du véhicule
    if (invoice?.vehicles) {
      const brand = invoice.vehicles.car_brands?.name || 'Véhicule';
      const model = invoice.vehicles.car_models?.name || '';
      const licensePlate = invoice.vehicles.license_plate || '';
      vehicleInfo = `${brand}${model ? ` ${model}` : ''} - ${licensePlate}`;
    }

    // Récupérer les informations de l'entreprise pour la signature
    const companyInfo = await companyService.getCompanyInfo();

    const subject = `Facture n°${invoice?.reference || ''} - ${clientName}`;
    
    const message = `Bonjour ${clientName},

Veuillez trouver en pièce jointe la facture n°${invoice?.reference || ''} pour votre véhicule ${vehicleInfo}.

Cordialement,
${companyInfo?.name || 'L\'équipe'}`;

    return {
      to: clientEmail,
      subject: subject,
      message: message
    };
  };

  const sendEmail = async (emailData: InvoiceEmailFormData) => {
    if (!invoice) {
      toast({
        title: "Erreur",
        description: "Aucune facture sélectionnée",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Préparer les données pour le PDF (comme dans generateInvoicePDFWithTemplate)
      const data = await prepareInvoiceDataForPDF(invoice, {});
      
      // Adapter les données pour le composant PDF
      const pdfData = {
        ...data.clientData,
        number: data.invoiceData.number,
        billingDate: data.invoiceData.billingDate,
        dueDate: data.invoiceData.dueDate,
        claimNumber: data.invoiceData.claimNumber,
        vehicle: data.invoiceData.vehicle,
        licensePlate: data.invoiceData.licensePlate,
        mileage: data.invoiceData.mileage,
        items: data.items,
        totals: data.totals
      };
      
      const doc = InvoicePDF({ 
        invoice, 
        companyData: data.companyData, 
        receipts: [],
        clientData: pdfData,
        vehicleData: null,
        template: data.template
      });
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      
      // Convertir le blob en base64
      const reader = new FileReader();
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          // Supprimer le préfixe "data:application/pdf;base64,"
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Envoyer l'email avec le PDF en pièce jointe via l'edge function
      const { error } = await supabase.functions.invoke('send-document-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          fileBase64: pdfBase64,
          invoiceReference: invoice.reference,
          documentType: 'invoice'
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "E-mail envoyé",
        description: `La facture ${invoice?.reference} a été envoyée à ${emailData.to}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'e-mail. Veuillez réessayer.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getDefaultEmailData,
    sendEmail,
    isLoading
  };
};
