
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { Quote, EmailFormData } from './types';

export const useQuoteEmail = (quote: Quote | null, open: boolean) => {
  const [formData, setFormData] = useState<EmailFormData>({
    recipient: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { clients } = useClients();

  useEffect(() => {
    if (quote && open) {
      console.log('Quote data for email dialog:', quote);
      console.log('Client data from quote:', quote.clients);
      console.log('All clients data:', clients);
      
      // Récupérer les données complètes du client depuis la liste des clients
      const fullClientData = clients?.find(client => client.id === quote.clients?.id);
      console.log('Full client data found:', fullClientData);
      
      const clientEmail = fullClientData?.email || quote.clients?.email || '';
      console.log('Final client email to use:', clientEmail);
      
      // Pré-remplir le sujet
      const licensePlate = quote.vehicles?.license_plate || 'véhicule';
      
      // Pré-remplir le message
      const clientName = quote.clients 
        ? `${quote.clients.first_name} ${quote.clients.last_name}`
        : 'client';

      setFormData({
        recipient: clientEmail,
        subject: `Devis pour le véhicule ${licensePlate}`,
        message: `Veuillez trouver ci-joint le devis pour le véhicule immatriculé ${licensePlate} appartenant à ${clientName}.`
      });
    }
  }, [quote, open, clients]);

  const updateFormData = (field: keyof EmailFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.recipient.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse e-mail destinataire",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.subject.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un sujet",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const sendEmail = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulation de l'envoi d'e-mail
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "E-mail envoyé",
        description: `Le devis a été envoyé à ${formData.recipient}`
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'e-mail",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      recipient: '',
      subject: '',
      message: ''
    });
  };

  return {
    formData,
    isLoading,
    updateFormData,
    sendEmail,
    resetForm
  };
};
