import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { useToast } from '@/hooks/use-toast';
import { repairOrdersService } from '@/services/supabase/repair-orders';
import { NewRepairOrder, UpdateRepairOrder } from '@/services/supabase/repair-orders/types';
import { useCompanyId } from '@/hooks/use-company-id';
import { useDetailedTracking } from '@/hooks/tracking/useDetailedTracking';

export function useRepairOrders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { companyId } = useCompanyId();
  const { trackAction } = useDetailedTracking();

  const {
    data: orders,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repair-orders'],
    queryFn: repairOrdersService.getAll
  });

  const createOrder = useMutation({
    mutationFn: async (orderData: NewRepairOrder) => {
      if (!companyId) {
        throw new Error('Company ID not found. User must be authenticated and belong to a company.');
      }
      return await repairOrdersService.create(orderData, companyId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
      // Ne pas afficher de toast si c'est une conversion depuis un devis
      // (le toast sera géré par le composant appelant)
      if (!(variables as any)?.quote_id) {
        toast({
          title: "Ordre de réparation créé",
          description: "L'ordre de réparation a été créé avec succès."
        });
      }
      
      // Track OR creation
      trackAction('or_created', {
        or_id: data?.id,
        or_reference: data?.reference,
        client_id: data?.client_id,
        vehicle_id: data?.vehicle_id,
        total_amount: data?.total_amount,
        converted_from_quote: !!(variables as any)?.quote_id
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer l'ordre de réparation: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: UpdateRepairOrder }) => {
      return await repairOrdersService.update(id, data);
    },
    onSuccess: (updatedOrder, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
      queryClient.invalidateQueries({ queryKey: ['repair-order', id] });
      toast({
        title: "Ordre de réparation mis à jour",
        description: "L'ordre de réparation a été mis à jour avec succès."
      });
      
      // Track OR update
      trackAction('or_updated', {
        or_id: id,
        or_reference: updatedOrder?.reference
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'ordre de réparation: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      return await repairOrdersService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
      toast({
        title: "Ordre de réparation supprimé",
        description: "L'ordre de réparation a été supprimé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'ordre de réparation: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const archiveOrder = useMutation({
    mutationFn: async (id: string) => {
      return await repairOrdersService.archive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
    },
    onError: (error) => {
      console.error('Archive repair order error:', error);
    }
  });

  const restoreOrder = useMutation({
    mutationFn: async (id: string) => {
      return await repairOrdersService.restore(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
    },
    onError: (error) => {
      console.error('Restore repair order error:', error);
    }
  });

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    archiveOrder,
    restoreOrder
  };
}
