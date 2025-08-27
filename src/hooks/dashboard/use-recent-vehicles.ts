
import { useQuery } from '@tanstack/react-query';
import { useVehicles } from '@/hooks/use-vehicles';
import { useClients } from '@/hooks/use-clients';
import { DEMO_MODE, demoService } from '@/services/demoService';

export const useRecentVehicles = () => {
  const { vehicles } = DEMO_MODE ? { vehicles: [] } : useVehicles();
  const { clients } = DEMO_MODE ? { clients: [] } : useClients();

  const { data: recentVehicles } = useQuery({
    queryKey: ['recent-vehicles', vehicles, clients],
    queryFn: () => {
      if (DEMO_MODE) {
        return [
          { id: '1', brand: 'Renault', model: 'Clio', licensePlate: 'AB-123-CD', clientName: 'Marie Martin' },
          { id: '2', brand: 'Peugeot', model: '308', licensePlate: 'EF-456-GH', clientName: 'Pierre Durand' },
          { id: '3', brand: 'Volkswagen', model: 'Golf', licensePlate: 'IJ-789-KL', clientName: 'Sophie Bernard' }
        ];
      }
      
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
            model: `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''}`.trim() || 'Véhicule',
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
