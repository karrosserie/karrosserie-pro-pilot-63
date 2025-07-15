
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceEmailFormData } from '../../invoices/email/types';
import { Quote } from '@/services/supabase/quotes';
import { clientsService } from '@/services/supabase/clients';
import { prepareQuoteDataForPDF } from '@/utils/quotePDFGeneration';
import { pdf } from '@react-pdf/renderer';
import QuotePDF from '@/components/quotes/QuotePDF';
import { supabase } from '@/integrations/supabase/client';

export const useQuoteEmail = (quote: Quote | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getDefaultEmailData = async (): Promise<InvoiceEmailFormData> => {
    let clientEmail = '';
    let clientName = '';
    let vehicleInfo = '';
    
    if (quote?.client_id) {
      try {
        const client = await clientsService.getById(quote.client_id);
        clientEmail = client.email || '';
        clientName = `${client.first_name} ${client.last_name}`;
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    }

    // Construction des informations du véhicule
    if (quote?.vehicle_id) {
      try {
        const { data: vehicle } = await supabase
          .from('vehicles')
          .select(`
            *,
            car_brands(name),
            car_models(name)
          `)
          .eq('id', quote.vehicle_id)
          .single();

        if (vehicle) {
          const brand = vehicle.car_brands?.name || 'Véhicule';
          const model = vehicle.car_models?.name || '';
          const licensePlate = vehicle.license_plate || '';
          vehicleInfo = `${brand}${model ? ` ${model}` : ''} - ${licensePlate}`;
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      }
    }

    const subject = `Devis n°${quote?.reference || ''} - ${clientName}`;
    
    const message = `Bonjour ${clientName},

Veuillez trouver en pièce jointe le devis n°${quote?.reference || ''} pour votre véhicule ${vehicleInfo}.

Cordialement,
AUTO PAINT`;

    return {
      to: clientEmail,
      subject: subject,
      message: message
    };
  };

  const sendEmail = async (emailData: InvoiceEmailFormData) => {
    if (!quote) {
      toast({
        title: "Erreur",
        description: "Aucun devis sélectionné",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Générer le PDF du devis
      const data = await prepareQuoteDataForPDF(quote, {});
      const doc = QuotePDF({ 
        quote: data.quote, 
        companyData: data.companyData, 
        receipts: [],
        clientData: data.clientData,
        vehicleData: data.vehicleData,
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
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          pdfBase64: pdfBase64,
          invoiceReference: quote.reference
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "E-mail envoyé",
        description: `Le devis ${quote?.reference} a été envoyé à ${emailData.to}`,
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
