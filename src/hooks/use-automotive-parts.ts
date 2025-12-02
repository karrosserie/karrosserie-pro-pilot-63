import { useQuery } from '@tanstack/react-query';
import { automotivePartsService, AutomotivePart } from '@/services/supabase/automotive-parts';

export function useAutomotiveParts() {
  return useQuery<AutomotivePart[]>({
    queryKey: ['automotive-parts'],
    queryFn: automotivePartsService.getAll,
    staleTime: 1000 * 60 * 60, // Cache 1 heure
  });
}

export function useAutomotivePartsByCategory(category: 'fourniture' | 'piece_carrosserie') {
  return useQuery<AutomotivePart[]>({
    queryKey: ['automotive-parts', category],
    queryFn: () => automotivePartsService.getByCategory(category),
    staleTime: 1000 * 60 * 60,
  });
}

export function useAutomotivePartNames() {
  return useQuery<string[]>({
    queryKey: ['automotive-part-names'],
    queryFn: automotivePartsService.getPartNames,
    staleTime: 1000 * 60 * 60,
  });
}
