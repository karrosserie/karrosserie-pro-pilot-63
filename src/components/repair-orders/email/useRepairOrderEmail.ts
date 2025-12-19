import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/hooks/use-company';
import { EmailFormData } from './types';
import { RepairOrder as SimpleRepairOrder } from './types';
import { RepairOrder } from '@/services/supabase/repair-orders';
import { supabase } from '@/integrations/supabase/client';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from '@/components/invoices/InvoicePDF';
import { prepareRepairOrderDataForPDF } from '@/utils/repairOrderPDFGeneration';
import { getClientDisplayName } from '@/utils/clientDisplayUtils';
import { registerEmailInMessagerie } from '@/services/messagerie/emailMessagerie';

export const useRepairOrderEmail = (repairOrder: SimpleRepairOrder | null, open: boolean) => {
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
        ? getClientDisplayName(repairOrder.clients)
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
        .select('*')
        .eq('id', repairOrder.id)
        .single();

      if (!fullRepairOrder) {
        throw new Error('Impossible de récupérer les détails de l\'ordre de réparation');
      }

      // Utiliser la même fonction que pour le téléchargement/impression
      const data = await prepareRepairOrderDataForPDF(fullRepairOrder as RepairOrder, companyData || {});
      
      // Adapter l'ordre de réparation au format Invoice pour le PDF (même logique que generateRepairOrderPDFWithTemplate)
      const invoiceData = {
        ...data.repairOrder,
        amount: data.totals.total,
        date: data.repairOrder.created_at,
        due_date: data.repairOrder.created_at,
        repairs_data: Array.isArray(data.repairOrder.repairs_data) ? data.repairOrder.repairs_data : [],
        parts_data: Array.isArray(data.repairOrder.parts_data) ? data.repairOrder.parts_data : []
      } as any;

      // Générer le PDF de l'ordre de réparation avec exactement les mêmes données que téléchargement/impression
      const doc = InvoicePDF({ 
        invoice: invoiceData,
        companyData: data.companyData, 
        payments: [],
        clientData: data.clientData,
        vehicleData: data.vehicleData,
        template: data.template,
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
          fileBase64: pdfBase64,
          invoiceReference: repairOrder.reference,
          documentType: 'repair_order'
        }
      });

      if (error) {
        throw error;
      }

      // Enregistrer l'envoi dans le centre de messagerie
      const clientId = repairOrder.clients?.id;
      if (clientId) {
        await registerEmailInMessagerie({
          clientId: clientId,
          documentType: 'repair_order',
          documentReference: repairOrder.reference || '',
          recipientEmail: formData.recipient,
          subject: formData.subject,
          message: formData.message,
          vehicleId: repairOrder.vehicles?.id || undefined
        });
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