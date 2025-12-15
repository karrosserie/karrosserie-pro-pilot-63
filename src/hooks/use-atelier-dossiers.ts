import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/use-company-id';
import { Dossier } from '@/types/atelier';
import { toast } from 'sonner';

// Mapping des statuts repair_orders vers statuts atelier
const mapRepairOrderStatus = (roStatus: string, hasExpertise: boolean, expertiseDate?: string | null): string => {
  switch (roStatus) {
    case 'En attente':
      if (expertiseDate) return 'expertise_planifiee';
      if (hasExpertise) return 'attente_expertise';
      return 'entree_atelier';
    case 'En cours':
      return 'en_reparation';
    case 'Signé':
    case 'Terminé':
      return 'termine';
    case 'Clôturé':
      return 'cloture';
    default:
      return 'entree_atelier';
  }
};

export const useAtelierDossiers = () => {
  const { companyId } = useCompanyId();
  const queryClient = useQueryClient();

  const { data: dossiers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['atelier-dossiers', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      // Fetch repair orders with related data
      const { data: repairOrders, error } = await supabase
        .from('repair_orders')
        .select(`
          id,
          reference,
          status,
          created_at,
          arrival_date,
          start_date,
          end_date,
          notes,
          clients (
            id,
            first_name,
            last_name,
            phone,
            email
          ),
          vehicles (
            id,
            license_plate,
            vin,
            mileage,
            car_brands (
              name
            ),
            car_models (
              name
            )
          )
        `)
        .eq('company_id', companyId)
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!repairOrders) return [];

      // Fetch expertise reports for these repair orders
      const vehicleIds = repairOrders
        .map(ro => (ro.vehicles as any)?.id)
        .filter((id): id is string => !!id);
      
      let expertiseByVehicle = new Map<string, { id: string; vehicle_id: string; report_date: string | null; status: string | null }>();
      
      if (vehicleIds.length > 0) {
        const { data: expertiseReports } = await supabase
          .from('expertise_reports')
          .select('id, vehicle_id, report_date, status')
          .in('vehicle_id', vehicleIds);
        
        if (expertiseReports) {
          expertiseByVehicle = new Map(expertiseReports.map(e => [e.vehicle_id, e]));
        }
      }

      // Transform to Dossier format
      const transformedDossiers: Dossier[] = repairOrders.map(ro => {
        const vehicle = ro.vehicles as any;
        const expertise = vehicle?.id ? expertiseByVehicle.get(vehicle.id) : undefined;
        const client = ro.clients as any;
        
        const arrivalDate = ro.arrival_date ? new Date(ro.arrival_date) : new Date(ro.created_at);
        const expertiseDate = expertise?.report_date;
        
        const brandName = vehicle?.car_brands?.name || '';
        const modelName = vehicle?.car_models?.name || '';
        
        return {
          id: ro.id,
          repairOrderId: ro.id,
          clientId: client?.id,
          vehicleId: vehicle?.id,
          nom: client?.last_name || 'Inconnu',
          prenom: client?.first_name || '',
          immatriculation: vehicle?.license_plate || 'N/A',
          mobile: client?.phone || '',
          email: client?.email || undefined,
          dateEntree: arrivalDate.toISOString().split('T')[0],
          heureEntree: arrivalDate.toTimeString().slice(0, 5),
          status: mapRepairOrderStatus(ro.status || 'En attente', !!expertise, expertiseDate),
          expertisePrevue: !!expertise,
          expertiseEffectuee: expertise?.status === 'Terminé',
          dateExpertise: expertiseDate ? new Date(expertiseDate).toISOString().split('T')[0] : undefined,
          heureExpertise: expertiseDate ? new Date(expertiseDate).toTimeString().slice(0, 5) : undefined,
          dateFin: ro.end_date || (ro.status === 'Terminé' || ro.status === 'Signé' ? ro.created_at : undefined),
          dateRestitution: ro.end_date ? new Date(ro.end_date).toISOString().split('T')[0] : undefined,
          heureRestitution: ro.end_date ? new Date(ro.end_date).toTimeString().slice(0, 5) : undefined,
          notes: ro.notes || undefined,
          marqueModele: `${brandName} ${modelName}`.trim() || undefined,
          vin: vehicle?.vin || undefined,
          kmEntree: vehicle?.mileage?.toString() || undefined,
          relances: [],
          historique: [{ 
            date: ro.created_at, 
            action: 'Création', 
            status: 'entree_atelier' 
          }]
        };
      });

      return transformedDossiers;
    },
    enabled: !!companyId,
    staleTime: 30000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, endDate }: { id: string; status: string; endDate?: string }) => {
      // Map atelier status back to repair_order status
      let roStatus = 'En attente';
      switch (status) {
        case 'en_reparation':
          roStatus = 'En cours';
          break;
        case 'termine':
        case 'rdv_restitution':
          roStatus = 'Terminé';
          break;
        case 'cloture':
          roStatus = 'Clôturé';
          break;
        default:
          roStatus = 'En attente';
      }

      const updateData: Record<string, unknown> = { status: roStatus };
      if (endDate) {
        updateData.end_date = endDate;
      }

      const { error } = await supabase
        .from('repair_orders')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atelier-dossiers'] });
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour');
      console.error(error);
    }
  });

  return {
    dossiers,
    isLoading,
    error,
    refetch,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending
  };
};
