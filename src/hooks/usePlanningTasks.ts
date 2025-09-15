import { useMemo } from 'react';
import { useRealPlanningData } from './useRealPlanningData';
import { useAllPlanningData } from './useAllPlanningData';

export interface PlanningTache {
  id: string;
  vehiculeId: number;
  vehicule: string;
  modele: string;
  marque: string;
  heure: string;
  technicien: string;
  tache: string;
  etape: string;
  client: string;
  duree: number;
  status: string;
  dateCreation: Date;
  dateAssignation: string;
  jour: string;
  user_id?: string;
  waiting_reason?: string;
  updated_at?: string;
}

export const usePlanningTasks = (companyId: string | null) => {
  console.log('🎯 usePlanningTasks HOOK START - companyId:', companyId);
  
  // Hook pour les données filtrées (sans waiting_reason)
  const { planningData, loading, refetch } = useRealPlanningData(companyId);
  
  // Hook pour TOUTES les données (y compris waiting_reason)  
  const { planningData: allPlanningData, loading: allLoading } = useAllPlanningData(companyId);

  // Convertir les données de planning en format PlanningTache (données filtrées)
  const planningTaches = useMemo(() => {
    const tasks: PlanningTache[] = [];
    
    try {
      if (!planningData) {
        console.log('⚠️ Pas de données de planning disponibles');
        return tasks;
      }
      
      console.log('🔄 Converting planning data to PlanningTache format...', {
        planningDataKeys: Object.keys(planningData),
        totalTasksCount: Object.values(planningData).reduce((acc, dayTasks) => acc + dayTasks.length, 0)
      });
      
      Object.entries(planningData).forEach(([dayKey, dayTasks]) => {
        console.log(`📅 Processing day: ${dayKey}, tasks: ${dayTasks.length}`);
        
        dayTasks.forEach(task => {
          const planningTache: PlanningTache = {
            id: task.id,
            vehiculeId: task.vehiculeId || parseInt(task.id.toString()), // Fallback en cas de vehiculeId manquant
            vehicule: task.vehicule,
            modele: task.modele,
            marque: task.modele.split(' ')[0] || 'Inconnue', // Extraire la marque du modèle
            heure: task.heure,
            technicien: task.technicien,
            tache: task.tache,
            etape: task.etape,
            client: task.client,
            duree: task.duree || 1, // Durée par défaut si manquante
            status: task.status,
            dateCreation: task.dateCreation || new Date(), // Date par défaut si manquante
            dateAssignation: task.dateAssignation || new Date().toISOString().split('T')[0], // Date par défaut si manquante
            jour: dayKey, // Utiliser la clé du jour comme jour
            user_id: task.user_id // Garder le user_id pour l'association
          };
          
          console.log('📝 Converting task:', {
            id: task.id,
            vehicule: task.vehicule,
            technicien: task.technicien,
            originalJour: task.jour,
            finalJour: planningTache.jour,
            dateAssignation: planningTache.dateAssignation,
            dayKey
          });
          
          tasks.push(planningTache);
        });
      });
    } catch (error) {
      console.error('❌ Erreur lors de la conversion des tâches de planning:', error);
    }
    
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.dateAssignation === today);
    
    console.log('✅ Planning tasks converted:', {
      originalTasksCount: planningData ? Object.values(planningData).flat().length : 0,
      convertedTasksCount: tasks.length,
      tasksToday: todayTasks.length,
      todayTasksDetails: todayTasks.map(t => ({
        id: t.id,
        vehicule: t.vehicule,
        technicien: t.technicien,
        heure: t.heure,
        jour: t.jour,
        dateAssignation: t.dateAssignation
      }))
    });
    
    return tasks;
  }, [planningData]);

  // Convertir TOUTES les données de planning (y compris waiting_reason)
  const allPlanningTaches = useMemo(() => {
    const allTasks: PlanningTache[] = [];
    
    try {
      if (!allPlanningData) {
        console.log('⚠️ Pas de données de planning (all) disponibles');
        return allTasks;
      }
      
      Object.entries(allPlanningData).forEach(([dayKey, dayTasks]) => {
        dayTasks.forEach(task => {
          const planningTache: PlanningTache = {
            id: task.id,
            vehiculeId: task.vehiculeId || parseInt(task.id.toString()),
            vehicule: task.vehicule,
            modele: task.modele,
            marque: task.modele.split(' ')[0] || 'Inconnue',
            heure: task.heure,
            technicien: task.technicien,
            tache: task.tache,
            etape: task.etape,
            client: task.client,
            duree: task.duree || 1,
            status: task.status,
            dateCreation: task.dateCreation || new Date(),
            dateAssignation: task.dateAssignation || new Date().toISOString().split('T')[0],
            jour: dayKey,
            user_id: task.user_id,
            waiting_reason: task.waiting_reason,
            updated_at: task.updated_at
          };
          
          allTasks.push(planningTache);
        });
      });
    } catch (error) {
      console.error('❌ Erreur lors de la conversion des tâches de planning (all):', error);
    }
    
    return allTasks;
  }, [allPlanningData]);

  // Grouper les tâches par employé (par nom ET par user_id pour compatibilité)
  const planningTachesByEmployee = useMemo(() => {
    const tasksByEmployeeName: { [employeeName: string]: PlanningTache[] } = {};
    const tasksByEmployeeId: { [employeeId: string]: PlanningTache[] } = {};
    
    planningTaches.forEach(tache => {
      // Grouper par nom d'employé (pour compatibilité avec l'ancien code)
      if (!tasksByEmployeeName[tache.technicien]) {
        tasksByEmployeeName[tache.technicien] = [];
      }
      tasksByEmployeeName[tache.technicien].push(tache);
      
      // Grouper par user_id (pour l'association correcte)
      if (tache.user_id) {
        if (!tasksByEmployeeId[tache.user_id]) {
          tasksByEmployeeId[tache.user_id] = [];
        }
        tasksByEmployeeId[tache.user_id].push(tache);
      }
    });
    
    console.log('👥 Tasks grouped by employee:', {
      employeeNames: Object.keys(tasksByEmployeeName),
      employeeIds: Object.keys(tasksByEmployeeId),
      tasksByEmployeeName,
      tasksByEmployeeId
    });
    
    return { tasksByEmployeeName, tasksByEmployeeId };
  }, [planningTaches]);

  // Fonctions pour récupérer les tâches par employé
  const getTasksForEmployee = (employeeNameOrId: string): PlanningTache[] => {
    console.log('🔍 Getting tasks for employee:', employeeNameOrId);
    
    // Priorité à la recherche par ID
    if (planningTachesByEmployee.tasksByEmployeeId[employeeNameOrId]) {
      const tasks = planningTachesByEmployee.tasksByEmployeeId[employeeNameOrId];
      console.log('✅ Found tasks by ID:', tasks.length, 'tasks');
      return tasks;
    }
    
    // Fallback sur le nom
    if (planningTachesByEmployee.tasksByEmployeeName[employeeNameOrId]) {
      const tasks = planningTachesByEmployee.tasksByEmployeeName[employeeNameOrId];
      console.log('✅ Found tasks by name:', tasks.length, 'tasks');
      return tasks;
    }
    
    console.log('⚠️ No tasks found for employee:', employeeNameOrId);
    return [];
  };

  const getTasksForEmployeeById = (employeeId: string): PlanningTache[] => {
    console.log('🆔 Getting tasks for employee by ID:', employeeId);
    
    const tasks = planningTachesByEmployee.tasksByEmployeeId[employeeId] || [];
    console.log('✅ Tasks found by ID:', tasks.length);
    
    return tasks;
  };

  // Fonction pour obtenir les tâches d'aujourd'hui
  const getTodayTasks = (): PlanningTache[] => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = planningTaches.filter(task => task.dateAssignation === today);
    
    console.log('📅 Today tasks:', {
      today,
      todayTasksCount: todayTasks.length,
      todayTasks: todayTasks.map(t => ({
        id: t.id,
        vehicule: t.vehicule,
        technicien: t.technicien,
        dateAssignation: t.dateAssignation
      }))
    });
    
    console.log('🔍 Tasks for today:', todayTasks.length);
    
    return todayTasks;
  };

  // Obtenir toutes les tâches pour les étapes atelier (indépendamment de la date)
  const getAllWorkflowTasks = (): PlanningTache[] => {
    console.log('🏭 getAllWorkflowTasks - Returning all tasks for workshop stages:', planningTaches.length);
    console.log('🏭 All workflow tasks:', planningTaches.map(t => ({ 
      id: t.id, 
      vehicule: t.vehicule, 
      dateAssignation: t.dateAssignation,
      status: t.status,
      etape: t.etape
    })));
    
    return planningTaches;
  };

  // Fonction pour récupérer TOUTES les tâches (y compris celles avec waiting_reason) pour l'onglet véhicules en attente
  const getAllTasksIncludingWaiting = (): PlanningTache[] => {
    console.log('🔧 Getting ALL tasks including waiting for vehicles tab:', allPlanningTaches.length);
    console.log('🔧 ALL tasks sample:', allPlanningTaches.slice(0, 3).map(t => ({
      id: t.id,
      vehicule: t.vehicule,
      waiting_reason: t.waiting_reason,
      status: t.status
    })));
    return allPlanningTaches;
  };

  return {
    planningTaches,
    planningTachesByEmployee,
    getTasksForEmployee,
    getTasksForEmployeeById,
    getTodayTasks,
    getAllWorkflowTasks,
    getAllTasksIncludingWaiting,
    loading: loading || allLoading,
    refetch
  };
};