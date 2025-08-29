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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-karrosserie-orange/5 border border-karrosserie-orange/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-karrosserie-orange/5 to-transparent opacity-50"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-karrosserie-orange to-primary rounded-full shadow-sm"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-karrosserie-orange via-primary to-karrosserie-orange bg-clip-text text-transparent">
              Rapports sociaux
            </h3>
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/presence-pointages')} 
              className="group relative overflow-hidden rounded-xl p-8 h-auto items-center justify-center min-h-[140px] w-full max-w-sm border-2 border-karrosserie-orange/30 hover:border-karrosserie-orange bg-gradient-to-br from-background to-karrosserie-orange/5 hover:from-karrosserie-orange/5 hover:to-karrosserie-orange/10 transition-all duration-500 hover:shadow-2xl hover:shadow-karrosserie-orange/25 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex flex-col items-center">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-karrosserie-orange/20 to-primary/20 mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Clock className="h-10 w-10 text-karrosserie-orange group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="font-bold text-lg text-karrosserie-orange group-hover:text-primary transition-colors duration-300">
                  Présence & Pointages
                </span>
                <span className="text-sm text-muted-foreground mt-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  Géolocalisé • Temps réel
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Section Export comptable */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-primary/5 border border-primary/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50"></div>
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-karrosserie-orange rounded-full shadow-sm"></div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-primary via-karrosserie-orange to-primary bg-clip-text text-transparent">
              Export pour cabinet comptable
            </h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog('fec')} 
              className="group relative overflow-hidden rounded-xl p-6 h-auto flex-col items-center justify-center min-h-[120px] border-2 border-primary/30 hover:border-primary bg-gradient-to-br from-background to-primary/5 hover:from-primary/5 hover:to-primary/10 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/25 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex flex-col items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-karrosserie-orange/20 mb-3 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <Download className="h-8 w-8 text-primary group-hover:text-karrosserie-orange transition-colors duration-300" />
                </div>
                <span className="font-bold text-base text-primary group-hover:text-karrosserie-orange transition-colors duration-300">
                  Format FEC
                </span>
                <span className="text-xs text-muted-foreground mt-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  Fichier Comptable Standard
                </span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog('csv')} 
              className="group relative overflow-hidden rounded-xl p-6 h-auto flex-col items-center justify-center min-h-[120px] border-2 border-karrosserie-orange/30 hover:border-karrosserie-orange bg-gradient-to-br from-background to-karrosserie-orange/5 hover:from-karrosserie-orange/5 hover:to-karrosserie-orange/10 transition-all duration-500 hover:shadow-2xl hover:shadow-karrosserie-orange/25 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex flex-col items-center">
                <div className="p-3 rounded-xl bg-gradient-to-br from-karrosserie-orange/20 to-primary/20 mb-3 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                  <Download className="h-8 w-8 text-karrosserie-orange group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="font-bold text-base text-karrosserie-orange group-hover:text-primary transition-colors duration-300">
                  Format CSV
                </span>
                <span className="text-xs text-muted-foreground mt-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  Export Données Tableur
                </span>
              </div>
            </Button>
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