
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService, NewClient, UpdateClient } from '@/services/supabase/clients';
import { useToast } from '@/hooks/use-toast';

// Helper function to transform client data from database format to frontend format
const transformClientFromDB = (client: any) => {
  if (!client) return client;
  
  return {
    ...client,
    firstName: client.first_name,
    lastName: client.last_name,
    zipCode: client.zip_code,
    driverLicenseFrontUrl: client.driver_license_front_url,
    driverLicenseBackUrl: client.driver_license_back_url,
  };
};

export function useClients() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    data: clients,
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const data = await clientsService.getAll();
      return data?.map(transformClientFromDB) || [];
    }
  });
  
  const createClient = useMutation({
    mutationFn: (newClient: any) => clientsService.create(newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client créé",
        description: "Le client a été créé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de créer le client: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      clientsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le client: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteClient = useMutation({
    mutationFn: (id: string) => clientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès."
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le client: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient
  };
}

export function useClient(id?: string) {
  const {
    data: client,
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients', id],
    queryFn: async () => {
      if (!id) return null;
      const data = await clientsService.getById(id);
      return transformClientFromDB(data);
    },
    enabled: !!id
  });
  
  return {
    client,
    isLoading,
    error
  };
}
