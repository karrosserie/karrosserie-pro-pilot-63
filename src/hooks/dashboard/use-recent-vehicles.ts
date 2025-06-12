
import { useQuery } from '@tanstack/react-query';
import { useVehicles } from '@/hooks/use-vehicles';
import { useClients } from '@/hooks/use-clients';

export const useRecentVehicles = () => {
  const { vehicles } = useVehicles();
  const { clients } = useClients();

  const { data: recentVehicles } = useQuery({
    queryKey: ['recent-vehicles', vehicles, clients],
    queryFn: () => {
      if (!vehicles) return [];
      
      return vehicles
        .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
        .slice(0, 3)
        .map(vehicle => {
          // Trouver le client associé
          const client = clients?.find(c => c.id === vehicle.client_id);
          const clientName = client ? `${client.first_name} ${client.last_name}` : 'Client non assigné';
          
          return {
            id: vehicle.id,
            model: `${vehicle.brand || ''} ${vehicle.model || ''}`.trim() || 'Véhicule',
            licensePlate: vehicle.license_plate || 'N/A',
            client: clientName,
            status: vehicle.status || 'En attente',
            lastUpdate: new Date(vehicle.updated_at || vehicle.created_at).toLocaleDateString('fr-FR'),
            vehicleData: vehicle // Garder les données complètes pour les actions
          };
        });
    },
    enabled: !!vehicles && !!clients
  });

  return { recentVehicles };
};
