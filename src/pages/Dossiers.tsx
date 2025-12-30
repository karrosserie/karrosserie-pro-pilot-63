import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban } from 'lucide-react';
import { DossierFilters, DossierList } from '@/components/dossiers';
import { NewDossierModal, NewDossierFormData } from '@/components/atelier/modals/NewDossierModal';
import { useDossiers, useArchiveDossier } from '@/hooks/useDossiers';
import { useCompanyId } from '@/hooks/use-company-id';
import { useAuth } from '@/contexts/AuthContext';
import { DossierOverallStatus } from '@/types/dossier';
import { toast } from 'sonner';
import { clientsService } from '@/services/supabase/clients';
import { vehiclesService } from '@/services/supabase/vehicles';
import { createRepairOrder } from '@/services/supabase/repair-orders/mutations';
import { repairOrdersService } from '@/services/supabase/repair-orders';
import { uploadVehiclePhoto } from '@/utils/vehiclePhotoService';

interface CapturedPhoto {
  blob: Blob;
  preview: string;
}

const Dossiers = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { companyId } = useCompanyId();

  const [activeTab, setActiveTab] = useState<'en_cours' | 'clotures'>('en_cours');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDossier, setShowNewDossier] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Statuses for "En cours" tab (all active statuses except cloture and archive)
  const enCoursStatuses: DossierOverallStatus[] = [
    'ouvert', 'en_cours', 'expertise', 'devis', 'reparation', 'facturation'
  ];

  // Fetch dossiers for "En cours" tab
  const { data: enCoursDossiers = [], isLoading: isLoadingEnCours, refetch: refetchEnCours } = useDossiers({
    company_id: companyId,
    overall_status: enCoursStatuses,
    archived: false,
    search: searchQuery || undefined,
  });

  // Fetch dossiers for "Clôturées" tab
  const { data: cloturesDossiers = [], isLoading: isLoadingClotures, refetch: refetchClotures } = useDossiers({
    company_id: companyId,
    overall_status: 'cloture',
    archived: false,
    search: searchQuery || undefined,
  });

  const archiveDossier = useArchiveDossier();

  const currentDossiers = activeTab === 'en_cours' ? enCoursDossiers : cloturesDossiers;
  const isLoading = activeTab === 'en_cours' ? isLoadingEnCours : isLoadingClotures;

  const handleViewDossier = (id: string) => {
    navigate(`/gestion-atelier?dossierId=${id}`);
  };

  const handleArchiveDossier = async (id: string) => {
    try {
      await archiveDossier.mutateAsync(id);
      toast.success('Dossier archivé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'archivage du dossier');
    }
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
      refetchEnCours();
      refetchClotures();

    } catch (error: any) {
      console.error('Erreur création dossier:', error);
      toast.error(error.message || 'Erreur lors de la création du dossier', { id: toastId });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderKanban className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Gestion des Dossiers</h1>
        </div>
        <Button onClick={() => setShowNewDossier(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau dossier
        </Button>
      </div>

      {/* Filters */}
      <DossierFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        enCoursCount={enCoursDossiers.length}
        cloturesCount={cloturesDossiers.length}
      />

      {/* Dossier list */}
      <DossierList
        dossiers={currentDossiers}
        isLoading={isLoading}
        onView={handleViewDossier}
        onArchive={handleArchiveDossier}
        onCreateNew={() => setShowNewDossier(true)}
      />

      {/* New Dossier Modal - Reused from Atelier */}
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
