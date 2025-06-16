import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/hooks/use-company';
import { RepairOrder, EmailFormData } from './types';

export const useRepairOrderEmail = (repairOrder: RepairOrder | null, open: boolean) => {
  const { toast } = useToast();
  const { companyData } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmailFormData>({
    recipient: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (open && repairOrder) {
      const clientName = repairOrder.clients 
        ? `${repairOrder.clients.first_name} ${repairOrder.clients.last_name}`
        : '';
      
      const vehicleInfo = repairOrder.vehicles 
        ? `${repairOrder.vehicles.car_brands?.name || 'Marque inconnue'} ${repairOrder.vehicles.car_models?.name || 'Modèle inconnu'} - ${repairOrder.vehicles.license_plate}`
        : '';

      const companyName = companyData?.name || 'L\'équipe';

      setFormData({
        recipient: repairOrder.clients?.email || '',
        subject: `Ordre de réparation n°${repairOrder.reference || ''} - ${clientName}`,
        message: `Bonjour ${clientName},

Veuillez trouver en pièce jointe l'ordre de réparation n°${repairOrder.reference || ''} pour votre véhicule ${vehicleInfo}.

Cet ordre de réparation détaille les travaux à effectuer sur votre véhicule.

Si vous avez des questions concernant cet ordre de réparation, n'hésitez pas à nous contacter.

Cordialement,
${companyName}`
      });
    }
  }, [open, repairOrder, companyData?.name]);

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
      // Simulation de l'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email envoyé",
        description: `L'ordre de réparation ${repairOrder?.reference || ''} a été envoyé par email à ${formData.recipient}.`
      });
      
      return true;
    } catch (error) {
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
