import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PlanningTask, PlanningDay } from './useRealPlanningData';

// Hook similaire à useRealPlanningData mais qui inclut TOUTES les tâches, même celles avec waiting_reason
export const useAllPlanningData = (companyId: string | null) => {
  console.log('🎯 ALL PLANNING HOOK START - companyId:', companyId);
  
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

  const fetchAllPlanningData = useCallback(async () => {
    try {
      console.log('🚀 fetchAllPlanningData START - companyId:', companyId);
      setLoading(true);
      
      if (!companyId) {
        console.log('❌ fetchAllPlanningData: Cannot fetch data - companyId is null/undefined');
        setLoading(false);
        return;
      }

      // Récupérer TOUTES les tâches programmées (y compris celles avec waiting_reason)
      console.log('📡 Querying ALL employee_schedule with joins...');
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

      console.log('📦 ALL Query result:', {
        dataLength: data?.length || 0,
        error: error,
        companyId,
        rawData: data
      });

      if (error) {
        console.error('❌ Error fetching all planning data:', error);
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
          dateAssignation: startDate.toISOString().split('T')[0],
          dateCreation: new Date(item.created_at),
          vehiculeId: item.vehicle_id ? parseInt(item.vehicle_id.toString()) : Date.now(),
          duree: Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)),
          jour: dayOfWeek,
          user_id: item.user_id,
          // Ajouter les champs spécifiques aux tâches en attente
          vehicle_id: item.vehicle_id, // IMPORTANT: Ajouter le vehicle_id original
          waiting_reason: item.waiting_reason,
          updated_at: item.updated_at
        };

        if (planningByDay[dayOfWeek]) {
          planningByDay[dayOfWeek].push(task);
        }
      });

      console.log('✅ ALL Planning data loaded:', planningByDay);
      setPlanningData(planningByDay);

    } catch (error) {
      console.error('❌ Unexpected error fetching all planning data:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    console.log('🎯 ALL useEffect TRIGGERED - companyId:', companyId, typeof companyId);
    
    if (!companyId) {
      console.log('🎯 NO companyId - returning early');
      setLoading(false);
      return;
    }

    console.log('🎯 CALLING fetchAllPlanningData...');
    fetchAllPlanningData();

  }, [companyId, fetchAllPlanningData]);

  return {
    planningData,
    loading,
    refetch: fetchAllPlanningData
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