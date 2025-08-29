import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
      <div className="card-container p-3 sm:p-4 md:p-6 bg-gradient-to-br from-background to-muted/20 border border-karrosserie-orange/20 shadow-lg">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <div className="w-2 h-6 bg-gradient-to-b from-karrosserie-orange to-primary rounded-full"></div>
          <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-karrosserie-orange to-primary bg-clip-text text-transparent">Rapports financiers</h3>
        </div>
        
        <div className="flex justify-center mb-4 sm:mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/presence-pointages')} 
            className="flex flex-col p-4 sm:p-6 h-auto items-center justify-center min-h-[100px] sm:min-h-[120px] w-full max-w-xs border-karrosserie-orange/30 hover:border-karrosserie-orange hover:bg-karrosserie-orange/5 transition-all duration-300 hover:shadow-md hover:shadow-karrosserie-orange/20"
          >
            <div className="p-2 rounded-full bg-karrosserie-orange/10 mb-2">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-karrosserie-orange" />
            </div>
            <span className="font-medium text-sm sm:text-base text-karrosserie-orange">Présence & Pointages</span>
            <span className="text-xs sm:text-sm text-muted-foreground mt-1">Géolocalisé</span>
          </Button>
        </div>
        
        <div className="mb-4 sm:mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-karrosserie-orange/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-1.5 h-5 bg-primary rounded-full"></div>
            <h4 className="font-medium text-sm sm:text-base text-primary">Export pour cabinet comptable</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog('fec')} 
              className="w-full justify-center h-10 sm:h-11 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-200 hover:shadow-sm"
            >
              <Download className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm sm:text-base">Format FEC</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog('csv')} 
              className="w-full justify-center h-10 sm:h-11 border-karrosserie-orange/30 hover:border-karrosserie-orange hover:bg-karrosserie-orange/10 transition-all duration-200 hover:shadow-sm"
            >
              <Download className="h-4 w-4 mr-2 text-karrosserie-orange" />
              <span className="text-sm sm:text-base">Format CSV</span>
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