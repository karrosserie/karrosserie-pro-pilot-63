
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText, Eye, Pencil, Trash, Download, User, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ExpertiseReportTableProps {
  reports: ExpertiseReport[];
  isLoading: boolean;
  error: Error | null;
  onViewReport: (report: ExpertiseReport) => void;
  onEditReport: (report: ExpertiseReport) => void;
  onDeleteReport: (id: string) => void;
}

// Define a type that extends ExpertiseReport to include the joined data
interface ExpertiseReportWithRelations extends ExpertiseReport {
  clients?: {
    first_name: string;
    last_name: string;
  } | null;
  vehicles?: {
    brand: string;
    model: string;
    license_plate: string;
  } | null;
}

const ExpertiseReportTable: React.FC<ExpertiseReportTableProps> = ({
  reports,
  isLoading,
  error,
  onViewReport,
  onEditReport,
  onDeleteReport
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Importé':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En cours d\'analyse':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'En attente':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Validé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejeté':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'Non spécifié';
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Chargement des rapports d'expertise...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erreur lors du chargement des rapports d'expertise.</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Numéro de rapport</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Expert</TableHead>
              <TableHead className="w-[120px]">Montant</TableHead>
              <TableHead className="w-[120px]">Statut</TableHead>
              <TableHead className="text-right w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => {
                // Cast the report to include the joined data
                const reportWithRelations = report as ExpertiseReportWithRelations;
                
                return (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-600" />
                        {report.report_number || report.reference || 'Non spécifié'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(report.created_at || '').toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {reportWithRelations.clients ? (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">
                            {reportWithRelations.clients.first_name} {reportWithRelations.clients.last_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Non assigné</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {reportWithRelations.vehicles ? (
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {reportWithRelations.vehicles.brand} {reportWithRelations.vehicles.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reportWithRelations.vehicles.license_plate}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Non assigné</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={report.expert_name ? 'font-medium' : 'text-gray-400 italic'}>
                        {report.expert_name || 'Non spécifié'}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(report.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(report.status || '')} font-medium`}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => onViewReport(report)}
                              disabled={!report.document_url}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {report.document_url ? 'Voir le document' : 'Aucun document'}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => window.open(report.document_url, '_blank')}
                              disabled={!report.document_url}
                              className="h-8 w-8"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {report.document_url ? 'Télécharger' : 'Aucun document'}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => onEditReport(report)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Modifier le rapport
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-700 h-8 w-8"
                              onClick={() => onDeleteReport(report.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Supprimer le rapport
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">Aucun rapport d'expertise</h3>
                    <p className="text-gray-500">
                      Commencez par créer ou importer votre premier rapport d'expertise.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default ExpertiseReportTable;
