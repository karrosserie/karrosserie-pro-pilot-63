
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repairOrdersService, NewRepairOrder, UpdateRepairOrder } from '@/services/supabase/repair-orders';
import { useToast } from '@/hooks/use-toast';

export function useRepairOrders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: orders,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repairOrders'],
    queryFn: repairOrdersService.getAll
  });
  
  const createOrder = useMutation({
    mutationFn: (newOrder: NewRepairOrder) => repairOrdersService.create(newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairOrders'] });
      toast({
        title: "Ordre de réparation créé",
        description: "L'ordre de réparation a été créé avec succès."
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
    mutationFn: ({ id, data }: { id: string, data: UpdateRepairOrder }) => 
      repairOrdersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairOrders'] });
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
    mutationFn: (id: string) => repairOrdersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairOrders'] });
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

export function useRepairOrder(id?: string) {
  const {
    data: order,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repairOrders', id],
    queryFn: () => id ? repairOrdersService.getById(id) : null,
    enabled: !!id
  });
  
  return {
    order,
    isLoading,
    error
  };
}
