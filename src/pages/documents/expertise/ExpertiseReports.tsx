
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import { useExpertiseReports } from '@/hooks/use-expertise-reports';
import { useReportToQuote } from '@/hooks/use-report-to-quote';
import { useEnvironment } from '@/hooks/use-environment';
import { useImports } from '@/hooks/use-imports';
import { useImportNotification } from '@/hooks/use-import-notification';
import { Quote } from '@/services/supabase/quotes';
import { generateNextQuoteNumber } from '@/components/quotes/form/utils/quoteNumber';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useConfirmation } from '@/hooks/use-confirmation';
import { ExpertiseReportUploader } from '@/components/expertise/ExpertiseReportUploader';
import ExpertiseReportDialog from '@/components/expertise/ExpertiseReportDialog';
import { ExpertiseReport } from '@/services/supabase/expertise-reports';
import ExpertiseReportHeader from '@/components/expertise/ExpertiseReportHeader';
import ExpertiseReportFilters, { ExpertiseSortOption } from '@/components/expertise/ExpertiseReportFilters';
import ExpertiseReportTable from '@/components/expertise/ExpertiseReportTable';
import ImportTable from '@/components/expertise/ImportTable';
import { useClientValidationNotification } from '@/contexts/ClientValidationNotificationContext';
import { ClientDataValidationReport } from '@/components/expertise/ClientDataValidationReport';
import { useNavigate } from 'react-router-dom';

const ExpertiseReports = () => {
  const { reports, isLoading, error, deleteReport } = useExpertiseReports();
  const { convertToQuote, checkMultipleReports, isConverting, isConverted, convertedReports } = useReportToQuote();
  const { settings: environmentSettings } = useEnvironment();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const { pendingImports, isLoading: importsLoading, deleteImport } = useImports();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<ExpertiseSortOption>('recent-first');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ExpertiseReport | null>(null);
  const [prefilledQuoteData, setPrefilledQuoteData] = useState<Partial<Quote> | null>(null);
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const navigate = useNavigate();
  
  // Activer les notifications sonores pour les imports terminés
  useImportNotification();
  
  // Gérer les notifications de validation client
  const { notification, clearNotification } = useClientValidationNotification();
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  
  // Afficher automatiquement la pop-up quand une notification arrive
  useEffect(() => {
    if (notification) {
      setValidationDialogOpen(true);
    }
  }, [notification]);

  // Vérifier si l'import asynchrone est activé et s'il y a des imports en attente
  const showImportTable = environmentSettings?.asynchronous_import && 
                          pendingImports && 
                          pendingImports.length > 0;
  
  const filteredAndSortedReports = React.useMemo(() => {
    const filtered = reports?.filter(report => {
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

    // Create a copy and sort - spread operator ensures new array reference
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'alphabetical-asc': {
          const aName = `${a.clients?.last_name || ''} ${a.clients?.first_name || ''}`.trim().toLowerCase();
          const bName = `${b.clients?.last_name || ''} ${b.clients?.first_name || ''}`.trim().toLowerCase();
          return aName.localeCompare(bName, 'fr', { sensitivity: 'base' });
        }
        case 'alphabetical-desc': {
          const aName = `${a.clients?.last_name || ''} ${a.clients?.first_name || ''}`.trim().toLowerCase();
          const bName = `${b.clients?.last_name || ''} ${b.clients?.first_name || ''}`.trim().toLowerCase();
          return bName.localeCompare(aName, 'fr', { sensitivity: 'base' });
        }
        case 'recent-first': {
          const dateA = a.report_date ? new Date(a.report_date).getTime() : 0;
          const dateB = b.report_date ? new Date(b.report_date).getTime() : 0;
          return dateB - dateA;
        }
        case 'oldest-first': {
          const dateA = a.report_date ? new Date(a.report_date).getTime() : 0;
          const dateB = b.report_date ? new Date(b.report_date).getTime() : 0;
          return dateA - dateB;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [reports, searchTerm, sortOption]);
  
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
      await deleteReport.mutateAsync(id);
    }
  };

  const handleDeleteImport = async (importId: string, reportId?: string) => {
    const confirmed = await confirm({
      title: 'Supprimer l\'import en cours',
      description: 'Êtes-vous sûr de vouloir supprimer cet import en cours d\'analyse ? Cette action est irréversible.',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });

    if (confirmed) {
      // Supprimer d'abord le rapport d'expertise associé s'il existe
      if (reportId) {
        await deleteReport.mutateAsync(reportId);
      }
      // Puis supprimer l'import
      await deleteImport.mutateAsync(importId);
    }
  };

  // Effet pour vérifier le statut de conversion des rapports au chargement initial
  useEffect(() => {
    const initializeReports = async () => {
      if (filteredAndSortedReports && filteredAndSortedReports.length > 0 && !initialCheckComplete) {
        await checkMultipleReports(filteredAndSortedReports);
        setInitialCheckComplete(true);
      }
    };
    
    initializeReports();
  }, [filteredAndSortedReports, checkMultipleReports, initialCheckComplete]);

  const handleConvertToQuote = async (report: ExpertiseReport) => {
    if (!report.client_id || !report.vehicle_id) {
      toast({
        title: "Erreur",
        description: "Le rapport doit avoir un client et un véhicule assignés pour être converti en devis.",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si déjà converti
    const isAlreadyConverted = convertedReports[report.id];
    if (isAlreadyConverted) {
      toast({
        title: "Information",
        description: "Ce rapport a déjà été converti en devis.",
        variant: "default"
      });
      return;
    }

    try {
      // Générer le numéro de devis automatiquement
      const quoteNumber = await generateNextQuoteNumber();
      // Générer la date courante pour le champ valid_until
      const currentDate = format(new Date(), 'yyyy-MM-dd');

      // Préparer les données préremplies pour le devis
      const prefilledData: Partial<Quote> = {
        reference: quoteNumber,
        valid_until: currentDate,
        client_id: report.client_id,
        vehicle_id: report.vehicle_id,
        report_id: report.id,
        status: 'En attente',
        notes: '', // Laisser vide pour que l'utilisateur puisse saisir ce qu'il veut
        amount: report.amount,
        claim_number: report.claim_number,
        policy_number: report.policy_number,
        incident_date: report.incident_date,
        expert_name: report.expert_name,
        report_number: report.report_number,
        report_date: report.report_date,
        repairs_data: report.repairs_data,
        parts_data: report.parts_data,
      };

      setPrefilledQuoteData(prefilledData);
      setQuoteDialogOpen(true);
    } catch (error) {
      console.error('Error preparing quote data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de préparer les données du devis.",
        variant: "destructive"
      });
    }
  };

  const getConvertingReportId = () => {
    return Object.keys(convertedReports).find(id => isConverting(id)) || null;
  };
  
  const handleEditClient = () => {
    if (!notification) return;
    
    navigate(`/clients?edit=${notification.clientId}`);
    setValidationDialogOpen(false);
    clearNotification();
  };
  
  const handleDismissValidation = () => {
    setValidationDialogOpen(false);
    clearNotification();
  };
  
  
  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <ExpertiseReportHeader 
        title="Rapports d'expertise"
        description="Consultez et gérez les rapports d'expertise automobile."
      />
      
      <ExpertiseReportFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onImportClick={() => setImportDialogOpen(true)}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      {/* Tableau conditionnel des imports en cours d'analyse */}
      {showImportTable && (
        <ImportTable 
          imports={pendingImports}
          isLoading={importsLoading}
          onDeleteImport={handleDeleteImport}
        />
      )}
      
      <div className="card-container">
        <ExpertiseReportTable 
          reports={filteredAndSortedReports}
          isLoading={isLoading || !initialCheckComplete}
          error={error as Error | null}
          onEditReport={handleEditReport}
          onDeleteReport={handleDeleteReport}
          onConvertToQuote={handleConvertToQuote}
          convertingReportId={getConvertingReportId()}
          convertedReports={convertedReports}
        />
      </div>

      {/* Import Rapport Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Importer un rapport d'expertise</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Importez un rapport d'expertise au format PDF.
            </DialogDescription>
          </DialogHeader>
          <ExpertiseReportUploader 
            onSuccess={() => setImportDialogOpen(false)}
            onCancel={() => setImportDialogOpen(false)}
            className="mt-3 sm:mt-4"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Rapport Dialog */}
      <ExpertiseReportDialog
        report={selectedReport}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* Quote Dialog for conversion */}
      <QuoteDialog
        quote={null}
        open={quoteDialogOpen}
        onOpenChange={(open) => {
          setQuoteDialogOpen(open);
          if (!open) {
            setPrefilledQuoteData(null);
          }
        }}
        prefillData={prefilledQuoteData}
      />

      {/* Pop-up de validation des données client */}
      {notification && (
        <ClientDataValidationReport
          open={validationDialogOpen}
          onOpenChange={setValidationDialogOpen}
          client={{
            id: notification.clientId,
            first_name: notification.clientName.split(' ')[0],
            last_name: notification.clientName.split(' ').slice(1).join(' ')
          }}
          validationResults={notification.validationResults}
          onEditClient={handleEditClient}
          onDismiss={handleDismissValidation}
        />
      )}

    </div>
  );
};

export default ExpertiseReports;
