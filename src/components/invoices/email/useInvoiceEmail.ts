
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/services/supabase/invoices';
import { EmailFormData } from './types';

export const useInvoiceEmail = (invoice: Invoice | null, open: boolean) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmailFormData>({
    recipient: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (open && invoice) {
      const clientEmail = invoice.clients?.email || '';
      const subject = `Facture ${invoice.reference || ''} - Karrosserie`;
      const message = `Bonjour,

Veuillez trouver ci-joint votre facture ${invoice.reference || ''}.

Cordialement,
L'équipe Karrosserie`;

      setFormData({
        recipient: clientEmail,
        subject,
        message
      });
    }
  }, [open, invoice]);

  const updateFormData = (field: keyof EmailFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sendEmail = async (): Promise<boolean> => {
    if (!formData.recipient || !formData.subject || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Email envoyé",
        description: `La facture ${invoice?.reference || ''} a été envoyée à ${formData.recipient}.`
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Veuillez réessayer.",
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
