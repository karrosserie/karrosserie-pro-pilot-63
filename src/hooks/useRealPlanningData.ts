import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PlanningTask {
  id: string;
  vehicule: string;
  modele: string;
  heure: string;
  technicien: string;
  tache: string;
  etape: string;
  client: string;
  status: 'planifie' | 'en_cours' | 'termine';
  // Champs additionnels pour compatibilité avec PlanningEmploye
  dateAssignation?: string;
  dateCreation?: Date;
  vehiculeId?: number;
  duree?: number;
  jour?: string;
  user_id?: string; // Ajout du user_id pour l'association correcte
}

export interface PlanningDay {
  [key: string]: PlanningTask[];
}

export const useRealPlanningData = (companyId: string | null) => {
  console.log('🎯 HOOK START - companyId:', companyId);
  
  const [planningData, setPlanningData] = useState<PlanningDay>({
    lundi: [],
    mardi: [],
    mercredi: [],
    jeudi: [],
    vendredi: [],
    samedi: [],
    dimanche: []
  });
  const [loading, setLoading] = useState(true);

  console.log('🎯 HOOK STATE INITIALIZED');

  const fetchPlanningData = useCallback(async () => {
    try {
      console.log('🚀 fetchPlanningData START - companyId:', companyId);
      setLoading(true);
      
      if (!companyId) {
        console.log('❌ fetchPlanningData: Cannot fetch data - companyId is null/undefined');
        setLoading(false);
        return;
      }

      // Test de connectivité Supabase
      console.log('🔌 Testing Supabase connectivity...');
      
      // Récupérer les tâches programmées avec jointures
      console.log('📡 Querying employee_schedule with joins...');
      const { data, error } = await supabase
        .from('employee_schedule')
        .select(`
          *,
          profiles!user_id (
            id,
            first_name,
            last_name
          ),
          vehicles!employee_schedule_vehicle_id_fkey (
            id,
            license_plate,
            car_brands!vehicles_brand_id_fkey (
              id,
              name
            ),
            car_models!vehicles_model_id_fkey (
              id,
              name
            ),
            clients (
              id,
              first_name,
              last_name
            )
          )
        `)
        .eq('company_id', companyId)
        .order('start_datetime', { ascending: true });

      console.log('📦 Query result:', {
        dataLength: data?.length || 0,
        error: error,
        companyId,
        rawData: data
      });

      if (error) {
        console.error('❌ Error fetching planning data:', error);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.log('⚠️ No data found in employee_schedule for companyId:', companyId);
        setPlanningData({
          lundi: [],
          mardi: [],
          mercredi: [],
          jeudi: [],
          vendredi: [],
          samedi: [],
          dimanche: []
        });
        setLoading(false);
        return;
      }

      // Organiser les données par jour de la semaine
      const planningByDay: PlanningDay = {
        lundi: [],
        mardi: [],
        mercredi: [],
        jeudi: [],
        vendredi: [],
        samedi: [],
        dimanche: []
      };

      const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
      
      console.log('🔍 Processing joined data:', {
        totalTasks: data.length,
        rawData: data.map(item => ({
          id: item.id,
          user_id: item.user_id,
          vehicle_id: item.vehicle_id,
          task_type: item.task_type,
          start_datetime: item.start_datetime,
          profile: item.profiles,
          vehicle: item.vehicles
        }))
      });

      data.forEach((item: any) => {
        const startDate = new Date(item.start_datetime);
        const endDate = new Date(item.end_datetime);
        const dayOfWeek = dayNames[startDate.getDay()];
        
        // Extraire les données depuis les jointures
        const profile = item.profiles;
        const vehicle = item.vehicles;
        
        const technicienName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Technicien';
        const brandName = vehicle?.car_brands?.name || '';
        const modelName = vehicle?.car_models?.name || '';
        const clientName = vehicle?.clients ? `${vehicle.clients.first_name || ''} ${vehicle.clients.last_name || ''}`.trim() : '';
        
        console.log('🚀 Converting task:', {
          taskId: item.id,
          user_id: item.user_id,
          vehicleId: item.vehicle_id,
          task_type: item.task_type,
          technicienName,
          vehiculePlate: vehicle?.license_plate,
          clientName,
          dayOfWeek,
          profile,
          vehicle
        });
        
        const task: PlanningTask = {
          id: item.id,
          vehicule: vehicle?.license_plate || `Véhicule-${item.id}`,
          modele: `${brandName} ${modelName}`.trim() || 'Véhicule',
          heure: `${startDate.getHours()}h${startDate.getMinutes() > 0 ? startDate.getMinutes() : ''}-${endDate.getHours()}h${endDate.getMinutes() > 0 ? endDate.getMinutes() : ''}`,
          technicien: technicienName,
          tache: getTaskName(item.task_type),
          etape: item.task_type || 'accueil',
          client: clientName || 'Client non défini',
          status: mapTaskStatus(item.status),
          // Mapper les champs DB vers les champs attendus par PlanningEmploye
          dateAssignation: startDate.toISOString().split('T')[0], // Convertir start_datetime en dateAssignation
          dateCreation: new Date(item.created_at),
          vehiculeId: item.vehicle_id ? parseInt(item.vehicle_id.toString()) : Date.now(),
          duree: Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)), // Durée en heures
          jour: dayOfWeek,
          user_id: item.user_id // Important : conserver le user_id pour l'association
        };

        if (planningByDay[dayOfWeek]) {
          planningByDay[dayOfWeek].push(task);
        }
      });

      console.log('✅ Planning data loaded:', planningByDay);
      setPlanningData(planningByDay);

    } catch (error) {
      console.error('❌ Unexpected error fetching planning data:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    console.log('🎯 useEffect TRIGGERED - companyId:', companyId, typeof companyId);
    
    if (!companyId) {
      console.log('🎯 NO companyId - returning early');
      setLoading(false);
      return;
    }

    console.log('🎯 CALLING fetchPlanningData...');
    fetchPlanningData();

  }, [companyId, fetchPlanningData]);

  return {
    planningData,
    loading,
    refetch: fetchPlanningData
  };
};

// Helper functions
const getTaskName = (taskType: string): string => {
  const taskNames = {
    'Accueil & Préparation du dossier': 'Accueil & Préparation',
    'Remplacement ou débosselage': 'Débosselage',
    'Préparation peinture': 'Préparation peinture',
    'Mise en peinture': 'Mise en peinture',
    'Finitions & remontage': 'Finitions & remontage',
    'Clôture du dossier et livraison': 'Clôture & livraison'
  };
  return taskNames[taskType] || taskType || 'Tâche';
};

const mapTaskStatus = (status: string): 'planifie' | 'en_cours' | 'termine' => {
  const statusMap = {
    'En attente': 'planifie',
    'En cours': 'en_cours', 
    'Terminé': 'termine'
  };
  return statusMap[status] || 'planifie';
};