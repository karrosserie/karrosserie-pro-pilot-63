
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useRepairOrder(id?: string) {
  const {
    data: order,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repair-order', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('repair_orders')
        .select(`
          *,
          clients(id, first_name, last_name),
          vehicles(
            id,
            license_plate,
            brand,
            model,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching repair order:', error);
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id
  });

  return {
    order,
    isLoading,
    error
  };
}
