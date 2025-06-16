
import { useQuery } from '@tanstack/react-query';
import { repairOrdersService } from '@/services/supabase/repair-orders';

export function useRepairOrder(id?: string) {
  const {
    data: order,
    isLoading,
    error
  } = useQuery({
    queryKey: ['repair-order', id],
    queryFn: async () => {
      if (!id) return null;
      return await repairOrdersService.getById(id);
    },
    enabled: !!id
  });

  return {
    order,
    isLoading,
    error
  };
}
