
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useToast } from '@/hooks/use-toast';
import { ExpertiseReportUploader } from '@/components/expertise/ExpertiseReportUploader';
import ExpertiseReportDialog from '@/components/expertise/ExpertiseReportDialog';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import ExpertiseReportHeader from '@/components/expertise/ExpertiseReportHeader';
import ExpertiseReportFilters from '@/components/expertise/ExpertiseReportFilters';
import ExpertiseReportTable from '@/components/expertise/ExpertiseReportTable';

const ExpertiseReports = () => {
  const { reports, isLoading, error, deleteReport } = useExpertiseReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ExpertiseReport | null>(null);
  const { toast } = useToast();
  
  const filteredReports = reports?.filter(report => {
    const matchesSearch = report.report_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.clients && `${report.clients.first_name} ${report.clients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Safe vehicle search with proper null checking
    let vehicleMatch = false;
    const vehicle = report.vehicles;
    
    // Use a type guard function to properly narrow the type
    const isValidVehicle = (v: any): v is { car_brands?: { name?: string }; car_models?: { name?: string }; license_plate?: string } => {
      return v !== null && v !== undefined && typeof v === 'object' && 
             'car_brands' in v && 'car_models' in v && 'license_plate' in v;
    };
    
    if (isValidVehicle(vehicle)) {
      const vehicleString = `${vehicle.car_brands?.name || 'Marque inconnue'} ${vehicle.car_models?.name || 'Modèle inconnu'} - ${vehicle.license_plate || ''}`;
      vehicleMatch = vehicleString.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return matchesSearch || vehicleMatch;
  }) || [];
  
  const handleEditReport = (report: ExpertiseReport) => {
    setSelectedReport(report);
    setEditDialogOpen(true);
  };

  const handleDeleteReport = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport d\'expertise ?')) {
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
  
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8">
        <ExpertiseReportHeader 
          title="Rapports d'expertise"
          description="Consultez et gérez les rapports d'expertise automobile."
        />
        
        <ExpertiseReportFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onImportClick={() => setImportDialogOpen(true)}
        />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ExpertiseReportTable 
            reports={filteredReports}
            isLoading={isLoading}
            error={error as Error | null}
            onEditReport={handleEditReport}
            onDeleteReport={handleDeleteReport}
          />
        </div>

        {/* Import Rapport Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Importer un rapport d'expertise</DialogTitle>
              <DialogDescription className="text-sm">
                Importez un rapport d'expertise au format PDF.
              </DialogDescription>
            </DialogHeader>
            <ExpertiseReportUploader 
              onSuccess={() => setImportDialogOpen(false)}
              onCancel={() => setImportDialogOpen(false)}
              className="mt-4"
            />
          </DialogContent>
        </Dialog>

        {/* Edit Rapport Dialog */}
        <ExpertiseReportDialog
          report={selectedReport}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />

      </div>
    </div>
  );
};

export default ExpertiseReports;
