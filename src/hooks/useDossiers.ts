import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossiersQueries, dossiersMutations } from '@/services/supabase/dossiers';
import type { 
  DossierFilters, 
  CreateDossierParams, 
  UpdateDossierParams 
} from '@/types/dossier';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to fetch a single dossier by ID with all relations
 */
export function useDossier(id: string | undefined) {
  return useQuery({
    queryKey: ['dossier', id],
    queryFn: () => dossiersQueries.getById(id!),
    enabled: !!id,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch a list of dossiers with filters
 */
export function useDossiers(filters?: DossierFilters) {
  return useQuery({
    queryKey: ['dossiers', filters],
    queryFn: () => dossiersQueries.list(filters),
    staleTime: 30000,
  });
}

/**
 * Hook to fetch invoices for a specific dossier
 */
export function useDossierInvoices(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossier-invoices', dossierId],
    queryFn: () => dossiersQueries.getInvoicesForDossier(dossierId!),
    enabled: !!dossierId,
    staleTime: 30000,
  });
}

/**
 * Hook to fetch messageries for a specific dossier
 */
export function useDossierMessageries(dossierId: string | undefined) {
  return useQuery({
    queryKey: ['dossier-messageries', dossierId],
    queryFn: () => dossiersQueries.getMessageriesForDossier(dossierId!),
    enabled: !!dossierId,
    staleTime: 30000,
  });
}

/**
 * Hook to fetch dossier by repair order ID
 */
export function useDossierByRepairOrder(repairOrderId: string | undefined) {
  return useQuery({
    queryKey: ['dossier-by-repair-order', repairOrderId],
    queryFn: () => dossiersQueries.getByRepairOrderId(repairOrderId!),
    enabled: !!repairOrderId,
    staleTime: 30000,
  });
}

/**
 * Hook to fetch dossier by quote ID
 */
export function useDossierByQuote(quoteId: string | undefined) {
  return useQuery({
    queryKey: ['dossier-by-quote', quoteId],
    queryFn: () => dossiersQueries.getByQuoteId(quoteId!),
    enabled: !!quoteId,
    staleTime: 30000,
  });
}

/**
 * Hook to fetch dossiers count by status
 */
export function useDossiersCountByStatus(companyId: string | undefined) {
  return useQuery({
    queryKey: ['dossiers-count-by-status', companyId],
    queryFn: () => dossiersQueries.getCountByStatus(companyId!),
    enabled: !!companyId,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to create a new dossier
 */
export function useCreateDossier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (params: CreateDossierParams) => dossiersMutations.create(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossiers-count-by-status'] });
      toast({
        title: 'Succès',
        description: 'Dossier créé avec succès',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: `Impossible de créer le dossier: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to update a dossier
 */
export function useUpdateDossier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params: UpdateDossierParams }) => 
      dossiersMutations.update(id, params),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossier', id] });
      queryClient.invalidateQueries({ queryKey: ['dossiers-count-by-status'] });
      toast({
        title: 'Succès',
        description: 'Dossier mis à jour avec succès',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: `Impossible de mettre à jour le dossier: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to archive a dossier
 */
export function useArchiveDossier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => dossiersMutations.archive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossier', id] });
      queryClient.invalidateQueries({ queryKey: ['dossiers-count-by-status'] });
      toast({
        title: 'Succès',
        description: 'Dossier archivé avec succès',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: `Impossible d'archiver le dossier: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to unarchive a dossier
 */
export function useUnarchiveDossier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => dossiersMutations.unarchive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossier', id] });
      queryClient.invalidateQueries({ queryKey: ['dossiers-count-by-status'] });
      toast({
        title: 'Succès',
        description: 'Dossier désarchivé avec succès',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: `Impossible de désarchiver le dossier: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to link entities to a dossier
 */
export function useLinkToDossier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      dossierId, 
      entityType, 
      entityId 
    }: { 
      dossierId: string; 
      entityType: 'expertise_report' | 'quote' | 'repair_order' | 'cession' | 'fleet_reservation';
      entityId: string;
    }) => {
      switch (entityType) {
        case 'expertise_report':
          return dossiersMutations.linkExpertiseReport(dossierId, entityId);
        case 'quote':
          return dossiersMutations.linkQuote(dossierId, entityId);
        case 'repair_order':
          return dossiersMutations.linkRepairOrder(dossierId, entityId);
        case 'cession':
          return dossiersMutations.linkCession(dossierId, entityId);
        case 'fleet_reservation':
          return dossiersMutations.linkFleetReservation(dossierId, entityId);
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
    },
    onSuccess: (_, { dossierId }) => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossier', dossierId] });
      toast({
        title: 'Succès',
        description: 'Entité liée au dossier avec succès',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: `Impossible de lier l'entité au dossier: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to find or create a dossier
 */
export function useFindOrCreateDossier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: CreateDossierParams) => dossiersMutations.findOrCreate(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['dossiers-count-by-status'] });
    },
  });
}
