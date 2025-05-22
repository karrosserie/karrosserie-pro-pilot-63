
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText, Eye, Pencil, Trash, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

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
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Validé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Référence</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Expert</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.length > 0 ? (
          reports.map((report) => {
            // Cast the report to include the joined data
            const reportWithRelations = report as ExpertiseReportWithRelations;
            
            return (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.reference}</TableCell>
                <TableCell>{new Date(report.created_at || '').toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  {reportWithRelations.clients 
                    ? `${reportWithRelations.clients.first_name} ${reportWithRelations.clients.last_name}` 
                    : 'Non assigné'}
                </TableCell>
                <TableCell>
                  {reportWithRelations.vehicles 
                    ? `${reportWithRelations.vehicles.brand} ${reportWithRelations.vehicles.model} - ${reportWithRelations.vehicles.license_plate}` 
                    : 'Non assigné'}
                </TableCell>
                <TableCell>{report.expert_name || 'Non spécifié'}</TableCell>
                <TableCell>{report.amount 
                  ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(report.amount)
                  : 'Non spécifié'}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status || '')}`}>
                    {report.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewReport(report)}
                      disabled={!report.document_url}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => window.open(report.document_url, '_blank')}
                      disabled={!report.document_url}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEditReport(report)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDeleteReport(report.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4">
              <div className="flex flex-col items-center justify-center py-8">
                <FileText className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                <p className="text-gray-500 mt-1">
                  Aucun rapport d'expertise correspondant à votre recherche n'a été trouvé.
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ExpertiseReportTable;
