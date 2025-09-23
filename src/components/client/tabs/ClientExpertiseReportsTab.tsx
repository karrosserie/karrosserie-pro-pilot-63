
import React, { useState, useEffect } from 'react';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useReportToQuote } from '@/hooks/use-report-to-quote';
import { Table, TableBody } from '@/components/ui/table';
import { FileText, Trash, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import ExpertiseReportDialog from '@/components/expertise/ExpertiseReportDialog';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { ExpertiseReportTableHeader } from '@/components/expertise/table/ExpertiseReportTableHeader';
import { TableCell, TableRow } from '@/components/ui/table';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface ClientExpertiseReportsTabProps {
  clientId: string;
}

const ClientExpertiseReportsTab: React.FC<ClientExpertiseReportsTabProps> = ({ clientId }) => {
  const { reports, isLoading, deleteReport } = useExpertiseReports();
  const { checkMultipleReports, isConverted, convertedReports } = useReportToQuote();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ExpertiseReport | null>(null);

  const clientReports = reports?.filter(report => report.client_id === clientId) || [];
  const { sortedData, sortConfig, handleSort } = useTableSorting(clientReports, 'created_at');

  // Vérifier le statut de conversion des rapports quand ils changent
  useEffect(() => {
    if (sortedData && sortedData.length > 0) {
      checkMultipleReports(sortedData);
    }
  }, [sortedData, checkMultipleReports]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
      </div>
    );
  }

  const handleEditReport = (report: ExpertiseReport) => {
    setSelectedReport(report);
    setEditDialogOpen(true);
  };

  const handleDeleteReport = async (id: string) => {
    const confirmed = await confirm({
      title: 'Supprimer le rapport d\'expertise',
      description: 'Êtes-vous sûr de vouloir supprimer ce rapport d\'expertise ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      try {
        await deleteReport.mutateAsync(id);
        toast({
          title: "Rapport supprimé",
          description: "Le rapport d'expertise a été supprimé avec succès."
        });
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: `Impossible de supprimer le rapport d'expertise: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  };

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'converti':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'en cours':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'importé':
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusDisplay = (report: ExpertiseReport) => {
    // Utiliser la même logique que le composant principal
    const status = isConverted(report.id) ? 'Converti' : (report.status || 'Importé');
    return (
      <Badge 
        variant="outline" 
        className={`${getStatusColor(status)} font-medium`}
      >
        {status}
      </Badge>
    );
  };

  if (sortedData.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucun rapport d'expertise</h3>
        <p className="mt-1 text-sm text-gray-500">Ce client n'a pas encore de rapport d'expertise.</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        <div className="card-container p-0">
            <Table>
              <ExpertiseReportTableHeader 
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((report) => (
                  <React.Fragment key={report.id}>
                    <TableRow className="hover:bg-gray-50 border-b-0">
                      <TableCell>
                        {report.report_number || 'Non spécifié'}
                      </TableCell>
                      <TableCell>
                        {report.report_date ? new Date(report.report_date).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                      </TableCell>
                      <TableCell>
                        {report.clients ? (
                          <span>
                            {report.clients.first_name} {report.clients.last_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Non assigné</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {report.vehicles 
                          ? `${report.vehicles.car_brands?.name || 'Marque inconnue'} ${report.vehicles.car_models?.name || 'Modèle inconnu'} - ${report.vehicles.license_plate || 'Plaque non spécifiée'}`
                          : 'Non assigné'
                        }
                      </TableCell>
                      <TableCell>
                        {formatAmount(report.amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusDisplay(report)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-t-0">
                      <TableCell colSpan={6} className="py-3 border-t-0">
                        <div className="flex flex-wrap gap-2 justify-end px-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  if (report.document_url) {
                                    const link = document.createElement('a');
                                    link.href = report.document_url;
                                    link.download = `rapport-expertise-${report.report_number || report.id}.pdf`;
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }
                                }}
                                disabled={!report.document_url}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Télécharger
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {!report.document_url ? 'Aucun document disponible' : 'Télécharger le rapport'}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                                onClick={() => handleDeleteReport(report.id)}
                                disabled={isConverted(report.id)}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {isConverted(report.id) ? 'Impossible de supprimer un rapport converti' : 'Supprimer le rapport'}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileText className="h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Aucun rapport d'expertise</h3>
                      <p className="text-gray-500 mt-1">
                        Ce client n'a pas encore de rapport d'expertise.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Report Dialog */}
        <ExpertiseReportDialog
          report={selectedReport}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      </>
    </TooltipProvider>
  );
};

export default ClientExpertiseReportsTab;
