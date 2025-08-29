import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { ReportDateRangeDialog } from './ReportDateRangeDialog';
import { GeneratedReportsTable } from './GeneratedReportsTable';
import { EmailReportDialog } from './EmailReportDialog';
import { useToast } from '@/hooks/use-toast';
import { useGeneratedReports, GeneratedReport } from '@/hooks/use-generated-reports';
type DialogType = 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel' | 'social' | null;
const ReportContent = () => {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const {
    toast
  } = useToast();
  const {
    reports,
    addReport,
    sendEmail,
    deleteReport,
    downloadReport
  } = useGeneratedReports();
  const handleGenerate = (type: string, fromDate: Date, toDate: Date) => {
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
      default:
        return '';
    }
  };
  return <div className="space-y-4 sm:space-y-6">
      <div className="card-container p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Rapports financiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button variant="outline" className="flex flex-col p-4 sm:p-6 h-auto items-center justify-center min-h-[100px] sm:min-h-[120px]" onClick={() => setOpenDialog('fec')}>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
            <span className="font-medium text-sm sm:text-base">Export FEC</span>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">Générer un fichier</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col p-4 sm:p-6 h-auto items-center justify-center min-h-[100px] sm:min-h-[120px]" onClick={() => setOpenDialog('monthly')}>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
            <span className="font-medium text-sm sm:text-base">Bilan sociale</span>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">Générer un PDF</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col p-4 sm:p-6 h-auto items-center justify-center min-h-[100px] sm:min-h-[120px]" onClick={() => setOpenDialog('csv')}>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 mb-2" />
            <span className="font-medium text-sm sm:text-base">Export CSV</span>
            <span className="text-xs sm:text-sm text-gray-500 mt-1">Générer un fichier</span>
          </Button>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <h4 className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Autres exports</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <Button variant="outline" onClick={() => setOpenDialog('excel')} className="w-full justify-center h-10 sm:h-11">
              <Download className="h-4 w-4 mr-2" />
              <span className="text-sm sm:text-base">Format Excel</span>
            </Button>
          </div>
        </div>

        <ReportDateRangeDialog open={openDialog !== null} onOpenChange={open => !open && setOpenDialog(null)} title={getDialogTitle(openDialog)} onGenerate={(fromDate, toDate) => handleGenerate(getReportName(openDialog), fromDate, toDate)} />
      </div>

      <GeneratedReportsTable reports={reports} onSendEmail={handleSendEmail} onDeleteReport={deleteReport} onDownloadReport={downloadReport} />

      <EmailReportDialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen} report={selectedReport} onSend={handleEmailSend} />
    </div>;
};
export default ReportContent;