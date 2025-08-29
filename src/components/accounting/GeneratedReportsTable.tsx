
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Download, Mail, Trash2 } from 'lucide-react';
import { GeneratedReport } from '@/hooks/use-generated-reports';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GeneratedReportsTableProps {
  reports: GeneratedReport[];
  onSendEmail: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onDownloadReport: (reportId: string) => void;
}

export const GeneratedReportsTable = ({ reports, onSendEmail, onDeleteReport, onDownloadReport }: GeneratedReportsTableProps) => {
  const handleDownload = (reportId: string) => {
    onDownloadReport(reportId);
  };

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-karrosserie-orange rounded"></div>
        <h2 className="text-xl font-medium text-slate-700">Rapports générés</h2>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium text-gray-900">Nom du rapport</TableHead>
                <TableHead className="font-medium text-gray-900">Période</TableHead>
                <TableHead className="font-medium text-gray-900">Date de génération</TableHead>
                <TableHead className="font-medium text-gray-900 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">
                    {report.name}
                  </TableCell>
                  <TableCell className="text-karrosserie-orange">
                    Du {format(report.fromDate, 'dd/MM/yyyy', { locale: fr })} au {format(report.toDate, 'dd/MM/yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell className="text-blue-600">
                    {format(report.generatedAt, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(report.id)}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onSendEmail(report.id)}
                        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteReport(report.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
