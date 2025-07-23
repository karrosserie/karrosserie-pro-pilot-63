import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedReport } from '@/hooks/use-generated-reports';
import { supabase } from '@/integrations/supabase/client';

interface ReportEmailFormData {
  to: string;
  subject: string;
  message: string;
}

export const useReportEmail = (report: GeneratedReport | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const getDefaultEmailData = async (): Promise<ReportEmailFormData> => {
    if (!report) {
      return {
        to: '',
        subject: '',
        message: ''
      };
    }

    const fromDateStr = report.fromDate.toLocaleDateString('fr-FR');
    const toDateStr = report.toDate.toLocaleDateString('fr-FR');
    
    const reportTypeText = {
      'monthly': 'le bilan mensuel',
      'quarterly': 'le bilan trimestriel', 
      'yearly': 'le bilan annuel',
      'fec': 'l\'export au format FEC',
      'csv': 'l\'export au format CSV'
    };

    const subject = `${report.name} - Période du ${fromDateStr} au ${toDateStr}`;
    
    const message = `Bonjour,

Veuillez trouver ${reportTypeText[report.type] || 'le rapport'} en pièce jointe pour la période du ${fromDateStr} au ${toDateStr}.

Ce document a été généré automatiquement le ${report.generatedAt.toLocaleDateString('fr-FR')} à ${report.generatedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.

Cordialement,
L'équipe comptabilité
AUTO PAINT`;

    return {
      to: '',
      subject: subject,
      message: message
    };
  };

  const sendEmail = async (emailData: ReportEmailFormData) => {
    if (!report) {
      toast({
        title: "Erreur",
        description: "Aucun rapport sélectionné",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Générer le contenu du fichier selon le type de rapport
      let fileBase64 = '';
      let fileExtension = '';
      
      if (report.type === 'monthly' || report.type === 'quarterly' || report.type === 'yearly') {
        // Pour les rapports PDF
        const reportData = {
          name: report.name,
          type: report.type,
          fromDate: report.fromDate,
          toDate: report.toDate,
          generatedAt: report.generatedAt
        };
        
        fileBase64 = btoa(JSON.stringify(reportData));
        fileExtension = 'pdf';
      } else if (report.type === 'csv') {
        // Pour les rapports CSV
        const csvData = `Rapport,Type,Date début,Date fin,Généré le
${report.name},${report.type},${report.fromDate.toLocaleDateString('fr-FR')},${report.toDate.toLocaleDateString('fr-FR')},${report.generatedAt.toLocaleDateString('fr-FR')}`;
        fileBase64 = btoa(csvData);
        fileExtension = 'csv';
      } else if (report.type === 'fec') {
        // Pour les rapports FEC (format texte)
        const fecData = `Rapport,Type,Date début,Date fin,Généré le
${report.name},${report.type},${report.fromDate.toLocaleDateString('fr-FR')},${report.toDate.toLocaleDateString('fr-FR')},${report.generatedAt.toLocaleDateString('fr-FR')}`;
        fileBase64 = btoa(fecData);
        fileExtension = 'txt';
      }

      // Envoyer l'email avec la pièce jointe via l'edge function
      const { error } = await supabase.functions.invoke('send-document-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          pdfBase64: fileBase64,
          invoiceReference: report.name,
          documentType: fileExtension
        }
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "E-mail envoyé",
        description: `Le rapport ${report.name} a été envoyé à ${emailData.to}`,
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