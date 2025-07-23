import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { GeneratedReport } from '@/hooks/use-generated-reports';
import { supabase } from '@/integrations/supabase/client';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { parseISO, isWithinInterval, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import jsPDF from 'jspdf';

interface ReportEmailFormData {
  to: string;
  subject: string;
  message: string;
}

export const useReportEmail = (report: GeneratedReport | null) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { transactions } = useAccountingData();

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
      // Filtrer les transactions pour la période du rapport
      const filteredTransactions = transactions.filter(transaction => {
        if (!transaction.date) return false;
        const transactionDate = parseISO(transaction.date.split('/').reverse().join('-'));
        return isWithinInterval(transactionDate, { start: report.fromDate, end: report.toDate });
      });

      // Générer le contenu du fichier selon le type de rapport
      let fileBase64 = '';
      let fileExtension = '';
      let fileName = '';
      
      if (report.type === 'monthly' || report.type === 'quarterly' || report.type === 'yearly') {
        // Pour les rapports PDF
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        // Header
        doc.setFontSize(20);
        doc.text(report.name, pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(12);
        const fromDateStr = format(report.fromDate, 'dd/MM/yyyy', { locale: fr });
        const toDateStr = format(report.toDate, 'dd/MM/yyyy', { locale: fr });
        doc.text(`Période: du ${fromDateStr} au ${toDateStr}`, pageWidth / 2, 35, { align: 'center' });
        
        // Statistiques
        const totalEncaissements = filteredTransactions
          .filter(t => t.type === 'Encaissement')
          .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0);
        
        const totalDépenses = filteredTransactions
          .filter(t => t.type === 'Dépense')
          .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0);
        
        const solde = totalEncaissements - totalDépenses;
        
        doc.setFontSize(14);
        doc.text('Résumé financier:', 20, 60);
        
        doc.setFontSize(12);
        doc.text(`Total encaissements: ${totalEncaissements.toFixed(2)} €`, 20, 75);
        doc.text(`Total dépenses: ${totalDépenses.toFixed(2)} €`, 20, 90);
        doc.text(`Solde: ${solde.toFixed(2)} €`, 20, 105);
        
        // Transactions
        if (filteredTransactions.length > 0) {
          doc.setFontSize(14);
          doc.text('Détail des transactions:', 20, 130);
          
          doc.setFontSize(10);
          let yPos = 145;
          
          filteredTransactions.forEach((transaction, index) => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            
            const amount = parseFloat(transaction.amount.replace(/[€\s]/g, '').replace(',', '.'));
            const line = `${transaction.date} - ${transaction.description} - ${transaction.type} - ${amount.toFixed(2)} €`;
            doc.text(line, 20, yPos);
            yPos += 8;
          });
        } else {
          doc.setFontSize(10);
          doc.text('Aucune transaction trouvée pour cette période.', 20, 145);
        }
        
        // Convertir en base64
        const pdfOutput = doc.output('datauristring');
        fileBase64 = pdfOutput.split(',')[1]; // Enlever le prefix data:application/pdf;base64,
        fileExtension = 'pdf';
        fileName = `${report.name.toLowerCase().replace(/\s+/g, '-')}-${fromDateStr.replace(/\//g, '-')}-${toDateStr.replace(/\//g, '-')}.pdf`;
        
      } else if (report.type === 'csv' || report.type === 'excel') {
        // Pour les rapports CSV
        const headers = ['Date', 'Description', 'Type', 'Méthode', 'Montant', 'Client', 'Statut'];
        const csvContent = [
          headers.join(','),
          ...filteredTransactions.map(t => [
            t.date,
            `"${t.description}"`,
            t.type,
            t.method,
            t.amount.replace(/[€\s]/g, '').replace(',', '.'),
            `"${t.client || ''}"`,
            t.status
          ].join(','))
        ].join('\n');
        
        fileBase64 = btoa(csvContent);
        fileExtension = 'csv';
        const fromDateStr = format(report.fromDate, 'dd-MM-yyyy', { locale: fr });
        const toDateStr = format(report.toDate, 'dd-MM-yyyy', { locale: fr });
        fileName = `export-comptable-${fromDateStr}-${toDateStr}.csv`;
        
      } else if (report.type === 'fec') {
        // Pour les rapports FEC (format texte)
        const headers = ['JournalCode', 'JournalLib', 'EcritureNum', 'EcritureDate', 'CompteNum', 'CompteLib', 'CompAuxNum', 'CompAuxLib', 'PieceRef', 'PieceDate', 'EcritureLib', 'Debit', 'Credit'];
        const fecContent = [
          headers.join('\t'),
          ...filteredTransactions.map((t, index) => {
            const amount = parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.'));
            const debit = t.type === 'Dépense' ? amount.toFixed(2) : '0.00';
            const credit = t.type === 'Encaissement' ? amount.toFixed(2) : '0.00';
            
            return [
              'VTE', // JournalCode
              'VENTES', // JournalLib
              (index + 1).toString().padStart(8, '0'), // EcritureNum
              t.date.split('/').reverse().join(''), // EcritureDate (YYYYMMDD)
              '411000', // CompteNum
              'CLIENTS', // CompteLib
              t.client || '', // CompAuxNum
              t.client || '', // CompAuxLib
              `REF${index + 1}`, // PieceRef
              t.date.split('/').reverse().join(''), // PieceDate
              t.description, // EcritureLib
              debit, // Debit
              credit // Credit
            ].join('\t');
          })
        ].join('\n');
        
        fileBase64 = btoa(fecContent);
        fileExtension = 'txt';
        const fromDateStr = format(report.fromDate, 'dd-MM-yyyy', { locale: fr });
        const toDateStr = format(report.toDate, 'dd-MM-yyyy', { locale: fr });
        fileName = `export-fec-${fromDateStr}-${toDateStr}.txt`;
      }

      // Envoyer l'email avec la pièce jointe via l'edge function
      const { error } = await supabase.functions.invoke('send-document-email', {
        body: {
          to: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          pdfBase64: fileBase64,
          invoiceReference: fileName.split('.')[0], // Nom sans extension
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