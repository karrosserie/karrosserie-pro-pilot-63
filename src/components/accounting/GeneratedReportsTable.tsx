
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
import { Download, Mail, MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GeneratedReport } from '@/hooks/use-generated-reports';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneratedReportsTableProps {
  reports: GeneratedReport[];
  onSendEmail: (reportId: string) => void;
}

export const GeneratedReportsTable = ({ reports, onSendEmail }: GeneratedReportsTableProps) => {
  const getStatusBadge = (status: GeneratedReport['status']) => {
    switch (status) {
      case 'generating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'ready':
        return <Badge variant="default" className="bg-green-100 text-green-800">Prêt</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
    }
  };

  const handleDownload = (report: GeneratedReport) => {
    // Simuler le téléchargement
    console.log(`Téléchargement de ${report.name}`);
  };

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rapports générés</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Aucun rapport généré pour le moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rapports générés</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="font-semibold">Nom du rapport</TableHead>
              <TableHead className="font-semibold">Période</TableHead>
              <TableHead className="font-semibold">Date de génération</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow 
                key={report.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <TableCell className="font-medium">
                  {report.name}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    Du {format(report.fromDate, 'dd/MM/yyyy', { locale: fr })} au {format(report.toDate, 'dd/MM/yyyy', { locale: fr })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
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
                      onClick={() => handleDownload(report)}
                      disabled={report.status !== 'ready'}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onSendEmail(report.id)}
                      disabled={report.status !== 'ready'}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(report)}>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSendEmail(report.id)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Envoyer par email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
