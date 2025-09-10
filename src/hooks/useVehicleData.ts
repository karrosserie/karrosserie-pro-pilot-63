import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Vehicle {
  id: string;
  plaque: string;
  modele: string;
  client: string;
  etape: string;
  sousEtape: string;
  temps: string;
  prix: string;
  status: 'en_cours' | 'planifie' | 'en_attente' | 'planifier' | 'termine';
  technicien?: string;
  dateDebut?: string;
  dateFin?: string;
  qualificationRequise: string;
}

export const useVehicleData = (companyId: string | null) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setLoading(false);
      return;
    }

    fetchVehicles();
  }, [companyId]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      
      // Récupérer les véhicules depuis employee_schedule
      const { data, error } = await supabase
        .from('employee_schedule')
        .select(`
          *
        `)
        .eq('company_id', companyId)
        .order('start_datetime', { ascending: true });

      if (error) {
        console.error('❌ Error fetching vehicles:', error);
        return;
      }

      // Récupérer les profils et véhicules séparément
      const userIds = [...new Set(data.map((item: any) => item.user_id).filter(Boolean))];
      const vehicleIds = [...new Set(data.map((item: any) => item.vehicle_id).filter(Boolean))];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);
      
      const { data: vehicles } = vehicleIds.length > 0 ? await supabase
        .from('vehicles')
        .select(`
          id,
          license_plate,
          color,
          brand_id,
          model_id,
          car_brands:brand_id (name),
          car_models:model_id (name),
          clients:client_id (
            id,
            first_name,
            last_name
          )
        `)
        .in('id', vehicleIds) : { data: [] };

      // Transformer les données pour correspondre à l'interface Vehicle
      const vehiclesData: Vehicle[] = data
        .filter(item => item.vehicle_id)
        .map((item: any) => {
          const vehicle = vehicles?.find(v => v.id === item.vehicle_id);
          const profile = profiles?.find(p => p.id === item.user_id);
          const technicienName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
          const brandName = vehicle?.car_brands?.name || '';
          const modelName = vehicle?.car_models?.name || '';
          const clientName = vehicle?.clients ? `${vehicle.clients.first_name || ''} ${vehicle.clients.last_name || ''}`.trim() : '';
          
          return {
            id: item.id,
            plaque: vehicle?.license_plate || `URG-${item.id.slice(0, 8).toUpperCase()}`,
            modele: `${brandName} ${modelName}`.trim() || 'Véhicule d\'urgence',
            client: clientName || 'Client non défini',
            etape: item.task_type || 'accueil',
            sousEtape: getTaskDescription(item.task_type),
            temps: calculateDuration(item.start_datetime, item.end_datetime),
            prix: '0€', // TODO: Calculer le prix réel
            status: mapStatus(item.status),
            technicien: technicienName || 'Technicien assigné',
            dateDebut: item.start_datetime,
            dateFin: item.end_datetime,
            qualificationRequise: item.task_type || 'accueil'
          };
        });

      console.log('✅ Vehicles loaded:', vehiclesData);
      setVehicles(vehiclesData);

    } catch (error) {
      console.error('❌ Unexpected error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicles,
    loading,
    refetch: fetchVehicles
  };
};

// Helper functions
const getTaskDescription = (taskType: string): string => {
  const descriptions = {
    'Accueil & Préparation du dossier': 'Réception et préparation',
    'Remplacement ou débosselage': 'Débosselage en cours',
    'Préparation peinture': 'Préparation surface',
    'Mise en peinture': 'Application peinture',
    'Finitions & remontage': 'Finitions finales',
    'Clôture du dossier et livraison': 'Contrôle et livraison'
  };
  return descriptions[taskType] || 'Tâche en cours';
};

const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) return '0h';
  
  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  
  return `${diffHours.toFixed(1)}h`;
};

const mapStatus = (status: string): 'en_cours' | 'planifie' | 'en_attente' | 'planifier' | 'termine' => {
  const statusMap = {
    'En attente': 'en_attente',
    'En cours': 'en_cours',
    'Terminé': 'termine',
    'Planifié': 'planifie'
  };
  return statusMap[status] || 'planifier';
};