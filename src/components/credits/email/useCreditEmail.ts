import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceEmailFormData } from '../../invoices/email/types';
import { clientsService } from '@/services/supabase/clients';
import { prepareCreditDataForPDF } from '@/utils/creditPDFGeneration';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import { supabase } from '@/integrations/supabase/client';

export const useCreditEmail = (credit: any | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getDefaultEmailData = async (): Promise<InvoiceEmailFormData> => {
    let clientEmail = '';
    let clientName = '';
    let vehicleInfo = '';
    
    // Récupérer les informations client depuis l'avoir
    if (credit?.clients) {
      clientEmail = credit.clients.email || '';
      clientName = `${credit.clients.first_name || ''} ${credit.clients.last_name || ''}`.trim();
    }

    // Récupérer les informations du véhicule via la facture associée
    if (credit?.invoice_id) {
      try {
        const { data: invoice } = await supabase
          .from('invoices')
          .select(`
            vehicles(
              *,
              car_brands(name),
              car_models(name)
            )
          `)
          .eq('id', credit.invoice_id)
          .single();

        if (invoice?.vehicles) {
          const vehicle = invoice.vehicles;
          const brand = vehicle.car_brands?.name || 'Véhicule';
          const model = vehicle.car_models?.name || '';
          const licensePlate = vehicle.license_plate || '';
          vehicleInfo = `${brand}${model ? ` ${model}` : ''} - ${licensePlate}`;
        }
      } catch (error) {
        console.error('Error fetching vehicle from invoice:', error);
      }
    }

    const subject = `Avoir n°${credit?.reference || ''} - ${clientName}`;
    
    const message = `Bonjour ${clientName},

Veuillez trouver en pièce jointe l'avoir n°${credit?.reference || ''} pour votre véhicule ${vehicleInfo}.

Cordialement,
AUTO PAINT`;

    return {
      to: clientEmail,
      subject: subject,
      message: message
    };
  };

  const sendEmail = async (emailData: InvoiceEmailFormData) => {
    if (!credit) {
      toast({
        title: "Erreur",
        description: "Aucun avoir sélectionné",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Générer le PDF de l'avoir
      const data = await prepareCreditDataForPDF(credit, {});
      
      // Adapter l'avoir au format Invoice pour le PDF
      const invoiceData = {
        ...data.credit,
        amount: data.credit.amount || data.totals.total,
        date: data.credit.created_at,
        due_date: data.credit.created_at,
        repairs_data: [],
        parts_data: [],
        reference: data.credit.reference
      } as any;

      const doc = InvoicePDF({ 
        invoice: invoiceData, 
        companyData: data.companyData, 
        receipts: [],
        clientData: data.clientData,
        vehicleData: data.vehicleData,
        template: data.template,
        documentType: 'credit'
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
          pdfBase64: pdfBase64,
          invoiceReference: credit.reference,
          documentType: 'credit'
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "E-mail envoyé",
        description: `L'avoir ${credit?.reference} a été envoyé à ${emailData.to}`,
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