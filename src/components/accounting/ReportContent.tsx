import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReportDateRangeDialog } from './ReportDateRangeDialog';
import { GeneratedReportsTable } from './GeneratedReportsTable';
import { EmailReportDialog } from './EmailReportDialog';
import { useToast } from '@/hooks/use-toast';
import { useGeneratedReports, GeneratedReport } from '@/hooks/use-generated-reports';
import jsPDF from 'jspdf';
type DialogType = 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel' | 'social' | 'pdf' | null;
const ReportContent = () => {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    reports,
    addReport,
    sendEmail,
    deleteReport,
    downloadReport
  } = useGeneratedReports();
  const handleGenerate = (type: string, fromDate: Date, toDate: Date) => {
    if (type === 'Export PDF') {
      generatePDFReport(fromDate, toDate);
      return;
    }
    
    const reportId = addReport(type, fromDate, toDate);
    toast({
      title: "Génération en cours",
      description: `${type} en cours de génération...`
    });
    setTimeout(() => {
      toast({
        title: "Fichier généré",
        description: `${type} prêt au téléchargement.`
      });
    }, 2000);
  };

  const generatePDFReport = (fromDate: Date, toDate: Date) => {
    try {
      const doc = new jsPDF();
      
      // Configuration du PDF
      doc.setFont('helvetica', 'normal');
      
      // En-tête
      doc.setFontSize(20);
      doc.text('RAPPORT COMPTABLE', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Période: ${fromDate.toLocaleDateString('fr-FR')} - ${toDate.toLocaleDateString('fr-FR')}`, 105, 35, { align: 'center' });
      doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 105, 45, { align: 'center' });
      
      // Ligne de séparation
      doc.line(20, 55, 190, 55);
      
      // Section Résumé financier
      doc.setFontSize(16);
      doc.text('RÉSUMÉ FINANCIER', 20, 70);
      
      doc.setFontSize(11);
      let yPos = 85;
      
      // Données fictives pour démonstration
      const financialData = [
        { label: 'Chiffre d\'affaires HT:', value: '245 680,00 €' },
        { label: 'TVA collectée:', value: '49 136,00 €' },
        { label: 'Total TTC:', value: '294 816,00 €' },
        { label: 'Charges d\'exploitation:', value: '156 420,00 €' },
        { label: 'Résultat net:', value: '89 260,00 €' }
      ];
      
      financialData.forEach(item => {
        doc.text(item.label, 25, yPos);
        doc.text(item.value, 120, yPos, { align: 'right' });
        yPos += 10;
      });
      
      // Section Détail des opérations
      yPos += 15;
      doc.setFontSize(16);
      doc.text('DÉTAIL DES OPÉRATIONS', 20, yPos);
      
      yPos += 15;
      doc.setFontSize(10);
      
      // En-têtes du tableau
      doc.text('Date', 25, yPos);
      doc.text('Libellé', 50, yPos);
      doc.text('Débit', 120, yPos);
      doc.text('Crédit', 150, yPos);
      doc.text('Solde', 175, yPos);
      
      // Ligne sous les en-têtes
      doc.line(20, yPos + 3, 190, yPos + 3);
      yPos += 12;
      
      // Données d'exemple
      const operations = [
        { date: '15/01/2025', libelle: 'Vente - Facture FAC-001', debit: '', credit: '1 200,00', solde: '1 200,00' },
        { date: '16/01/2025', libelle: 'Achat matériel', debit: '450,00', credit: '', solde: '750,00' },
        { date: '18/01/2025', libelle: 'Vente - Facture FAC-002', debit: '', credit: '2 350,00', solde: '3 100,00' },
        { date: '20/01/2025', libelle: 'Frais bancaires', debit: '25,00', credit: '', solde: '3 075,00' },
        { date: '22/01/2025', libelle: 'Vente - Facture FAC-003', debit: '', credit: '1 850,00', solde: '4 925,00' }
      ];
      
      operations.forEach(op => {
        if (yPos > 250) { // Nouvelle page si nécessaire
          doc.addPage();
          yPos = 30;
        }
        
        doc.text(op.date, 25, yPos);
        doc.text(op.libelle, 50, yPos);
        doc.text(op.debit, 130, yPos, { align: 'right' });
        doc.text(op.credit, 160, yPos, { align: 'right' });
        doc.text(op.solde, 185, yPos, { align: 'right' });
        yPos += 8;
      });
      
      // Pied de page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} / ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('Document généré automatiquement par le système comptable', 105, 285, { align: 'center' });
      }
      
      // Télécharger le PDF
      const fileName = `rapport-comptable-${fromDate.toISOString().split('T')[0]}-${toDate.toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "PDF généré",
        description: "Le rapport PDF a été téléchargé avec succès."
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive"
      });
    }
  };
  const handleSendEmail = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setEmailDialogOpen(true);
    }
  };
  const handleEmailSend = async (email: string) => {
    if (selectedReport) {
      await sendEmail(selectedReport.id, email);
    }
  };
  const getDialogTitle = (type: DialogType): string => {
    switch (type) {
      case 'monthly':
        return 'Générer le bilan sociale';
      case 'quarterly':
        return 'Générer le bilan trimestriel';
      case 'yearly':
        return 'Générer le bilan annuel';
      case 'fec':
        return 'Export au format FEC';
      case 'csv':
        return 'Export au format CSV';
      case 'excel':
        return 'Export au format Excel';
      case 'social':
        return 'Générer le bilan sociale';
      case 'pdf':
        return 'Export au format PDF';
      default:
        return '';
    }
  };
  const getReportName = (type: DialogType): string => {
    switch (type) {
      case 'monthly':
        return 'Bilan sociale';
      case 'quarterly':
        return 'Bilan trimestriel';
      case 'yearly':
        return 'Bilan annuel';
      case 'fec':
        return 'Export FEC';
      case 'csv':
        return 'Export CSV';
      case 'excel':
        return 'Export Excel';
      case 'social':
        return 'Bilan sociale';
      case 'pdf':
        return 'Export PDF';
      default:
        return '';
    }
  };
  return (
    <div className="space-y-8 w-full">
      {/* Section Rapports sociaux */}
      <div>
        <h2 className="text-xl font-medium text-slate-700 mb-4">Rapports sociaux</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-1">
          <div 
            onClick={() => navigate('/presence-pointages')} 
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Présence & Pointages</div>
                <div className="text-sm text-gray-500">Géolocalisé</div>
              </div>
            </div>
            <div className="text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Section Export comptable */}
      <div>
        <h2 className="text-xl font-medium text-slate-700 mb-4">Export pour cabinet comptable</h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          <div 
            onClick={() => setOpenDialog('fec')} 
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Download className="h-4 w-4 text-orange-600" />
              </div>
              <span className="font-medium text-gray-900">Format FEC</span>
            </div>
            <div className="text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div 
            onClick={() => setOpenDialog('csv')} 
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Download className="h-4 w-4 text-orange-600" />
              </div>
              <span className="font-medium text-gray-900">Format CSV</span>
            </div>
            <div className="text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div 
            onClick={() => setOpenDialog('pdf')} 
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
              <span className="font-medium text-gray-900">Format PDF</span>
            </div>
            <div className="text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <ReportDateRangeDialog 
        open={openDialog !== null} 
        onOpenChange={open => !open && setOpenDialog(null)} 
        title={getDialogTitle(openDialog)} 
        onGenerate={(fromDate, toDate) => handleGenerate(getReportName(openDialog), fromDate, toDate)} 
      />

      <GeneratedReportsTable 
        reports={reports} 
        onSendEmail={handleSendEmail} 
        onDeleteReport={deleteReport} 
        onDownloadReport={downloadReport} 
      />

      <EmailReportDialog 
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen} 
        report={selectedReport} 
        onSend={handleEmailSend} 
      />
    </div>
  );
};
export default ReportContent;