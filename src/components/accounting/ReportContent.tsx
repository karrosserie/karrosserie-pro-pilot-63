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
  return (
    <div className="space-y-6">
      {/* Section Rapports sociaux */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-karrosserie-orange rounded"></div>
          <h3 className="text-lg font-semibold text-foreground">Rapports sociaux</h3>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/presence-pointages')} 
            className="flex flex-col items-center gap-3 p-6 h-auto min-h-[120px] w-full max-w-sm hover:bg-muted/50 transition-colors"
          >
            <div className="p-3 rounded-full bg-karrosserie-orange/10">
              <Clock className="h-8 w-8 text-karrosserie-orange" />
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">Présence & Pointages</div>
              <div className="text-sm text-muted-foreground">Géolocalisé</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Section Export comptable */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-primary rounded"></div>
          <h4 className="text-lg font-semibold text-foreground">Export pour cabinet comptable</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={() => setOpenDialog('fec')} 
            className="flex items-center justify-center gap-3 p-4 h-16 hover:bg-muted/50 transition-colors"
          >
            <Download className="h-5 w-5 text-primary" />
            <span className="font-medium">Format FEC</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setOpenDialog('csv')} 
            className="flex items-center justify-center gap-3 p-4 h-16 hover:bg-muted/50 transition-colors"
          >
            <Download className="h-5 w-5 text-karrosserie-orange" />
            <span className="font-medium">Format CSV</span>
          </Button>
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