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
    <div className="space-y-8 max-w-2xl mx-auto">
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