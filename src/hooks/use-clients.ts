
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService, NewClient, UpdateClient } from '@/services/supabase/clients';
import { demoService, DEMO_MODE } from '@/services/demoService';
import { useToast } from '@/hooks/use-toast';
import { useCompanyId } from '@/hooks/use-company-id';

// Helper function to transform client data from database format to frontend format
const transformClientFromDB = (client: any) => {
  if (!client) return client;
  
  return {
    ...client,
    firstName: client.first_name,
    lastName: client.last_name,
    zipCode: client.postal_code,
    driverLicenseFrontUrl: client.driver_license_front_url || '',
    driverLicenseBackUrl: client.driver_license_back_url || '',
  };
};

export function useClients() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { companyId } = useCompanyId();
  
  const {
    data: clients,
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients', companyId],
    queryFn: async () => {
      if (DEMO_MODE) {
        const { data } = await demoService.clients.getAll();
        return data?.map(transformClientFromDB) || [];
      }
      if (!companyId) return [];
      const data = await clientsService.getAll(companyId);
      return data?.map(transformClientFromDB) || [];
    },
    enabled: DEMO_MODE || !!companyId
  });
  
  const createClient = useMutation({
    mutationFn: (newClient: any) => {
      console.log('Creating client with data:', newClient);
      if (DEMO_MODE) {
        return demoService.clients.create(newClient);
      }
      return clientsService.create(newClient);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client créé",
        description: "Le client a été créé avec succès."
      });
    },
    onError: (error) => {
      console.error('Error creating client:', error);
      toast({
        title: "Erreur",
        description: `Impossible de créer le client: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => {
      console.log('Updating client with id and data:', id, data);
      if (DEMO_MODE) {
        return demoService.clients.update(id, data);
      }
      return clientsService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès."
      });
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le client: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const deleteClient = useMutation({
    mutationFn: (id: string) => {
      if (DEMO_MODE) {
        return demoService.clients.delete(id);
      }
      return clientsService.delete(id);
    },
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
      if (DEMO_MODE) {
        const { data } = await demoService.clients.getById(id);
        return transformClientFromDB(data);
      }
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
