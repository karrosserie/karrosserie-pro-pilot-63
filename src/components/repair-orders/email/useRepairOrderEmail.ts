import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/hooks/use-company';
import { RepairOrder, EmailFormData } from './types';
import { supabase } from '@/integrations/supabase/client';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import { clientsService } from '@/services/supabase/clients';

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

    if (!repairOrder) {
      toast({
        title: "Erreur",
        description: "Aucun ordre de réparation sélectionné",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      // Récupérer l'ordre de réparation complet depuis la base de données
      const { data: fullRepairOrder } = await supabase
        .from('repair_orders')
        .select(`
          *,
          clients(*),
          vehicles(*, car_brands(name), car_models(name))
        `)
        .eq('id', repairOrder.id)
        .single();

      if (!fullRepairOrder) {
        throw new Error('Impossible de récupérer les détails de l\'ordre de réparation');
      }

      // Préparer les données du client
      let clientData = null;
      if (fullRepairOrder.clients) {
        clientData = {
          clientName: `${fullRepairOrder.clients.first_name} ${fullRepairOrder.clients.last_name}`,
          address: fullRepairOrder.clients.address || '',
          postalCode: fullRepairOrder.clients.postal_code || '',
          city: fullRepairOrder.clients.city || '',
          email: fullRepairOrder.clients.email || '',
          phone: fullRepairOrder.clients.phone || ''
        };
      }

      // Préparer les données du véhicule
      let vehicleData = null;
      if (fullRepairOrder.vehicles) {
        vehicleData = {
          vehicle: `${fullRepairOrder.vehicles.car_brands?.name || ''} ${fullRepairOrder.vehicles.car_models?.name || ''}`.trim(),
          licensePlate: fullRepairOrder.vehicles.license_plate || '',
          mileage: fullRepairOrder.vehicles.mileage ? fullRepairOrder.vehicles.mileage.toLocaleString() + ' km' : ''
        };
      }

      // Générer le PDF de l'ordre de réparation
      const doc = InvoicePDF({ 
        invoice: fullRepairOrder as any,
        companyData: companyData || {}, 
        receipts: [],
        clientData: clientData,
        vehicleData: vehicleData,
        template: 'default',
        documentType: 'repair_order'
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
          to: formData.recipient,
          subject: formData.subject,
          message: formData.message,
          pdfBase64: pdfBase64,
          invoiceReference: repairOrder.reference,
          documentType: 'repair_order'
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Email envoyé",
        description: `L'ordre de réparation ${repairOrder?.reference || ''} a été envoyé par email à ${formData.recipient}.`
      });
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
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
