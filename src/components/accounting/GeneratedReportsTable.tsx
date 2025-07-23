
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
import { Badge } from '@/components/ui/badge';
import { Download, Mail, Trash2 } from 'lucide-react';
import { GeneratedReport } from '@/hooks/use-generated-reports';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneratedReportsTableProps {
  reports: GeneratedReport[];
  onSendEmail: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onDownloadReport: (reportId: string) => void;
}

export const GeneratedReportsTable = ({ reports, onSendEmail, onDeleteReport, onDownloadReport }: GeneratedReportsTableProps) => {
  const getStatusBadge = (status: GeneratedReport['status']) => {
    switch (status) {
      case 'generating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'ready':
        return <Badge variant="default" className="bg-green-100 text-green-800">Prêt</Badge>;
      case 'sent':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Envoyé</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
    }
  };

  const handleDownload = (reportId: string) => {
    onDownloadReport(reportId);
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Rapports générés</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6 sm:py-8">
          <p className="text-gray-500 text-sm sm:text-base">Aucun rapport généré pour le moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Rapports générés</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[120px]">Nom du rapport</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[140px]">Période</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[120px] hidden sm:table-cell">Date de génération</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[80px]">Statut</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm text-right min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow 
                  key={report.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <TableCell className="font-medium text-xs sm:text-sm">
                    <div className="max-w-[100px] sm:max-w-none truncate">
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs sm:text-sm">
                      <div className="sm:hidden">
                        {format(report.fromDate, 'dd/MM/yy', { locale: fr })} - {format(report.toDate, 'dd/MM/yy', { locale: fr })}
                      </div>
                      <div className="hidden sm:block">
                        Du {format(report.fromDate, 'dd/MM/yyyy', { locale: fr })} au {format(report.toDate, 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-xs sm:text-sm text-gray-600">
                      {format(report.generatedAt, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(report.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(report.id)}
                        disabled={report.status !== 'ready'}
                        className="h-8 w-8 p-0"
                        title="Télécharger"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onSendEmail(report.id)}
                        disabled={report.status !== 'ready'}
                        className="h-8 w-8 p-0"
                        title="Envoyer par e-mail"
                      >
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteReport(report.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
