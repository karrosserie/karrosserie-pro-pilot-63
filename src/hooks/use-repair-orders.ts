
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { repairOrdersService } from '@/services/supabase/repair-orders';
import { NewRepairOrder, UpdateRepairOrder } from '@/services/supabase/repair-orders/types';
import { demoService, DEMO_MODE } from '@/services/demoService';
import { useCompanyId } from '@/hooks/use-company-id';

export function useRepairOrders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { companyId } = useCompanyId();

  const {
    data: orders,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repair-orders'],
    queryFn: async () => {
      if (DEMO_MODE) {
        const { data } = await demoService.repairOrders.getAll();
        return data || [];
      }
      return repairOrdersService.getAll();
    }
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

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder
  };
}
