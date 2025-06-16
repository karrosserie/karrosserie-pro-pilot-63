
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

    const subject = `Facture n°${invoice?.reference || ''} - ${clientName}`;
    
    const message = `Bonjour ${clientName},

Veuillez trouver en pièce jointe la facture n°${invoice?.reference || ''} pour votre véhicule ${vehicleInfo}.

Cordialement,
AUTO PAINT`;

    return {
      to: clientEmail,
      subject: subject,
      message: message
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
