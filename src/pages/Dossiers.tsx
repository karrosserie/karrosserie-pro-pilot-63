import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Download, RefreshCw, Settings } from 'lucide-react';
import { DossierFilters } from '@/components/dossiers/DossierFilters';
import { DossierList } from '@/components/dossiers/DossierList';
import { DossierStatsRow } from '@/components/dossiers/DossierStatsRow';
import { NewDossierModal, NewDossierFormData } from '@/components/atelier/modals/NewDossierModal';
import { useDossiers, useArchiveDossier, useDossiersCountByStatus } from '@/hooks/useDossiers';
import { useCompanyId } from '@/hooks/use-company-id';
import { useAuth } from '@/contexts/AuthContext';
import { DossierOverallStatus } from '@/types/dossier';
import { toast } from 'sonner';
import { clientsService } from '@/services/supabase/clients';
import { vehiclesService } from '@/services/supabase/vehicles';
import { createRepairOrder } from '@/services/supabase/repair-orders/mutations';
import { repairOrdersService } from '@/services/supabase/repair-orders';
import { uploadVehiclePhoto } from '@/utils/vehiclePhotoService';
import { DateRange } from 'react-day-picker';

interface CapturedPhoto {
  blob: Blob;
  preview: string;
}

const Dossiers = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { companyId } = useCompanyId();

  const [activeTab, setActiveTab] = useState<'tous' | 'actifs' | 'archives'>('actifs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<DossierOverallStatus[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [showNewDossier, setShowNewDossier] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Statuses for active dossiers
  const activeStatuses: DossierOverallStatus[] = [
    'ouvert', 'en_cours', 'expertise', 'devis', 'reparation', 'facturation'
  ];

  // Fetch status counts for stats row
  const { data: statusCounts = {}, isLoading: isLoadingCounts, refetch: refetchCounts } = useDossiersCountByStatus(companyId);

  // Fetch all dossiers (for "Tous" tab)
  const { data: allDossiers = [], isLoading: isLoadingAll, refetch: refetchAll } = useDossiers({
    company_id: companyId,
    archived: false,
    search: searchQuery || undefined,
    overall_status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
  });

  // Fetch active dossiers (non-cloture, non-archive)
  const { data: activeDossiers = [], isLoading: isLoadingActive, refetch: refetchActive } = useDossiers({
    company_id: companyId,
    overall_status: selectedStatuses.length > 0 ? selectedStatuses : activeStatuses,
    archived: false,
    search: searchQuery || undefined,
  });

  // Fetch archived dossiers
  const { data: archivedDossiers = [], isLoading: isLoadingArchived, refetch: refetchArchived } = useDossiers({
    company_id: companyId,
    archived: true,
    search: searchQuery || undefined,
  });

  const archiveDossier = useArchiveDossier();

  // Determine current dossiers based on tab
  const currentDossiers = 
    activeTab === 'tous' ? allDossiers :
    activeTab === 'actifs' ? activeDossiers :
    archivedDossiers;

  const isLoading = 
    activeTab === 'tous' ? isLoadingAll :
    activeTab === 'actifs' ? isLoadingActive :
    isLoadingArchived;

  const handleViewDossier = (id: string) => {
    navigate(`/dossiers/${id}`);
  };

  const handleArchiveDossier = async (id: string) => {
    try {
      await archiveDossier.mutateAsync(id);
      toast.success('Dossier archivé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'archivage du dossier');
    }
  };

  const handleRefresh = () => {
    refetchAll();
    refetchActive();
    refetchArchived();
    refetchCounts();
    toast.success('Données actualisées');
  };

  const handleExport = () => {
    toast.info('Export en cours de développement');
  };

  const generateNextReference = async (): Promise<string> => {
    try {
      const lastOrder = await repairOrdersService.getLastOrderByUser();
      if (lastOrder?.reference) {
        const lastNum = parseInt(lastOrder.reference, 10);
        if (!isNaN(lastNum)) {
          return String(lastNum + 1);
        }
      }
      return '1';
    } catch (error) {
      return String(Date.now()).slice(-6);
    }
  };

  const handleCreateDossier = async (data: NewDossierFormData, entryPhotos: CapturedPhoto[]) => {
    if (!companyId || !profile?.id) {
      toast.error('Erreur: informations de connexion manquantes');
      return;
    }

    setIsCreating(true);
    const toastId = toast.loading('Création du dossier en cours...');

    try {
      // 1. Create client
      const client = await clientsService.create({
        firstName: data.prenom || '',
        lastName: data.nom,
        phone: data.mobile,
      });

      if (!client?.id) {
        throw new Error('Erreur lors de la création du client');
      }

      // 2. Create vehicle
      const vehicleData: any = {
        client_id: client.id,
        license_plate: data.immatriculation,
        status: 'En atelier'
      };

      if (data.brand_id) vehicleData.brand_id = data.brand_id;
      if (data.model_id) vehicleData.model_id = data.model_id;
      if (data.vin) vehicleData.vin = data.vin;

      const vehicle = await vehiclesService.create(vehicleData);

      if (!vehicle?.id) {
        throw new Error('Erreur lors de la création du véhicule');
      }

      // 3. Generate reference
      const reference = await generateNextReference();

      // 4. Determine initial workshop status
      let atelierStatus = 'entree_atelier';
      if (data.expertisePrevue && data.dateExpertise) {
        atelierStatus = 'expertise_planifiee';
      }

      // 5. Create repair order
      const repairOrderData: any = {
        reference,
        client_id: client.id,
        vehicle_id: vehicle.id,
        status: 'En attente',
        atelier_status: atelierStatus,
        notes: data.notes || null,
        arrival_date: new Date().toISOString().split('T')[0]
      };

      if (data.numeroSinistre) {
        repairOrderData.claim_number = data.numeroSinistre;
      }

      if (data.expertisePrevue && data.dateExpertise) {
        repairOrderData.expertise_date = data.dateExpertise;
        if (data.heureExpertise) {
          repairOrderData.expertise_time = data.heureExpertise;
        }
      }

      const repairOrder = await createRepairOrder(repairOrderData, companyId);

      if (!repairOrder?.id) {
        throw new Error('Erreur lors de la création de l\'ordre de réparation');
      }

      // 6. Upload entry photos
      if (entryPhotos.length > 0) {
        toast.loading('Upload des photos...', { id: toastId });
        
        for (let i = 0; i < entryPhotos.length; i++) {
          const result = await uploadVehiclePhoto(
            vehicle.id,
            profile.id,
            companyId,
            entryPhotos[i].blob,
            `Photo entrée ${i + 1}`,
            'entry'
          );
          
          if (!result.success) {
            console.error(`Erreur upload photo ${i + 1}:`, result.error);
          }
        }
      }

      toast.success('Dossier créé avec succès !', { id: toastId });
      setShowNewDossier(false);
      refetchAll();
      refetchActive();
      refetchArchived();
      refetchCounts();

    } catch (error: any) {
      console.error('Erreur création dossier:', error);
      toast.error(error.message || 'Erreur lors de la création du dossier', { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6 max-w-[1400px]">
      {/* Header with 3 action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[hsl(var(--karrosserie-orange))]/10 rounded-xl">
              <FolderOpen className="h-6 w-6 text-[hsl(var(--karrosserie-orange))]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Dossiers</h1>
          </div>
          <p className="text-sm text-muted-foreground pl-[52px]">
            Gérez vos dossiers sinistre de manière centralisée
          </p>
        </div>
        
        {/* 3 Action buttons per Figma spec */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button 
            onClick={() => setShowNewDossier(true)} 
            size="sm"
            className="gap-2 bg-[hsl(var(--karrosserie-orange))] hover:bg-[hsl(var(--karrosserie-orange))]/90 text-white shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau dossier</span>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <DossierStatsRow 
        counts={statusCounts} 
        isLoading={isLoadingCounts}
        onStatusClick={(status) => {
          if (selectedStatuses.includes(status)) {
            setSelectedStatuses(selectedStatuses.filter(s => s !== status));
          } else {
            setSelectedStatuses([...selectedStatuses, status]);
          }
        }}
      />

      {/* Filters with status toggles and date range */}
      <DossierFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tousCount={allDossiers.length}
        actifsCount={activeDossiers.length}
        archivesCount={archivedDossiers.length}
        selectedStatuses={selectedStatuses}
        onStatusFilterChange={setSelectedStatuses}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {/* Dossier list */}
      <DossierList
        dossiers={currentDossiers}
        isLoading={isLoading}
        onView={handleViewDossier}
        onArchive={handleArchiveDossier}
        onCreateNew={() => setShowNewDossier(true)}
      />

      {/* New Dossier Modal */}
      <NewDossierModal
        open={showNewDossier}
        onOpenChange={setShowNewDossier}
        onSubmit={handleCreateDossier}
        isSubmitting={isCreating}
      />
    </div>
  );
};

export default Dossiers;
