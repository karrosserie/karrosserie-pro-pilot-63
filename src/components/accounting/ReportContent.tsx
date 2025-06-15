import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { ReportDateRangeDialog } from './ReportDateRangeDialog';
import { GeneratedReportsTable } from './GeneratedReportsTable';
import { EmailReportDialog } from './EmailReportDialog';
import { useToast } from '@/hooks/use-toast';
import { useGeneratedReports, GeneratedReport } from '@/hooks/use-generated-reports';

type DialogType = 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel' | null;

const ReportContent = () => {
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const { toast } = useToast();
  const { reports, addReport, sendEmail } = useGeneratedReports();

  const handleGenerate = (type: string, fromDate: Date, toDate: Date) => {
    const reportId = addReport(type, fromDate, toDate);
    
    toast({
      title: "Génération en cours",
      description: `${type} en cours de génération...`,
    });

    setTimeout(() => {
      toast({
        title: "Fichier généré",
        description: `${type} prêt au téléchargement.`,
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
      case 'monthly': return 'Générer le bilan mensuel';
      case 'quarterly': return 'Générer le bilan trimestriel';
      case 'yearly': return 'Générer le bilan annuel';
      case 'fec': return 'Export au format FEC';
      case 'csv': return 'Export au format CSV';
      case 'excel': return 'Export au format Excel';
      default: return '';
    }
  };

  const getReportName = (type: DialogType): string => {
    switch (type) {
      case 'monthly': return 'Bilan mensuel';
      case 'quarterly': return 'Bilan trimestriel';
      case 'yearly': return 'Bilan annuel';
      case 'fec': return 'Export FEC';
      case 'csv': return 'Export CSV';
      case 'excel': return 'Export Excel';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-container p-6">
        <h3 className="text-lg font-semibold mb-4">Rapports financiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="flex flex-col p-6 h-auto items-center justify-center"
            onClick={() => setOpenDialog('monthly')}
          >
            <FileText className="h-8 w-8 mb-2" />
            <span className="font-medium">Bilan mensuel</span>
            <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col p-6 h-auto items-center justify-center"
            onClick={() => setOpenDialog('quarterly')}
          >
            <FileText className="h-8 w-8 mb-2" />
            <span className="font-medium">Bilan trimestriel</span>
            <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col p-6 h-auto items-center justify-center"
            onClick={() => setOpenDialog('yearly')}
          >
            <FileText className="h-8 w-8 mb-2" />
            <span className="font-medium">Bilan annuel</span>
            <span className="text-sm text-gray-500 mt-1">Générer un PDF</span>
          </Button>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-4">Export pour cabinet comptable</h4>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline"
              onClick={() => setOpenDialog('fec')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter au format FEC
            </Button>
            <Button 
              variant="outline"
              onClick={() => setOpenDialog('csv')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter au format CSV
            </Button>
            <Button 
              variant="outline"
              onClick={() => setOpenDialog('excel')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter au format Excel
            </Button>
          </div>
        </div>

        <ReportDateRangeDialog
          open={openDialog !== null}
          onOpenChange={(open) => !open && setOpenDialog(null)}
          title={getDialogTitle(openDialog)}
          onGenerate={(fromDate, toDate) => handleGenerate(getReportName(openDialog), fromDate, toDate)}
        />
      </div>

      <GeneratedReportsTable 
        reports={reports}
        onSendEmail={handleSendEmail}
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
