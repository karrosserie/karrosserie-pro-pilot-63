
import React, { useEffect, useState } from 'react';
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
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Met à jour l'heure actuelle chaque seconde pour gérer l'animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Vérifie si un rapport est nouveau (généré dans la dernière minute)
  const isNewReport = (report: GeneratedReport): boolean => {
    const reportTime = new Date(report.generatedAt);
    const timeDifference = currentTime.getTime() - reportTime.getTime();
    const oneMinuteInMs = 60 * 1000; // 1 minute en millisecondes
    return timeDifference <= oneMinuteInMs;
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
                <TableHead className="font-semibold text-xs sm:text-sm text-right min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => {
                const isNew = isNewReport(report);
                return (
                  <TableRow 
                    key={report.id}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${
                      isNew ? 'animate-pulse bg-blue-50 border border-blue-200 shadow-lg' : ''
                    }`}
                  >
                    <TableCell className={`font-medium text-xs sm:text-sm ${isNew ? 'text-blue-700 font-semibold' : ''}`}>
                      <div className="max-w-[100px] sm:max-w-none truncate flex items-center gap-2">
                        {report.name}
                        {isNew && <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">Nouveau</Badge>}
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(report.id)}
                          className="h-8 w-8 p-0"
                          title="Télécharger"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onSendEmail(report.id)}
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
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
