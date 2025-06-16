
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceEmailFormData } from './types';
import { Invoice } from '@/services/supabase/invoices';
import { clientsService } from '@/services/supabase/clients';

export const useInvoiceEmail = (invoice: Invoice | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getDefaultEmailData = async (): Promise<InvoiceEmailFormData> => {
    let clientEmail = '';
    
    if (invoice?.client_id) {
      try {
        const client = await clientsService.getById(invoice.client_id);
        clientEmail = client.email || '';
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    }

    return {
      to: clientEmail,
      subject: `Facture ${invoice?.reference || ''}`,
      message: `Bonjour,

Veuillez trouver ci-joint votre facture ${invoice?.reference || ''}.

Nous vous remercions pour votre confiance.

Cordialement,
L'équipe`
    };
  };

  const sendEmail = async (data: InvoiceEmailFormData) => {
    setIsLoading(true);
    try {
      // Simuler l'envoi d'e-mail
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "E-mail envoyé",
        description: `La facture ${invoice?.reference} a été envoyée à ${data.to}`,
      });
      
      return true;
    } catch (error) {
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
