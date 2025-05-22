
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, FileText, Plus, Filter, Download, Eye, Pencil, Trash, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ExpertiseReportUploader } from '@/components/expertise/ExpertiseReportUploader';
import ExpertiseReportDialog from '@/components/expertise/ExpertiseReportDialog';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';

const ExpertiseReports = () => {
  const { reports, isLoading, error, deleteReport } = useExpertiseReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ExpertiseReport | null>(null);
  const { toast } = useToast();
  
  const filteredReports = reports?.filter(report => 
    report.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.clients?.first_name + ' ' + report.clients?.last_name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.vehicles?.brand + ' ' + report.vehicles?.model)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.expert_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
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

  const handleViewReport = (report: ExpertiseReport) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleEditReport = (report: ExpertiseReport) => {
    setSelectedReport(report);
    setEditDialogOpen(true);
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce PV d\'expertise ?')) {
      try {
        await deleteReport.mutateAsync(id);
        toast({
          title: "PV supprimé",
          description: "Le PV d'expertise a été supprimé avec succès."
        });
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: `Impossible de supprimer le PV d'expertise: ${error.message}`,
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">PV d'expertise</h1>
        <p className="text-gray-600 mt-1">
          Consultez et gérez les procès-verbaux d'expertise automobile.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Button variant="outline" size="sm" className="mr-2">
            Tous
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            Importés
          </Button>
          <Button variant="outline" size="sm" className="mr-2">
            En attente
          </Button>
          <Button variant="outline" size="sm">
            Validés
          </Button>
        </div>
        
        <div className="flex items-center w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un PV..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={() => setImportDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer un PV
          </Button>
        </div>
      </div>
      
      <div className="card-container">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
            <span className="ml-2">Chargement des PV d'expertise...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Erreur lors du chargement des PV d'expertise.</p>
            <p className="text-sm text-gray-500 mt-2">{(error as Error).message}</p>
          </div>
        ) : (
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
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.reference}</TableCell>
                    <TableCell>{new Date(report.created_at || '').toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      {report.clients 
                        ? `${report.clients.first_name} ${report.clients.last_name}` 
                        : 'Non assigné'}
                    </TableCell>
                    <TableCell>
                      {report.vehicles 
                        ? `${report.vehicles.brand} ${report.vehicles.model} - ${report.vehicles.license_plate}` 
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
                          onClick={() => handleViewReport(report)}
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
                          onClick={() => handleEditReport(report)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    <div className="flex flex-col items-center justify-center py-8">
                      <FileText className="h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                      <p className="text-gray-500 mt-1">
                        Aucun PV d'expertise correspondant à votre recherche n'a été trouvé.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Import PV Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer un PV d'expertise</DialogTitle>
            <DialogDescription>
              Importez un procès verbal d'expertise au format PDF.
            </DialogDescription>
          </DialogHeader>
          <ExpertiseReportUploader 
            onSuccess={() => setImportDialogOpen(false)}
            onCancel={() => setImportDialogOpen(false)}
            className="mt-4"
          />
        </DialogContent>
      </Dialog>

      {/* Edit PV Dialog */}
      <ExpertiseReportDialog
        report={selectedReport}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* View Document Dialog */}
      {selectedReport && (
        <DocumentViewer
          url={selectedReport.document_url}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          title={`PV d'expertise - ${selectedReport.reference}`}
        />
      )}
    </div>
  );
};

export default ExpertiseReports;
