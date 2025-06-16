
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useCredits() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: credits,
    isLoading,
    error
  } = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credits')
        .select(`
          *,
          clients(id, first_name, last_name),
          vehicles(
            id,
            license_plate,
            car_brands(id, name),
            car_models(id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching credits:', error);
        throw new Error(error.message);
      }

      return data;
    }
  });

  const createCredit = useMutation({
    mutationFn: async (creditData: any) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      // Add user_id to credit data
      const dataWithUserId = {
        ...creditData,
        user_id: user.id
      };

      console.log('Creating credit with user_id:', dataWithUserId);

      const { data, error } = await supabase
        .from('credits')
        .insert([dataWithUserId])
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
        console.error('Error creating credit:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir créé",
        description: "L'avoir a été créé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer l'avoir: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateCredit = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { data: result, error } = await supabase
        .from('credits')
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
        console.error('Error updating credit:', error);
        throw new Error(error.message);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir mis à jour",
        description: "L'avoir a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour l'avoir: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const deleteCredit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('credits')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting credit:', error);
        throw new Error(error.message);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast({
        title: "Avoir supprimé",
        description: "L'avoir a été supprimé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'avoir: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return {
    credits,
    isLoading,
    error,
    createCredit,
    updateCredit,
    deleteCredit
  };
}
