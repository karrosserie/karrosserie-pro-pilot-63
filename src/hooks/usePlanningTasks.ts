import { useMemo, useCallback, useState, useEffect } from 'react';
import { useRealPlanningData } from './useRealPlanningData';
import { PlanningTache } from './usePlanningManager';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook pour convertir les données de planning réelles en format PlanningTache
 * compatible avec l'ancien système et PlanningEmploye
 */
export const usePlanningTasks = (companyId: string | null) => {
  const { planningData, loading, refetch, fetchWaitingTasks } = useRealPlanningData(companyId);
  
  // État pour les tâches en attente
  const [waitingTasks, setWaitingTasks] = useState<any[]>([]);
  const [waitingTasksLoading, setWaitingTasksLoading] = useState(false);

  // Charger les tâches en attente
  const loadWaitingTasks = useCallback(async () => {
    if (!companyId) return;
    
    setWaitingTasksLoading(true);
    try {
      const tasks = await fetchWaitingTasks();
      setWaitingTasks(tasks);
    } catch (error) {
      console.error('❌ Error loading waiting tasks:', error);
    } finally {
      setWaitingTasksLoading(false);
    }
  }, [companyId, fetchWaitingTasks]);

  // Charger les tâches en attente au montage et quand companyId change
  useEffect(() => {
    loadWaitingTasks();
  }, [loadWaitingTasks]);

  // Convertir PlanningTask[] vers PlanningTache[] pour chaque jour
  const planningTaches = useMemo(() => {
    const tasks: PlanningTache[] = [];
    
    // Sécuriser l'accès aux données de planning
    if (!planningData || typeof planningData !== 'object') {
      console.log('🚫 No planning data available');
      return tasks;
    }
    
    console.log('🔍 Converting planning data:', {
      keys: Object.keys(planningData),
      totalTasks: Object.values(planningData).flat().length,
      dataStructure: Object.entries(planningData).map(([day, dayTasks]) => ({
        day,
        taskCount: dayTasks.length,
        tasks: dayTasks.map(t => ({ id: t.id, vehicule: t.vehicule, technicien: t.technicien, jour: t.jour, dateAssignation: t.dateAssignation }))
      }))
    });
    
    try {
      // Parcourir chaque jour pour préserver l'information du jour
      Object.entries(planningData).forEach(([dayKey, dayTasks]) => {
        if (!Array.isArray(dayTasks)) return;
        
        dayTasks.forEach(task => {
          if (!task || typeof task !== 'object') return;
          
          const planningTache: PlanningTache = {
            id: task.id || `task_${Date.now()}_${Math.random()}`,
            vehiculeId: task.vehiculeId || (task.id ? parseInt(task.id.replace(/\D/g, '').slice(0, 8)) : Date.now()) || Date.now(),
            vehicule: task.vehicule || '',
            modele: task.modele || '',
            marque: (task.modele || '').split(' ')[0] || 'Marque',
            heure: task.heure || '9h-10h',
            technicien: task.technicien || '',
            tache: task.tache || '',
            etape: task.etape || '',
            client: task.client || '',
            duree: task.duree || 2,
            status: task.status || 'planifie',
            dateCreation: task.dateCreation || new Date(),
            dateAssignation: task.dateAssignation || new Date().toISOString().split('T')[0],
            // Préserver le jour de la semaine depuis la task (déjà défini dans useRealPlanningData)
            jour: task.jour || dayKey || 'aujourd\'hui',
            // Préserver le user_id pour l'association correcte
            user_id: task.user_id
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

  // Grouper les tâches par employé (par nom ET par user_id pour compatibilité)
  const planningTachesByEmployee = useMemo(() => {
    const tasksByEmployeeName: { [employeeName: string]: PlanningTache[] } = {};
    const tasksByEmployeeId: { [employeeId: string]: PlanningTache[] } = {};
    
    console.log('🔍 Grouping tasks by employee, total tasks:', planningTaches.length);
    
    planningTaches.forEach(task => {
      // Grouper par nom (ancien système)
      if (!tasksByEmployeeName[task.technicien]) {
        tasksByEmployeeName[task.technicien] = [];
      }
      tasksByEmployeeName[task.technicien].push(task);
      
      // Grouper par user_id (nouveau système) - récupérer depuis les métadonnées de la tâche
      const taskUserId = task.user_id;
      if (taskUserId) {
        if (!tasksByEmployeeId[taskUserId]) {
          tasksByEmployeeId[taskUserId] = [];
        }
        tasksByEmployeeId[taskUserId].push(task);
        
        console.log('📝 Task assigned to employee:', {
          taskId: task.id,
          vehicule: task.vehicule,
          technicien: task.technicien,
          userId: taskUserId,
          dateAssignation: task.dateAssignation
        });
      }
    });
    
    console.log('✅ Tasks grouped:', {
      byName: Object.keys(tasksByEmployeeName),
      byId: Object.keys(tasksByEmployeeId),
      totalByName: Object.values(tasksByEmployeeName).flat().length,
      totalById: Object.values(tasksByEmployeeId).flat().length
    });
    
    return { tasksByEmployeeName, tasksByEmployeeId };
  }, [planningTaches]);

  // Obtenir les tâches pour un employé spécifique (par nom OU par ID)
  const getTasksForEmployee = (employeeNameOrId: string): PlanningTache[] => {
    console.log('🔍 Searching tasks for employee:', employeeNameOrId);
    
    // Essayer d'abord par nom (système actuel)
    const tasksByName = planningTachesByEmployee.tasksByEmployeeName[employeeNameOrId] || [];
    
    // Essayer ensuite par ID (système amélioré)
    const tasksById = planningTachesByEmployee.tasksByEmployeeId[employeeNameOrId] || [];
    
    // Priorité aux tâches trouvées par ID, sinon par nom
    const result = tasksById.length > 0 ? tasksById : tasksByName;
    
    console.log('📊 Tasks found for employee:', {
      searchKey: employeeNameOrId,
      tasksByName: tasksByName.length,
      tasksById: tasksById.length,
      finalResult: result.length,
      tasks: result.map(t => ({ id: t.id, vehicule: t.vehicule, technicien: t.technicien }))
    });
    
    return result;
  };
  
  // Nouvelle fonction spécifique pour recherche par user_id
  const getTasksForEmployeeById = (employeeId: string): PlanningTache[] => {
    console.log('🆔 Searching tasks by employee ID:', employeeId);
    const tasks = planningTachesByEmployee.tasksByEmployeeId[employeeId] || [];
    
    console.log('📊 Tasks found by ID:', {
      employeeId,
      tasksFound: tasks.length,
      tasks: tasks.map(t => ({ id: t.id, vehicule: t.vehicule, technicien: t.technicien, dateAssignation: t.dateAssignation }))
    });
    
    return tasks;
  };

  // Obtenir toutes les tâches d'aujourd'hui
  const getTodayTasks = (): PlanningTache[] => {
    const today = new Date().toISOString().split('T')[0];
    console.log('🔍 getTodayTasks - Filtering for today:', today);
    console.log('🔍 All tasks available:', planningTaches.map(t => ({ 
      id: t.id, 
      vehicule: t.vehicule, 
      dateAssignation: t.dateAssignation,
      isToday: t.dateAssignation === today
    })));
    
    const todayTasks = planningTaches.filter(task => task.dateAssignation === today);
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

  // Fonction pour changer le statut d'une tâche vers "En attente"
  const setTaskWaiting = async (taskId: string, reason?: string) => {
    try {
      console.log('🔄 Setting task to waiting status:', { taskId, reason });
      
      const { error } = await supabase
        .from('employee_schedule')
        .update({ 
          status: 'En attente',
          // Optionnellement, on pourrait ajouter une colonne pour la raison
        })
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error updating task status:', error);
        throw error;
      }

      // Recharger les données
      await Promise.all([
        refetch(),
        loadWaitingTasks()
      ]);
      
      console.log('✅ Task status updated successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error in setTaskWaiting:', error);
      return { success: false, error };
    }
  };

  // Fonction pour reprendre une tâche en attente
  const resumeWaitingTask = async (taskId: string) => {
    try {
      console.log('🔄 Resuming waiting task:', taskId);
      
      const { error } = await supabase
        .from('employee_schedule')
        .update({ 
          status: 'En attente' // Remettre en "En attente" normal (pas "En attente")
        })
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error resuming task:', error);
        throw error;
      }

      // Recharger les données
      await Promise.all([
        refetch(),
        loadWaitingTasks()
      ]);
      
      console.log('✅ Task resumed successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error in resumeWaitingTask:', error);
      return { success: false, error };
    }
  };

  return {
    planningTaches,
    planningTachesByEmployee,
    getTasksForEmployee,
    getTasksForEmployeeById, // Nouvelle fonction
    getTodayTasks,
    getAllWorkflowTasks, // Nouvelle fonction pour les étapes atelier
    waitingTasks, // Nouvelles tâches en attente
    waitingTasksLoading,
    setTaskWaiting, // Fonction pour mettre en attente
    resumeWaitingTask, // Fonction pour reprendre une tâche
    loading,
    refetch: async () => {
      await refetch();
      await loadWaitingTasks();
    }
  };
};