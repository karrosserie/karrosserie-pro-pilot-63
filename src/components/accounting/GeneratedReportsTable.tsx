
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
      <Card className="bg-gradient-to-br from-background to-muted/20 border border-karrosserie-orange/20">
        <CardHeader className="bg-gradient-to-r from-karrosserie-orange/5 to-primary/5 border-b border-karrosserie-orange/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-karrosserie-orange to-primary rounded-full"></div>
            <CardTitle className="text-base sm:text-lg bg-gradient-to-r from-karrosserie-orange to-primary bg-clip-text text-transparent">Rapports générés</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center py-6 sm:py-8">
          <div className="p-4 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-muted-foreground/20">
            <p className="text-muted-foreground text-sm sm:text-base">Aucun rapport généré pour le moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-background to-muted/20 border border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-karrosserie-orange/5 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-primary to-karrosserie-orange rounded-full"></div>
          <CardTitle className="text-base sm:text-lg bg-gradient-to-r from-primary to-karrosserie-orange bg-clip-text text-transparent">Rapports générés</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-primary/20 bg-gradient-to-r from-muted/30 to-transparent">
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[120px] text-primary">Nom du rapport</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[140px] text-primary">Période</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[120px] hidden sm:table-cell text-primary">Date de génération</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm text-right min-w-[100px] text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => {
                const isNew = isNewReport(report);
                return (
                  <TableRow 
                    key={report.id}
                    onClick={() => handleDownload(report.id)}
                    className={`cursor-pointer hover:bg-gradient-to-r hover:from-karrosserie-orange/10 hover:to-primary/10 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 border-l-2 border-l-transparent hover:border-l-karrosserie-orange ${
                      isNew ? 'animate-pulse bg-gradient-to-r from-karrosserie-orange/10 to-primary/10 border-l-4 border-l-karrosserie-orange shadow-md' : ''
                    }`}
                  >
                    <TableCell className={`font-medium text-xs sm:text-sm transition-colors duration-200 hover:text-karrosserie-orange ${isNew ? 'text-karrosserie-orange font-semibold' : ''}`}>
                      <div className="max-w-[100px] sm:max-w-none truncate flex items-center gap-2">
                        {report.name}
                        {isNew && <Badge variant="secondary" className="text-xs bg-gradient-to-r from-karrosserie-orange/20 to-primary/20 text-karrosserie-orange border border-karrosserie-orange/30">Nouveau</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="transition-colors duration-200 hover:text-primary">
                      <div className="text-xs sm:text-sm">
                        <div className="sm:hidden">
                          {format(report.fromDate, 'dd/MM/yy', { locale: fr })} - {format(report.toDate, 'dd/MM/yy', { locale: fr })}
                        </div>
                        <div className="hidden sm:block">
                          Du {format(report.fromDate, 'dd/MM/yyyy', { locale: fr })} au {format(report.toDate, 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell transition-colors duration-200 hover:text-primary">
                      <div className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                        {format(report.generatedAt, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(report.id);
                          }}
                          className="h-8 w-8 p-0 hover:bg-karrosserie-orange/10 hover:text-karrosserie-orange hover:scale-110 transition-all duration-200"
                          title="Télécharger"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSendEmail(report.id);
                          }}
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-200"
                          title="Envoyer par e-mail"
                        >
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteReport(report.id);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all duration-200"
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
