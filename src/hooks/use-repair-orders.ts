
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useRepairOrders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: orders,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repair-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_orders')
        .select(`
          *,
          clients(first_name, last_name),
          vehicles(
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching repair orders:', error);
        throw new Error(error.message);
      }

      return data;
    }
  });

  const createOrder = useMutation({
    mutationFn: async (orderData: any) => {
      const { data, error } = await supabase
        .from('repair_orders')
        .insert([orderData])
        .select(`
          *,
          clients(first_name, last_name),
          vehicles(
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .single();

      if (error) {
        console.error('Error creating repair order:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
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
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { data: result, error } = await supabase
        .from('repair_orders')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          clients(first_name, last_name),
          vehicles(
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .single();

      if (error) {
        console.error('Error updating repair order:', error);
        throw new Error(error.message);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
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
      const { error } = await supabase
        .from('repair_orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting repair order:', error);
        throw new Error(error.message);
      }

      return true;
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
