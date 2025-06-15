
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface GeneratedReport {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel';
  fromDate: Date;
  toDate: Date;
  generatedAt: Date;
  status: 'generating' | 'ready' | 'sent' | 'error';
  fileUrl?: string;
}

export const useGeneratedReports = () => {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const { toast } = useToast();

  const addReport = (type: string, fromDate: Date, toDate: Date) => {
    const reportTypeMap: Record<string, GeneratedReport['type']> = {
      'Bilan mensuel': 'monthly',
      'Bilan trimestriel': 'quarterly',
      'Bilan annuel': 'yearly',
      'Export FEC': 'fec',
      'Export CSV': 'csv',
      'Export Excel': 'excel'
    };

    const newReport: GeneratedReport = {
      id: `report-${Date.now()}`,
      name: type,
      type: reportTypeMap[type] || 'monthly',
      fromDate,
      toDate,
      generatedAt: new Date(),
      status: 'generating'
    };

    setReports(prev => [newReport, ...prev]);

    // Simuler la génération
    setTimeout(() => {
      setReports(prev => 
        prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'ready', fileUrl: `/downloads/${report.id}.pdf` }
            : report
        )
      );
    }, 2000);

    return newReport.id;
  };

  const sendEmail = async (reportId: string, email: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const fromDateStr = format(report.fromDate, 'dd/MM/yyyy', { locale: fr });
    const toDateStr = format(report.toDate, 'dd/MM/yyyy', { locale: fr });

    // Marquer le rapport comme envoyé
    setReports(prev => 
      prev.map(r => 
        r.id === reportId 
          ? { ...r, status: 'sent' }
          : r
      )
    );

    toast({
      title: "Email envoyé",
      description: `${report.name} envoyé à ${email} pour la période du ${fromDateStr} au ${toDateStr}`,
    });
  };

  return {
    reports,
    addReport,
    sendEmail
  };
};
